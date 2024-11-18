const {
  SIMPLE,
  MONGOOSE_DUPLICATE_KEY,
  MONGOOSE_VALIDATION_ERROR,
  MONGOOSE_CAST_ERROR,
} = require("../constants/models.constants");
const Product = require("../model/product.model");
const invalidFieldMessage = require("../utils/invalidFieldMessage");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const Category = require("../model/category.model");
const Tag = require("../model/tag.model");

const addAProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      slug,
      productType,
      description,
      shortDescription,
      productStatus,
      publishDate,
    } = req.body;

    let { categories, tags } = req.body;

    const attribute = productType === SIMPLE ? req.body.attribute : null;

    const thumbnail = req.files.thumbnail[0].filename;
    const gallery = req.files.gallery.map((file) => file.filename);

    categories = categories.split(",");
    tags = tags.split(",");

    // Resolve categories: can't use map because it doesn't wait and hence we get promise pending
    const addedCategories = await Promise.all(
      categories.map(async (category) => {
        let productCategory = await Category.findOne({ name: category });
        if (!productCategory) {
          productCategory = await Category.create({ name: category }); // Ensure await here
        }
        return productCategory._id;
      })
    );

    // Resolve tags
    const addedTags = await Promise.all(
      tags.map(async (tag) => {
        let productTag = await Tag.findOne({ name: tag });
        if (!productTag) {
          productTag = await Tag.create({ name: tag }); // Ensure await here
        }
        return productTag._id;
      })
    );

    console.log(addedCategories);
    console.log(addedTags);

    const product = await Product.create({
      name,
      slug,
      productType,
      description,
      shortDescription,
      categories: addedCategories,
      tags: addedTags,
      productStatus,
      publishDate,
      attribute,
      thumbnail,
      gallery,
    });

    ApiResponse.success(
      res,
      "Product created successfully, Now add variations and prices for it",
      product
    );
  } catch (error) {
    if (error.name === MONGOOSE_VALIDATION_ERROR) {
      return ApiResponse.validationError(
        res,
        "Product validation failed",
        invalidFieldMessage(error),
        400
      );
    }
    if (error.code === MONGOOSE_DUPLICATE_KEY) {
      return ApiResponse.conflict(res, "Product already exists", 400);
    }
    return ApiResponse.error(res, "Product creation failed", 500, error);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    ApiResponse.success(res, "Products fetched successfully", products);
  } catch (error) {
    ApiResponse.error(res, "Error while fetching products", 500, error);
  }
});

const getAProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    ApiResponse.success(res, "Product fetched successfully", product);
  } catch (error) {
    if (
      error.name === MONGOOSE_CAST_ERROR &&
      error.kind === MONGOOSE_OBJECT_ID
    ) {
      return ApiResponse.notFound(res, "Invalid object id provided", 404);
    }

    ApiResponse.error(res, "Error while fetching product", 500, error);
  }
});

const updateAProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { categories, tags, attributes, ...updates } = req.body; // Default categories and tags to empty strings

    const allowedUpdates = [
      "name",
      "slug",
      "productType",
      "description",
      "shortDescription",
      "productStatus",
      "publishDate",
      "thumbnail",
      "gallery",
    ];

    // Filter only allowed fields
    const fieldsToUpdate = Object.keys(updates).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = updates[key];
      }
      return acc;
    }, {});

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return ApiResponse.notFound(res, "Product not found", 404);
    }

    // Process categories and tags
    const resolveItems = async (items, model) => {
      return await Promise.all(
        items.split(",").map(async (item) => {
          const existingItem = await model.findOne({ name: item });
          return existingItem
            ? existingItem._id
            : (await model.create({ name: item }))._id;
        })
      );
    };

    if (categories) {
      fieldsToUpdate.categories = await resolveItems(categories, Category);
    }
    if (tags) {
      fieldsToUpdate.tags = await resolveItems(tags, Tag);
    }

    // Handle attributes for SIMPLE products
    if (fieldsToUpdate.productType === SIMPLE) {
      fieldsToUpdate.attributes = attributes || null;
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    ApiResponse.success(res, "Product updated successfully", updatedProduct);
  } catch (error) {
    if (
      error.name === MONGOOSE_CAST_ERROR &&
      error.kind === MONGOOSE_OBJECT_ID
    ) {
      return ApiResponse.notFound(res, "Invalid object id provided", 404);
    }
    if (error.name === MONGOOSE_VALIDATION_ERROR) {
      return ApiResponse.validationError(
        res,
        "Product validation failed",
        invalidFieldMessage(error),
        400
      );
    }
    ApiResponse.error(res, "Error while updating product", 500, error);
  }
});

module.exports = {
  addAProduct,
  getAllProducts,
  getAProduct,
  updateAProduct,
};
