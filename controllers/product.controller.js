const {
  SIMPLE,
  MONGOOSE_DUPLICATE_KEY,
  MONGOOSE_VALIDATION_ERROR,
  MONGOOSE_CAST_ERROR,
  VARIABLE,
} = require("../constants/models.constants");
const Product = require("../model/product.model");
const invalidFieldMessage = require("../utils/invalidFieldMessage");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const Category = require("../model/category.model");
const Tag = require("../model/tag.model");
const Attribute = require("../model/attribute.model");

// Resolve categories/tags: can't use map because it doesn't wait and hence we get promise pending
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

    let { categories, tags, attributes } = req.body;

    if (productType === SIMPLE && attributes) {
      return ApiResponse.validationError(
        res,
        "Simple products cannot have attributes",
        { attributes: "Attributes are not allowed for simple products" },
        400
      );
    }

    const thumbnail = req.files.thumbnail[0].filename;
    const gallery = req.files.gallery.map((file) => file.filename);

    const addedCategories = await resolveItems(categories, Category);
    const addedTags = await resolveItems(tags, Tag);
    const addedAttributes =
      productType === VARIABLE
        ? await resolveItems(attributes, Attribute)
        : undefined;

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
      attributes: addedAttributes, // Save only if VARIABLE, otherwise undefined
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

    const fieldsToUpdate = Object.keys(updates).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = updates[key];
      }
      return acc;
    }, {});

    const product = await Product.findById(id);
    if (!product) {
      return ApiResponse.notFound(res, "Product not found", 404);
    }

    if (product.productType === SIMPLE && req.body.attributes) {
      return ApiResponse.validationError(
        res,
        "Simple products cannot have attributes",
        { attributes: "Attributes are not allowed for simple products" },
        400
      );
    }

    if (categories) {
      fieldsToUpdate.categories = await resolveItems(categories, Category);
    }
    if (tags) {
      fieldsToUpdate.tags = await resolveItems(tags, Tag);
    }

    // Handle attributes for SIMPLE products
    if (fieldsToUpdate.productType === VARIABLE) {
      fieldsToUpdate.attributes = await resolveItems(attributes, Attribute);
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
