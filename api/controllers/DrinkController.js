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
    const name = Object.keys(material)[0].toLowerCase();
    const availableMaterial = availableMaterials.find((m) =>
      m.name?.toLowerCase().includes(name)
    );

    if (
      !availableMaterial ||
      availableMaterial.currentQuantity <
        Math.max(cup, parseFloat(material.amount))
    ) {
      insufficientMaterials.push(material);
    } else {
      sufficientMaterials.push(material);
    }
  }

  return {
    insufficient: insufficientMaterials,
    sufficient: sufficientMaterials,
  };
};

module.exports = {
  checkAvailability: async (req, res) => {
    const { name, connection, cup } = req.query;

    const connectionObj = await Connection.findOne({
      where: { id: connection },
    })
      .populate("users")
      .populate("printers");

    const userObj = connectionObj?.users?.id;

    const recipeObj = await Drink.findOne({
      where: { name, customer: userObj },
    });

    const hasRecipe = !!recipeObj;

    if (!hasRecipe) {
      return res.json({
        data: {
          hasRecipe,
          recipe: false,
          sufficientMaterialLength: 0,
          emptyMaterialLength: 0,
        },
      });
    }

    const requiredMaterials = recipeObj.materials;
    const availableMaterials = await Material.find({
      where: { printer: connectionObj.printers.id },
    });

    const { insufficient: emptyMaterials, sufficient: sufficientMaterials } =
      validateMaterials(requiredMaterials, availableMaterials, cup);

    return res.json({
      data: {
        hasRecipe,
        recipe: recipeObj.id,
        sufficientMaterialLength: sufficientMaterials.length,
        emptyMaterialLength: emptyMaterials.length,
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
