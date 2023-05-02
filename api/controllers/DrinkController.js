/**
 * DrinkController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  checkAvailability: async (req, res) => {
    const query = await Drink.findOne({
      where: { name: req.query.name, customer: req.query.customer },
    });

    const hasRecipie = query ? true : false;

    if (hasRecipie) {
      const requiredMaterials = query.materials;
      const availableMaterials = await Material.find({
        where: { printer: req.query.printerCode }
      });

      const insufficientMaterials = [];

      for (const material of requiredMaterials) {
        const availableMaterial = availableMaterials.find(m => m.name.includes(material.name));
        if (!availableMaterial || parseFloat(availableMaterial.currentQuantity) < parseFloat(material.amount.split(" ")[0])) {
          insufficientMaterials.push(material);
        }
      }

      return res.json({
        data: {
          hasRecipie,
          recipie: query,
          emptyMaterials: insufficientMaterials
        },
      });
    }
    return res.json({
      data: {
        hasRecipie,
        recipie: query,
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
