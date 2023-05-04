/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const context = `Your task is to check the list of available alcohol and adjust the amounts of each alcohol needed for the drink. If any required alcohol is not available, you should declare it in the response JSON. Your output will be a JSON object with three parts. The first part will be an array of objects representing the types of alcohol required for the drink, along with the amount of each alcohol in milliliters (ml) needed for the drink. The second part will be a string containing the instructions for making the drink, including the order in which the ingredients should be added to the cup, and the total amount of liquid to be served. Finally, you should include a quick joke in the chosen language while the drink is being served. Here is an example input: { "drink": "Medusa Shot", "available_alcohol": {'tequila': '1000 ml', 'blue curacao': '1000 ml', 'grenadine': '200 ml'}, "cup": "60 ml", "language": "ES_MX" }`;

module.exports = {
  startOrder: async (req, res) => {
    let steps = [];
    const { connection, hasRecipie, recipie, emptyMaterials } = req.body;
    const order = await Order.create({
      status: "pending",
      shotNumber: 1,
      connection: connection,
    }).fetch();
    try {
      if (hasRecipie) {
        const drinkRecipie = await Drink.findOne({
          where: { id: recipie },
        });
        steps = drinkRecipie.steps;
      } else {
        const orderPrompt = `Here is the input: 
        {
          "drink": "${recipie.drink}",
          "available_alcohol": ${JSON.stringify(recipie.availableAlcohol)},
          "cup": "${recipie.cup}",
          "language": "${recipie.language}"
        }`;

        const result = await sails.helpers.askGpt([
          { role: "system", content: context },
          { role: "user", content: orderPrompt },
        ]);

        await Prompt.create({
          prompt: orderPrompt,
          result: result,
          order: order.id,
        }).fetch();

        steps = result.ingredients;
      }

      console.log(steps);

      await Order.update({ id: order.id }).set({
        status: "ready",
      });

      const message = await sails.helpers.sendAwsNotification({
        channel: "ESP_32/orders",
        steps,
      });

      await Order.update({ id: order.id }).set({
        status: "Served",
      });

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
