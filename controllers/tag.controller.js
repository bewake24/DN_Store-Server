const Tag = require("../models/Tag"); // Assuming the Tag model is in the models directory
const ApiResponse = require("../utils/ApiResponse"); // Assuming ApiResponse is a utility function for handling responses

// Create a new tag
const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the tag already exists
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return ApiResponse.conflict(res, "Tag already exists", 409);
    }

    const tag = new Tag({ name });
    await tag.save();

    ApiResponse.success(res, "Tag created successfully", tag);
  } catch (error) {
    ApiResponse.error(res, "Error while creating tag", error, 500);
  }
};

// Get all tags
const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    ApiResponse.success(res, "Tags fetched successfully", tags);
  } catch (error) {
    ApiResponse.error(res, "Error while fetching tags", error, 500);
  }
};

// Get a single tag by ID
const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);
    if (!tag) {
      return ApiResponse.notFound(res, "Tag not found", 404);
    }

    ApiResponse.success(res, "Tag fetched successfully", tag);
  } catch (error) {
    ApiResponse.error(res, "Error while fetching tag", error, 500);
  }
};

// Update a tag by ID
const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if the tag exists
    const tag = await Tag.findById(id);
    if (!tag) {
      return ApiResponse.notFound(res, "Tag not found", 404);
    }

    // Check if the new name is already in use
    const existingTag = await Tag.findOne({ name });
    if (existingTag && existingTag._id.toString() !== id) {
      return ApiResponse.conflict(res, "Tag name already exists", 409);
    }

    // Update the tag
    tag.name = name || tag.name;
    await tag.save();

    ApiResponse.success(res, "Tag updated successfully", tag);
  } catch (error) {
    ApiResponse.error(res, "Error while updating tag", error, 500);
  }
};

// Delete a tag by ID
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);
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
  getTagById,
  updateTag,
  deleteTag,
};
