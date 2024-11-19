const asyncHandler = require("../utils/asyncHandler");
const Product = require("../model/product.model");
const ApiResponse = require("../utils/ApiResponse");
const {
  MONGOOSE_VALIDATION_ERROR,
  MONGOOSE_CAST_ERROR,
  MONGOOSE_OBJECT_ID,
  SIMPLE,
  VARIABLE,
} = require("../constants/models.constants");
const Variation = require("../model/variation.model");
const invalidFieldMessage = require("../utils/invalidFieldMessage");
const Attribute = require("../model/attribute.model");

const handleErrors = async (res, error) => {
  console.log("Handling Errors");
  if (error.name === MONGOOSE_VALIDATION_ERROR) {
    return ApiResponse.validationError(
      res,
      "Variation addition failed",
      invalidFieldMessage(error),
      400
    );
  }

  if (error.name === MONGOOSE_CAST_ERROR && error.kind === MONGOOSE_OBJECT_ID) {
    return ApiResponse.validationError(
      res,
      "Variation addition failed",
      {
        id: "Invalid product ID provided",
      },
      400
    );
  }

  return ApiResponse.error(res, "Error while adding variation", 500, error);
};

const updateAttributes = async (attributes) => {
  console.log("Updating Attributes");
  await Promise.all(
    attributes.map(async (attribute) => {
      const attributeByName = await Attribute.findOne({
        name: attribute.name,
      });
      if (!attributeByName) {
        return {
          attributes: `This is interesting. This should not happen. Error finding attribute with {name: ${attribute.name}}`,
        };
      }

      let values = attributeByName.values || [];

      if (!values.includes(attribute.value)) {
        values.push(attribute.value);
        attributeByName.values = [...new Set(values)];

        await attributeByName.save();
      }

      return null;
    })
  );
};

const validateAttributes = (productAttributes, variationAttributes) => {
  console.log("Validating Attributes");
  if (productAttributes.length !== variationAttributes.length) {
    return {
      attributes:
        "Number of attributes in variation must match number of attributes in product",
    };
  }
  const areAttributesValid = variationAttributes.every((attribute) => {
    return (
      Object.keys(attribute).length === 2 &&
      Object.keys(attribute).includes("name") &&
      Object.keys(attribute).includes("value")
    );
  });

  if (!areAttributesValid) {
    return {
      attributes: "All attributes must have only two fields: name and value",
    };
  }
  return null;
};

const createVariation = async (res, variationData) => {
  console.log("creating variation");
  const variation = await Variation.create(variationData);
  return ApiResponse.success(
    res,
    "Variation added successfully",
    variation,
    201
  );
};

const addAVariation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let { sku, price, salePrice, stockQuantity, attributes } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return ApiResponse.notFound(
        res,
        "Product with given id doesn't exist",
        404
      );
    }

    // Validate salePrice
    if (salePrice < price) {
      return ApiResponse.validationError(
        res,
        "Variation addition failed",
        {
          salePrice: "Sale price can't be less than price",
        },
        400
      );
    }

    if (product.productType === SIMPLE) {
      attributes = attributes || [];
      if (attributes.length !== 0) {
        return ApiResponse.validationError(
          res,
          "Variation addition failed",
          {
            attributes:
              "You are trying to add attributes to a simple product. Simple products can't have attributes",
          },
          400
        );
      }

      return await createVariation(res, {
        sku,
        price,
        salePrice,
        stockQuantity,
        productId: product._id,
      });
    }

    if (product.productType === VARIABLE) {
      attributes = attributes || [];
      const validationError = await validateAttributes(
        product.attributes,
        attributes
      );

      if (validationError) {
        return ApiResponse.validationError(
          res,
          "Variation addition failed",
          validationError,
          400
        );
      }

      let updateAttributeError = await updateAttributes(attributes);

      if (updateAttributeError) {
        return ApiResponse.validationError(
          res,
          "Variation addition failed",
          updateAttributeError,
          400
        );
      }

      return await createVariation(res, {
        sku,
        price,
        salePrice,
        stockQuantity,
        attributes,
        productId: product._id,
      });
    }
  } catch (error) {
    return handleErrors(res, error);
  }
});

