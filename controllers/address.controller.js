const Address = require("../model/address.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const invalidFieldMessage = require("../utils/invalidFieldMessage");
const {
  MONGOOSE_VALIDATION_ERROR,
  MONGOOSE_OBJECT_ID,
  MONGOOSE_CAST_ERROR,
} = require("../constants/models.constants");

const addAnAddress = asyncHandler(async (req, res) => {
  try {
    // Get address details from frontend
    let userId = req.user._id;
    if (!userId) {
      ApiResponse.notFound(
        404,
        "User not found. User must be logged in to add an address"
      );
    }

    let {
      name,
      phoneNo,
      alternatePhoneNo,
      pinCode,
      locality,
      address,
      city,
      addressState,
      landmark,
      addressType,
      isDefault,
    } = req.body;

    const defaultAddress = await Address.findOne({ userId, isDefault: true });
    if (isDefault && defaultAddress) {
      defaultAddress.isDefault = false;
      await defaultAddress.save();
    }

    if (!defaultAddress) isDefault = true;
    console.log(defaultAddress);

    const newAddress = await Address.create({
      userId,
      name,
      phoneNo,
      alternatePhoneNo,
      pinCode,
      locality,
      address,
      city,
      addressState,
      landmark,
      addressType,
      isDefault,
    });

    console.log(`Address added successfully to the user ${userId}`);

    ApiResponse.success(
      res,
      "Address added successfully",
      { address: newAddress, csrfToken: req.csrfToken() },
      201
    );
  } catch (err) {
    if (err.name === MONGOOSE_VALIDATION_ERROR) {
      return ApiResponse.validationError(
        res,
        "User validation failed.",
        invalidFieldMessage(err),
        400
      );
    }
    return ApiResponse.error(res, err.message, 500, err);
  }
});

const getUserAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const addresses = await Address.find({ userId }).select(
    "-createdAt -updatedAt -userId"
  );

  const message = addresses.length
    ? `All addresses for user ${req.user.name} fetched successfully`
    : `No address found for user ${req.user.name}`;

  ApiResponse.success(res, message, addresses, 200);
});

const updateAnAddress = asyncHandler(async (req, res) => {
  try {
    const addressId = req.params.id;

    const addressUser = await Address.findById(addressId).select("userId");
    if (!addressUser) {
      return ApiResponse.notFound(
        res,
        "Invalid address ID provided, Address not found"
      );
    }
    if (addressUser.userId.toString() !== req.user._id.toString()) {
      return ApiResponse.forbidden(
        res,
        "Address doesn't belongs to loggedin user and hence can't update the address"
      );
    }

    if (req.body?.isDefault) {
      const defaultAddress = await Address.findOne({
        userId: req.user._id,
        isDefault: true,
      });
      if (defaultAddress) {
        defaultAddress.isDefault = false;
        await defaultAddress.save();
      }
    }
    const address = await Address.findByIdAndUpdate(addressId, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("Address updated successfully");

    ApiResponse.success(
      res,
      "Address updated successfully",
      { address, csrfToken: req.csrfToken() },
      200
    );
  } catch (err) {
    if (err.name === MONGOOSE_CAST_ERROR && err.kind === MONGOOSE_OBJECT_ID) {
      return ApiResponse.validationError(
        res,
        "Invalid address ID Fromat provided"
      );
    }

    if (err.name === MONGOOSE_VALIDATION_ERROR) {
      return ApiResponse.validationError(
        res,
        "Address update failed due to invalid field provided",
        invalidFieldMessage(err),
        400
      );
    }
    ApiResponse.error(res, err.message, 500, err);
  }
});

const deleteAnAddress = asyncHandler(async (req, res) => {
  try {
    const addressId = req.params.id;

    const addressUser = await Address.findById(addressId).select("userId");

    if (!addressUser) {
      return ApiResponse.notFound(
        res,
        "Invalid address ID provided, Address not found"
      );
    }

    if (addressUser.userId.toString() !== req.user._id.toString()) {
      return ApiResponse.forbidden(
        res,
        "Address doesn't belongs to loggedin user and hence can't delete the address"
      );
    }

    const address = await Address.findByIdAndDelete(addressId);
    console.log("Address deleted successfully");
    ApiResponse.success(
      res,
      "Address deleted successfully",
      { csrfToken: req.csrfToken() },
      200
    );
  } catch (err) {
    if (err.name === MONGOOSE_CAST_ERROR && err.kind === MONGOOSE_OBJECT_ID) {
      return ApiResponse.validationError(
        res,
        "Invalid address ID Fromat in params"
      );
    }
    ApiResponse.error(res, err.message, 500, err);
  }
});

module.exports = {
  addAnAddress,
  getUserAddresses,
  updateAnAddress,
  deleteAnAddress,
};
