/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const context = `Your task is to check the list of available alcohol and adjust the amounts of each alcohol needed for the drink. If any required alcohol is not available, you should declare it in the response JSON. Your output will be a JSON object with three parts. The first part will be an array of objects representing the types of alcohol required for the drink, along with the amount of each alcohol in milliliters (ml) needed for the drink. The second part will be a string containing the instructions for making the drink, including the order in which the ingredients should be added to the cup, and the total amount of liquid to be served. Finally, you should include a quick joke in the chosen language while the drink is being served. Here is an example input: { "drink": "Medusa Shot", "available_alcohol": {'tequila': '1000 ml', 'blue curacao': '1000 ml', 'grenadine': '200 ml'}, "cup": "60 ml", "language": "ES_MX" }`;

module.exports = {
  startOrder: async (req, res) => {
    const { drink, availableAlcohol, cup, language, connection } = req.body;

    const order = await Order.create({
      status: "pending",
      shotNumber: 1,
      connection: connection,
    }).fetch();

    const orderPrompt = `Here is the input: 
    {
        "drink": "${drink}",
        "available_alcohol": ${JSON.stringify(availableAlcohol)},
        "cup": "${cup}",
        "language": "${language}"
    }`;

    console.log("orderPrompt", orderPrompt);

    const result = await sails.helpers.askGpt([
      { role: "system", content: context },
      { role: "user", content: orderPrompt },
    ]);

    const prompt = await Prompt.create({
      prompt: orderPrompt,
      result: result,
      order: order.id,
    }).fetch();

    return res.json({
      data: prompt,
    });
  },
};
