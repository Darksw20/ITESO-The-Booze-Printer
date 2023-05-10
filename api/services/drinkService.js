/**
 * drinkService
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const createPrompt = (availableMaterials, drinkName, cupSize) => {
  if (!availableMaterials) {
    return null;
  }

  const context = `Your task is to check the list of available alcohol and adjust the amounts of each alcohol needed for the drink. If any ingredient is not available, you should declare it in the response JSON. Your output will be a JSON object with two parts. The first part will be an array of objects representing the ingredients for the drink, along with the amount of ingredient in milliliters (ml) needed for the drink. The second part will be a string containing the instructions for making the drink, including the order in which the ingredients should be added to the cup, and the total amount of liquid to be served. Here is an example input: { 'drink': 'Tequila Shot', 'available_alcohol': {'tequila': '1000 ml', 'blue curacao': '1000 ml'}, 'cup': '60 ml', 'language': 'ES_MX' }. Example of the response if exist the ingredients: { ingredients: [ { 'Tequila Jose Cuervo Reposado': '60 ml' }, { 'Jugo de limon': '10 ml' } ], instructions: 'En un vaso sirve 60 ml de Tequila Jose Cuervo Reposado. Agrega 10 ml de Jugo de limon. Servir y disfrutar.' }. Example of the response if dont exist the ingredients:{ ingredients: null,instructions:null}`;

  const promptMaterials = availableMaterials.reduce((acc, curr) => {
    return { ...acc, [curr.name]: `${curr.currentQuantity} ml` };
  }, {});

  const orderPrompt = `Here is the input: {'drink': '${drinkName}','available_alcohol': ${JSON.stringify(
    promptMaterials
  ).replace(/"/g, "'")}, 'cup': '${cupSize}', 'language': 'ES_MX' }`;

  return { context, prompt: orderPrompt };
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
  askForDrink: async function (printerId, userId, orderId, drinkName, cupSize) {
    const availableMaterials = await Material.find({
      where: { printer: printerId },
      select: ["id", "name", "currentQuantity", "slot"],
    });

    const prompts = createPrompt(availableMaterials, drinkName, cupSize);

    const result = await sails.helpers.askGpt([
      { role: "system", content: prompts.context },
      { role: "user", content: prompts.prompt },
    ]);

    if (
      JSON.stringify(result.ingredients).includes("null") ||
      JSON.stringify(result.ingredients).includes("undefined")
    ) {
      return null;
    }

    const filteredMessage = generateMessage(
      availableMaterials,
      result.ingredients
    );

    await Drink.create({
      name: drinkName,
      steps: filteredMessage,
      materials: result.ingredients,
      description: result.instructions,
      customer: userId,
    });

    await Prompt.create({
      prompt: prompts.prompt,
      result: filteredMessage,
      order: orderId,
    });
    return filteredMessage;
  },
};
