/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const createPrompt = (availableMaterials, drinkName, cupSize) => {
  const context = `Your task is to check the list of available alcohol and adjust the amounts of each alcohol needed for the drink. If any ingredient is not available, you should declare it in the response JSON. Your output will be a JSON object with two parts. The first part will be an array of objects representing the ingredients for the drink, along with the amount of ingredient in milliliters (ml) needed for the drink. The second part will be a string containing the instructions for making the drink, including the order in which the ingredients should be added to the cup, and the total amount of liquid to be served. Here is an example input: { 'drink': 'Tequila Shot', 'available_alcohol': {'tequila': '1000 ml', 'blue curacao': '1000 ml'}, 'cup': '60 ml', 'language': 'ES_MX' }. Example of the response: { ingredients: [ { 'Tequila Jose Cuervo Reposado': '60 ml' }, { 'Jugo de limon': '10 ml' } ], instructions: 'En un vaso sirve 60 ml de Tequila Jose Cuervo Reposado. Agrega 10 ml de Jugo de limon. Servir y disfrutar.' }`;
  const promptMaterials = {};

  if (!availableMaterials) {
    return null;
  }

  for (const material of availableMaterials) {
    promptMaterials[material.name] = material.currentQuantity + " ml";
  }
  const orderPrompt = `Here is the input: {'drink': '${drinkName}','available_alcohol': ${JSON.stringify(
    promptMaterials,
    (key, value) => {
      if (typeof value === "string") {
        return value.replace(/"/g, "'");
      }
      return value;
    },
    0
  )}, 'cup': '${cupSize}', 'language': 'ES_MX' }`;

  return {
    context,
    prompt: orderPrompt,
  };
};

const generateMessage = (availableIngredients, ingredients) => {
  return ingredients.map((ingredient) => {
    const name = Object.keys(ingredient)[0];
    const slot = availableIngredients.find((item) => item.name === name).slot;
    const amount = ingredient[name];
    const id = availableIngredients.find((item) => item.name === name).id;
    return { id, slot, amount };
  });
};

module.exports = {
  startOrder: async (req, res) => {
    let steps = [];
    const { connection, hasRecipie, recipie, drinkName, cupSize } = req.body;

    const order = await Order.create({
      status: "pending",
      shotNumber: 1,
      connection: connection,
    }).fetch();

    const conQuery = await Connection.findOne({
      where: { id: connection },
    })
      .populate("users")
      .populate("printers");

    try {
      if (hasRecipie) {
        const drinkRecipie = await Drink.findOne({
          where: { id: recipie },
        });
        steps = drinkRecipie.steps;
      } else {
        const availableMaterials = await Material.find({
          where: { printer: conQuery.printers.id },
          select: ["id", "name", "currentQuantity", "slot"],
        });

        const prompts = createPrompt(availableMaterials, drinkName, cupSize);

        const result = await sails.helpers.askGpt([
          { role: "system", content: prompts.context },
          { role: "user", content: prompts.prompt },
        ]);
        console.log("[result]", result);
        console.log("[ingredients]", result.ingredients);
        console.log("[instructions]", result.instructions);

        const filteredMessage = generateMessage(
          availableMaterials,
          result.ingredients
        );

        console.log("filtered", filteredMessage);

        await Drink.create({
          name: drinkName,
          steps: filteredMessage,
          materials: result.ingredients,
          description: result.instructions,
          customer: conQuery.users.id,
        });

        await Prompt.create({
          prompt: prompts.prompt,
          result: filteredMessage,
          order: order.id,
        }).fetch();

        steps = filteredMessage;
      }

      await Order.update({ id: order.id }).set({
        status: "ready",
      });
      const message = await sails.helpers.sendAwsNotification(
        "ESP_32/orders",
        steps
      );

      return res.json({
        data: message,
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      await Order.update({ id: order.id }).set({
        status: "Failed",
      });
      return res.json({
        data: error,
      });
    }
  },
};
