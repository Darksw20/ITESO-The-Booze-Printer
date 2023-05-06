/**
 * DrinkController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  checkAvailability: async (req, res) => {
    const { name, connection, cup } = req.query;

    const conQuery = await Connection.findOne({
      where: { id: connection },
    })
      .populate("users")
      .populate("printers");

    const query = await Drink.findOne({
      where: { name, customer: conQuery.id },
    });

    const hasRecipie = query ? true : false;
    const insufficientMaterials = [];

    if (hasRecipie) {
      const requiredMaterials = query.materials;
      const availableMaterials = await Material.find({
        where: { printer: conQuery.id },
      });

      for (const material of requiredMaterials) {
        const availableMaterial = availableMaterials.find((m) =>
          m.name.toLowerCase().includes(material.name.toLowerCase())
        );
        const neededAmount = parseFloat(availableMaterial?.currentQuantity);
        const currentAmount = parseFloat(material.amount.split(" ")[0]);
        if (
          !availableMaterial ||
          (neededAmount < cup && neededAmount < currentAmount)
        ) {
          insufficientMaterials.push(material);
        }
      }
    }
    return res.json({
      data: {
        hasRecipie,
        recipie: query ? query.id : false,
        emptyMaterials: insufficientMaterials ? insufficientMaterials : false,
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
