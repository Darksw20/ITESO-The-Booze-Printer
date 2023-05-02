/**
 * DrinkController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  find: async (req, res) => {
    const query = await Drink.findOne({
      where: req.query,
    });

    const hasRecipie = query ? true : false;

    if (hasRecipie) {
      const materials = query.materials;


    }

    return res.json({
      data: {
        hasRecipie,
        recipie: query
      },
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
    const query = await Drink.find({ where });
    return res.json({
      data: query,
    });
  },
};
