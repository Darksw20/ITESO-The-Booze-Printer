/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {
  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // Set up fake development data (or if we already have some, avast)
  if ((await User.count()) > 0) {
    return;
  }

  await User.createEach([
    {
      username: "Ryan Dahl",
      password: "qwerty123456",
      email: "ry@example.com",
    },
  ]);

  await DeviceType.createEach([
    {
      name: "Alexa Gen. 2",
      company: "Amazon",
    },
    {
      name: "Google Assistant",
      company: "Google",
    },
  ]);

  await MaterialType.createEach([
    {
      name: "Tequila",
      alterNames: ["Jose Cuervo"],
    },
    {
      name: "Ron",
      alterNames: ["Kraken"],
    },
  ]);

  await Device.createEach([
    {
      uuid: "dsadsa-dsadsa-dsadsa-dsadsa",
      status: "online",
      ip: "127.12.12.12",
      device: 1,
    },
  ]);

  await Printer.createEach([{ ip: "127.12.12.12" }]);

  await Session.createEach([{ ip: "127.12.12.12" }]);

  await Connection.createEach([
    {
      devices: 1,
      printers: 1,
      users: 1,
      sessions: 1,
    },
  ]);

  await Material.createEach([
    {
      name: "Tequila Jose Cuervo Reposado",
      slot: 1,
      originalQuantity: 1000,
      currentQuantity: 500,
      printer: 1,
      material: 1,
    },
    {
      name: "Ron Kraken",
      slot: 2,
      originalQuantity: 1000,
      currentQuantity: 1000,
      printer: 1,
      material: 2,
    },
  ]);

  await Drink.createEach([
    {
      name: "margarita",
      steps: [
        { name: "tequila", amount: "30 ml" },
        { name: "triple sec", amount: "15 ml" },
        { name: "lime juice", amount: "30 ml" },
      ],
      materials: [
        { name: "tequila", amount: "30 ml" },
        { name: "triple sec", amount: "15 ml" },
        { name: "lime juice", amount: "30 ml" },
      ],
      description:
        "Primero, añade 30 ml de tequila al shot. Luego, añade 15 ml de blue curacao. Por último, agrega 5 ml de grenadine. Sirve en un shot de 60 ml. ¡Salud!",
      customer: 1,
    },
    {
      name: "tequila shot",
      steps: [
        {
          name: "tequila",
          amount: "30 ml",
        },
      ],
      materials: [
        {
          name: "tequila",
          amount: "30 ml",
        },
      ],
      description:
        "Primero, añade 30 ml de tequila al shot. Luego, añade 15 ml de blue curacao. Por último, agrega 5 ml de grenadine. Sirve en un shot de 60 ml. ¡Salud!",
      customer: 1,
    },
  ]);

  await Order.createEach([
    {
      status: "pending",
      shotsNumber: 1,
      connection: 1,
    },
  ]);

  await Prompt.createEach([
    {
      prompt:
        "Here is the input: Drink: 'Medusa Shot' available_alcohol: {'tequila': '1000 ml', 'blue curacao': '1000 ml','grenadine': '200 ml'} Cup: '60 ml. Shot' Language: 'ES_MX'",
      result: {
        ingredients: [
          {
            name: "tequila",
            quantity: "30 ml",
          },
          {
            name: "blue curacao",
            quantity: "15 ml",
          },
          {
            name: "grenadine",
            quantity: "5 ml",
          },
        ],
        instructions:
          "Para hacer un Medusa Shot, agregue primero la grenadina al fondo de un vasito de chupito. Luego, con cuidado, agregue el blue curacao. Por último, añada suavemente el tequila. Sirva 50 ml en el vasito de chupito. Salud!",
        joke: "¿Por qué el tequila no juega al fútbol? Porque siempre hace tiros libres.",
      },
      order: 1,
    },
  ]);

  await Score.createEach([
    {
      score: 10,
      judge: 1,
    },
  ]);

  // ```
};
