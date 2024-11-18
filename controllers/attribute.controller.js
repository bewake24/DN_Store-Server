const ApiResponse = require("../utils/ApiResponse");
const Attribute = require("../model/attribute.model");
const asyncHandler = require("../utils/asyncHandler");
const invalidFieldMessage = require("../utils/invalidFieldMessage");
const {
  MONGOOSE_VALIDATION_ERROR,
  MONGOOSE_DUPLICATE_KEY,
  MONGOOSE_CAST_ERROR,
  MONGOOSE_OBJECT_ID,
} = require("../constants/models.constants");
const { get } = require("mongoose");

const createAttribute = asyncHandler(async (req, res) => {
  try {
    let { values } = req.body;
    values = values.split(",");
    const attribute = await Attribute.create({ ...req.body, values });

    ApiResponse.success(res, "Attribute created successfully", attribute);
  } catch (error) {
    if (error.name === MONGOOSE_VALIDATION_ERROR) {
      return ApiResponse.validationError(
        res,
        "Attribute validation failed",
        invalidFieldMessage(error),
        400
      );
    }
    if (error.code === MONGOOSE_DUPLICATE_KEY) {
      return ApiResponse.conflict(res, "Attribute already exists", 400);
    }
    ApiResponse.error(res, "Error while creating attribute", 500, error);
  }
});

const getAllAttributes = asyncHandler(async (req, res) => {
  try {
    const attributes = await Attribute.find();

    ApiResponse.success(
      res,
      attributes.length
        ? "Attributes fetched successfully"
        : "Attributes Not found",
      attributes
    );
  } catch (error) {
    ApiResponse.error(res, "Error while fetching attributes", 500, error);
  }
});

const getAnAttribute = asyncHandler(async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      return ApiResponse.notFound(res, "Attribute not found", 404);
    }
    ApiResponse.success(res, "Attribute fetched successfully", attribute);
  } catch (error) {
    if (
      error.name === MONGOOSE_CAST_ERROR &&
      error.kind === MONGOOSE_OBJECT_ID
    ) {
      return ApiResponse.validationError(
        res,
        "Invalid attribute Fromat provided"
      );
    }
    ApiResponse.error(res, "Error while fetching attribute", 500, error);
  }
});

const updateAnAttribute = asyncHandler(async (req, res) => {
  try {
    const { name, values } = req.body;

    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
      return ApiResponse.notFound(res, "Attribute not found", 404);
    }

    if (attribute.name === name) {
      return ApiResponse.conflict(res, "Attribute already exists", 400);
    }
    const existingValues = attribute.values;
    const newValues = values.split(",");
    const updatedAttribute = await Attribute.findByIdAndUpdate(
      attribute._id,
      { name, values: [...new Set([...existingValues, ...newValues])] },
      {
        new: true,
        runValidators: true,
      }
    );

    ApiResponse.success(
      res,
      "Attribute updated successfully",
      updatedAttribute
    );
  } catch (error) {
    if (error.name === MONGOOSE_VALIDATION_ERROR) {
      return ApiResponse.validationError(
        res,
        "Attribute validation failed",
        invalidFieldMessage(error),
        400
      );
    }
    if (error.code === MONGOOSE_DUPLICATE_KEY) {
      return ApiResponse.conflict(res, "Attribute already exists", 400);
    }

    if (
      error.name === MONGOOSE_CAST_ERROR &&
      error.kind === MONGOOSE_OBJECT_ID
    ) {
      return ApiResponse.validationError(
        res,
        "Invalid attribute Fromat provided"
      );
    }

    ApiResponse.error(res, "Error while updating attribute", 500, error);
  }
});

const deleteAnAttribute = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const attribute = await Attribute.findById(id);
    if (!attribute) {
      return ApiResponse.notFound(res, "Attribute not found", 404);
    }
    await Attribute.findByIdAndDelete(id);
    ApiResponse.success(res, "Attribute deleted successfully");
  } catch (error) {
    if (
      error.name === MONGOOSE_CAST_ERROR &&
      error.kind === MONGOOSE_OBJECT_ID
    ) {
      return ApiResponse.validationError(
        res,
        "Invalid attribute Fromat provided"
      );
    }
    ApiResponse.error(res, "Error while deleting attribute", 500, error);
  }
});

module.exports = {
  createAttribute,
  getAllAttributes,
  getAnAttribute,
  updateAnAttribute,
  deleteAnAttribute,
};
