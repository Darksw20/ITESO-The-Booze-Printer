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
  //if ((await User.count()) > 0) {
  //  return;
  //}
  //
  //await User.createEach([
  //  {
  //    username: "Ryan Dahl",
  //    password: "qwerty123456",
  //    email: "ry@example.com",
  //  },
  //]);
  //
  //await DeviceType.createEach([
  //  {
  //    name: "Alexa Gen. 2",
  //    company: "Amazon",
  //  },
  //  {
  //    name: "Google Assistant",
  //    company: "Google",
  //  },
  //]);
  //
  //await MaterialType.createEach([
  //  {
  //    name: "Tequila",
  //    alterNames: ["Jose Cuervo"],
  //  },
  //  {
  //    name: "Ron",
  //    alterNames: ["Kraken"],
  //  },
  //]);
  // ```
};
