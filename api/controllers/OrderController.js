/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const drinkService = require("../services/drinkService");

module.exports = {
  startOrder: async (req, res) => {
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
      let steps = [];
      const hasRecipeWithName = await Drink.count({
        name: { contains: drinkName },
      });

      if (hasRecipie) {
        const drinkRecipie = await Drink.findOne({ where: { id: recipie } });
        steps = drinkRecipie.steps;
      } else if (hasRecipeWithName > 0) {
        const drinkRecipie = await Drink.findOne({
          where: { name: { contains: drinkName } },
        });
        steps = drinkRecipie.steps;
      } else {
        steps = await drinkService.askForDrink(
          conQuery.printers.id,
          conQuery.users.id,
          order.id,
          drinkName,
          cupSize
        );
      }

      if (!steps) {
        await Order.updateOne({ id: order.id }).set({
          status: "Unavailable Materials",
        });

        return res.json({
          data: "Unavailable Materials",
        });
      }

      await Order.updateOne({ id: order.id }).set({
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
      console.log(error.message);
      await Order.updateOne({ id: order.id }).set({
        status: "Failed",
      });
      return res.json({
        data: error,
      });
    }
  },
};
