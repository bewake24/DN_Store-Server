const {
  MONGOOSE_DUPLICATE_KEY,
  MONGOOSE_CAST_ERROR,
  MONGOOSE_OBJECT_ID,
} = require("../constants/models.constants");
const Product = require("../model/product.model");
const Tag = require("../model/tag.model");
const ApiResponse = require("../utils/ApiResponse");

const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const tag = await Tag.create({ name });

    ApiResponse.success(res, "Tag created successfully", tag);
  } catch (error) {
    if (error.code === MONGOOSE_DUPLICATE_KEY) {
      return ApiResponse.conflict(res, "Tag already exists", 409);
    }
    ApiResponse.error(res, "Error while creating tag", 500, error);
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    ApiResponse.success(
      res,
      tags.length ? "Tags fetched successfully" : "Tags Not found",
      tags
    );
  } catch (error) {
    ApiResponse.error(res, "Error while fetching tags", error, 500);
  }
};

const getATag = async (req, res) => {
  try {
    const tag = await Tag.findOne(req.params);
    if (!tag) {
      return ApiResponse.notFound(res, "Tag not found", 404);
    }

    ApiResponse.success(res, "Tag fetched successfully", tag);
  } catch (error) {
    ApiResponse.error(res, "Error while fetching tag", error, 500);
  }
};

const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const tag = await Tag.findById(id);
    if (!tag) {
      return ApiResponse.notFound(res, "Tag not found", 404);
    }

    if (tag.name === name) {
      return ApiResponse.conflict(
        res,
        "New tag name and old tag name are same.",
        409
      );
    }

    tag.name = name || tag.name;
    await tag.save();

    ApiResponse.success(res, "Tag updated successfully", tag);
  } catch (error) {
    if (err.name === MONGOOSE_CAST_ERROR && err.kind === MONGOOSE_OBJECT_ID) {
      return ApiResponse.validationError(res, "Invalid tag Fromat provided");
    }
    if (error.code === MONGOOSE_DUPLICATE_KEY) {
      return ApiResponse.conflict(res, "Tag name already exists", 409);
    }
    ApiResponse.error(res, "Error while updating tag", error, 500);
  }
};

const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findOne(req.params);
    if (!tag) {
      return ApiResponse.notFound(res, "Tag not found", 404);
    }

    await tag.deleteOne();

    ApiResponse.success(res, "Tag deleted successfully", {});
  } catch (error) {
    ApiResponse.error(res, "Error while deleting tag", error, 500);
  }
};

module.exports = {
  createTag,
  getTags,
  getATag,
  updateTag,
  deleteTag,
};
