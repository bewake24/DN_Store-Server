const {
  MONGOOSE_DUPLICATE_KEY,
  MONGOOSE_VALIDATION_ERROR,
  MONGOOSE_CAST_ERROR,
  MONGOOSE_OBJECT_ID,
} = require("../constants/models.constants");
const Category = require("../model/category.model");
const Product = require("../model/product.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createCategory = asyncHandler(async (req, res) => {
  try {
    let thumbnail;
    if (req.file) {
      thumbnail = req.file.filename;
    }
    const category = await Category.create({ ...req.body, thumbnail });
    ApiResponse.success(
      res,
      "Category created successfully",
      { category, csrfToken: req.csrfToken() },
      201
    );
  } catch (error) {
    if (error.name === MONGOOSE_VALIDATION_ERROR) {
      return ApiResponse.error(res, invalidFieldMessage(error), 400);
    }
    if (error.code === MONGOOSE_DUPLICATE_KEY) {
      return ApiResponse.error(res, "Category already exists", 400);
    }
    ApiResponse.error(res, "Error while creating category", 500);
  }
});

const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();

    ApiResponse.success(
      res,
      "Categories fetched successfully",
      categories.length ? categories : "No categories found",
      200
    );
  } catch (error) {
    ApiResponse.error(res, "Error while fetching categories", 500);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne(req.params);

    if (!category) {
      return ApiResponse.notFound(res, "Category not found", 404);
    }

    const products = await Product.find({ categories: category._id });

    await Promise.all(
      products.map(async (product) => {
        product.category = product.category.filter((c) => c !== category._id);
        await product.save(); // Make sure each product is saved after updating
      })
    );

    // Delete the category
    await category.deleteOne();

    ApiResponse.success(
      res,
      "Category deleted successfully",
      { csrfToken: req.csrfToken() },
      200
    );
  } catch (error) {
    if (
      error.name === MONGOOSE_CAST_ERROR &&
      error.kind === MONGOOSE_OBJECT_ID
    ) {
      return ApiResponse.notFound(res, "Invalid object id provided", 404);
    }
    ApiResponse.error(res, "Error while deleting category", error, 500);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, slug, isActive } = req.body;
    let thumbnail;
    if (req.file) {
      thumbnail = req.file.filename;
    }
    const category = await Category.find(req.params, {
      new: true,
    });

    if (name) {
      // Can we use pre save hooks to save update products category name instead of doing this here.
      Product.find({ categories: category._id }).then((products) => {
        products.forEach((product) => {
          product.category = [
            ...product.category.filter((c) => c !== category._id),
          ];
          product.save();
        });
      });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      req.params,
      {
        name,
        slug,
        thumbnail,
        isActive,
      },
      { new: true, runValidators: true }
    );

    ApiResponse.success(
      res,
      "Category updated successfully",
      { category: updatedCategory, csrfToken: req.csrfToken() },
      200
    );
  } catch (error) {
    ApiResponse.error(res, "Error while updating category", 500);
  }
});

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