const updateAVariation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // variation id
    const allowedUpdates = [
      "sku",
      "price",
      "salePrice",
      "stockQuantity",
      "attributes",
    ];
    const fieldsToUpdate = Object.keys(req.body).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = updates[key];
      }
      return acc;
    }, {});

    const product = await Variation.findById(id);

    if (!product) {
      return ApiResponse.notFound(res, "Product doesnot exist", 404);
    }

    if (fieldsToUpdate.salePrice < fieldsToUpdate.price) {
      return ApiResponse.validationError(
        res,
        "Variation addition failed",
        {
          salePrice: "Sale price can't be less than price",
        },
        400
      );
    }

    if (product.productType === SIMPLE) {
      fieldsToUpdate.attributes = fieldsToUpdate.attributes || [];
      if (attributes.length !== 0) {
        return ApiResponse.validationError(
          res,
          "Variation addition failed",
          {
            attributes:
              "You are trying to add attributes to a simple product. Simple products can't have attributes",
          },
          400
        );
      }

      const updatedVariation = await Variation.findOneAndUpdate(
        { _id: id },
        fieldsToUpdate,
        { new: true }
      );
      return ApiResponse.success(
        res,
        "Variation updated successfully",
        updatedVariation,
        200
      );
    }

    if (product.productType === VARIABLE) {
      fieldsToUpdate.attributes = fieldsToUpdate.attributes || [];
      const validationError = await validateAttributes(
        product.attributes,
        fieldsToUpdate.attributes
      );

      if (validationError) {
        return ApiResponse.validationError(
          res,
          "Variation addition failed",
          validationError,
          400
        );
      }

      let updateAttributeError = await updateAttributes(
        fieldsToUpdate.attributes
      );

      if (updateAttributeError) {
        return ApiResponse.validationError(
          res,
          "Variation addition failed",
          updateAttributeError,
          400
        );
      }

      const updatedVariation = await Variation.findByIdAndUpdate(
        id,
        fieldsToUpdate,
        { new: true, runValidators: true }
      );
      return ApiResponse.success(
        res,
        "Variation updated successfully",
        updatedVariation,
        200
      );
    }
  } catch (error) {
    return handleErrors(res, error);
  }
});

const getAllVariationsOfAProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return ApiResponse.notFound(res, "Product doesnot exist", 404);
    }
    const variations = await Variation.find({ productId: id });

    return ApiResponse.success(res, "Variations found", variations, 200);
  } catch (error) {
    if (
      error.name === MONGOOSE_CAST_ERROR &&
      error.kind === MONGOOSE_OBJECT_ID
    ) {
      return ApiResponse.validationError(
        res,
        "Variation addition failed",
        {
          id: "Invalid product ID provided",
        },
        400
      );
    }
    return ApiResponse.error(res, "Error while adding variation", 500, error);
  }
});

const deleteAVariation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVariation = await Variation.findByIdAndDelete(id);
    if (!deletedVariation) {
      return ApiResponse.notFound(res, "Variation doesnot exist", 404);
    }
    return ApiResponse.success(res, "Variation deleted successfully", {}, 200);
  } catch (error) {
    if (
      error.name === MONGOOSE_CAST_ERROR &&
      error.kind === MONGOOSE_OBJECT_ID
    ) {
      return ApiResponse.validationError(
        res,
        "Variation addition failed",
        {
          id: "Invalid product ID provided",
        },
        400
      );
    }
    return ApiResponse.error(res, "Error while deleting variation", 500, error);
  }
});

const deleteAllVariationsOfAProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVariations = await Variation.deleteMany({ productId: id });
    return ApiResponse.success(
      res,
      "Variations deleted successfully",
      deletedVariations,
      200
    );
  } catch (error) {
    if (
      error.name === MONGOOSE_CAST_ERROR &&
      error.kind === MONGOOSE_OBJECT_ID
    ) {
      return ApiResponse.validationError(
        res,
        "Variation addition failed",
        {
          id: "Invalid product ID provided",
        },
        400
      );
    }
    return ApiResponse.error(
      res,
      "Error while deleting variations",
      500,
      error
    );
  }
});

module.exports = {
  addAVariation,
  getAllVariationsOfAProduct,
  deleteAVariation,
  deleteAllVariationsOfAProduct,
  updateAVariation,
};
