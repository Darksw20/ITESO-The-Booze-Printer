/**
 * PrinterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  find: async (req, res) => {
    const query = await Printer.find({
      where: req.query,
    });
    return res.json({
      data: query,
    });
  },
};
