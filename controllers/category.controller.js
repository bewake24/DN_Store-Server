const Category = require("../model/category.model");
const Product = require("../model/product.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.create(req.body);
    ApiResponse.success(res, "Category created successfully", category);
  } catch (error) {
    ApiResponse.error(res, "Error while creating category", 500);
  }
});

const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    ApiResponse.success(res, "Categories fetched successfully", categories);
  } catch (error) {
    ApiResponse.error(res, "Error while fetching categories", 500);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.find(
      { slug: req.params.slug } || { _id: req.params.id }
    );

    // Can we use pre save hooks to save update products category name instead of doing this here.
    Product.find({ categories: category._id }).then((products) => {
      products.forEach((product) => {
        product.category = [
          ...product.category.filter((c) => c !== category._id),
        ];
        product.save();
      });
    });

    category.delete();
    ApiResponse.success(res, "Category deleted successfully", {});
  } catch (error) {
    ApiResponse.error(res, "Error while deleting category", 500);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, slug, thumbnail, isActive } = req.body;
    const category = await Category.find(
      { slug: req.params.slug } || { _id: req.params.id },
      {
        new: true,
      }
    );

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
      { slug: req.params.slug } || { _id: req.params.id },
      {
        name,
        slug,
        thumbnail,
        isActive,
      },
      { new: true, runValidators: true }
    );

    ApiResponse.success(res, "Category updated successfully", updatedCategory);
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
