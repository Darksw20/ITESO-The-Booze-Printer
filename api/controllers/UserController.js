/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  find: async (req, res) => {
    const query = await User.find({
      where: req.query,
    });
    return res.json({
      data: query,
    });
  },
};
