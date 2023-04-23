/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "GET /health": {
    controller: "HealthController",
    action: "health",
  },

  "GET /user/like": {
    controller: "UserController",
    action: "findLike",
  },

  "GET /printer/like": {
    controller: "PrinterController",
    action: "findLike",
  },

  "GET /connection/:printerCode": {
    controller: "ConnectionController",
    action: "findUserWithPrinter",
  },

  "POST /prompt/order-drink": {
    controller: "PromptController",
    action: "askDrink",
  },
};
