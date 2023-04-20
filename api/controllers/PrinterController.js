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

  create: async (req, res) => {
    const newPrinter = await Printer.create(req.body).fetch();
    return res.json({
      data: newPrinter,
    });
  },

  findLike: async (req, res) => {
    const where = {};
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        where[key] = { contains: req.query[key] };
      } else {
        where[key] = req.query[key];
      }
    }
    const query = await Printer.find({ where });
    return res.json({
      data: query,
    });
  },
};
