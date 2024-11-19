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
      try {
        // Simple products should not have attributes
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

        const variation = await Variation.create({
          sku,
          price,
          salePrice,
          stockQuantity,
          productId: product._id,
        });

        return ApiResponse.success(
          res,
          "Variation added successfully",
          variation,
          201
        );
      } catch (error) {
        if (error.name === MONGOOSE_VALIDATION_ERROR) {
          return ApiResponse.validationError(
            res,
            "Variation addition failed",
            invalidFieldMessage(error),
            400
          );
        }
        return ApiResponse.error(
          res,
          "Error while adding variation",
          500,
          error
        );
      }
    }

    if (product.productType === VARIABLE) {
      try {
        attributes = attributes || [];

        // Validate attribute length
        if (product.attributes.length !== attributes.length) {
          return ApiResponse.validationError(
            res,
            "Variation addition failed",
            {
              attributes:
                "Number of attributes in variation must match number of attributes in product",
            },
            400
          );
        }

        // Validate structure of attributes
        const areAttributesValid = attributes.every((attribute) => {
          return (
            Object.keys(attribute).length === 2 &&
            Object.keys(attribute).includes("name") &&
            Object.keys(attribute).includes("value")
          );
        });

        if (!areAttributesValid) {
          return ApiResponse.validationError(
            res,
            "Variation addition failed",
            {
              attributes:
                "All attributes must have only two fields: name and value",
            },
            400
          );
        }

        // Update attributes in the database
        await Promise.all(
          attributes.map(async (attribute) => {
            const attributeByName = await Attribute.findOne({
              name: attribute.name,
            });
            if (!attributeByName) {
              return ApiResponse.validationError(
                res,
                "Variation addition failed",
                {
                  attributes: `This is interesting. This should not happen. Error finding attribute with {name: ${attribute.name}}`,
                },
                400
              );
            }

            console.log("Fetched Attribute:", attributeByName.toObject());

            // Add new value to attribute if not already present
            let values = attributeByName.values || [];

            if (!values.includes(attribute.value)) {
              values.push(attribute.value);
              attributeByName.values = [...new Set(values)];

              await attributeByName.save();
            }
          })
        );

        // Sanitize attributes before saving the variation
        const sanitizedAttributes = attributes.map((attr) => ({
          name: attr.name,
          value: attr.value,
        }));

        console.log(sanitizedAttributes);

        const variation = await Variation.create({
          sku,
          price,
          salePrice,
          stockQuantity,
          attributes: sanitizedAttributes,
          productId: product._id,
        });

        return ApiResponse.success(
          res,
          "Variation added successfully",
          variation,
          201
        );
      } catch (error) {
        if (error.name === MONGOOSE_VALIDATION_ERROR) {
          return ApiResponse.validationError(
            res,
            "Variation addition failed",
            invalidFieldMessage(error),
            400
          );
        }
        return ApiResponse.error(
          res,
          "Error while adding variation",
          500,
          error
        );
      }
    }
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

module.exports = { addAVariation };

/* Adding a variation
    get id of product to which variation is to be added
    check if product exists
        if not found return 404

    check product type
        if productType === simple
            attributes = []
            sku = req.body.sku
            price = req.body.price
            stock = req.body.stock
            salePrice = req.body.salePrice
            stockQuantity = req.body.stockQuantity

        if productType === variable
            variation.attributes.length === product.attributes.length;
                if false return 400 "Number of attributes in variation must match number of attributes in product"

                if true find attributeByName;
                    if attributeByName.value.includes(variation.attributes[i].value) then ...continue;

                    else add value to attributeByName;

            variation.sku = req.body.sku
            variation.price = req.body.price
            variation.stock = req.body.stock
            variation.salePrice = req.body.salePrice
            variation.stockQuantity = req.body.stockQuantity
*/
