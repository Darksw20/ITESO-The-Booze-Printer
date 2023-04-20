/**
 * ConnectionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  findUserWithPrinter: async (req, res) => {
    const printerCode = req.params.printerCode;
    const username = req.query.username;
    try {
      const user = await User.findOne()
        .where({
          username: { contains: username },
        })
        .populate("connections", {
          printers: printerCode,
        });

      return res.json({ data: user });
    } catch (err) {
      return res.serverError(err);
    }
  },
};
