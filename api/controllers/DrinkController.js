/**
 * DrinkController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const validateMaterials = (requiredMaterials, availableMaterials, cup) => {
  const insufficientMaterials = [];
  const sufficientMaterials = [];

  for (const material of requiredMaterials) {
    const availableMaterial = availableMaterials.find((m) => {
      const name = Object.keys(material)[0];
      return m.name?.toLowerCase().includes(name?.toLowerCase());
    });
    const neededAmount = parseFloat(availableMaterial?.currentQuantity);
    const currentAmount = parseFloat(material.amount?.split(" ")[0]);
    if (
      !availableMaterial ||
      (neededAmount < cup && neededAmount < currentAmount)
    ) {
      insufficientMaterials.push(material);
    } else {
      sufficientMaterials.push(material);
    }
  }
  return {
    insufficient: insufficientMaterials ?? [],
    sufficient: sufficientMaterials ?? [],
  };
};

module.exports = {
  checkAvailability: async (req, res) => {
    const { name, connection, cup } = req.query;

    let result;

    const conQuery = await Connection.findOne({
      where: { id: connection },
    })
      .populate("users")
      .populate("printers");

    const recipie = await Drink.findOne({
      where: { name, customer: conQuery.users.id },
    });

    const hasRecipie = recipie ? true : false;

    if (hasRecipie) {
      const requiredMaterials = recipie.materials;
      const availableMaterials = await Material.find({
        where: { printer: conQuery.printers.id },
      });

      result = validateMaterials(requiredMaterials, availableMaterials, cup);
    }
    return res.json({
      data: {
        hasRecipie,
        recipie: recipie ? recipie.id : false,
        availableMaterialLength: result.sufficient.length,
        emptyMaterialLength: result.insufficient.length,
        availableMaterials: result.sufficient,
        emptyMaterials: result.insufficient,
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
