const Address = require("../model/address.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const addAnAddress = asyncHandler(async (req, res) => {
  // Get address etails from frontend
  let userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorised User");
  }

  //Get address etails from frontend
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

  // Check for empty required fields
  const isEmpty = [name, phoneNo, pinCode, address, city, addressState].some(
    (fields) => fields === undefined || fields.trim() === ""
  );

  if (isEmpty) {
    throw new ApiError(400, "Please input the required fields");
  }

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

  res
    .status(200)
    .json(new ApiResponse(200, newAddress, "Address added successfully"));
});

const getUserAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    ApiResponse(401, "Unauthorised User");
  }

  const addresses = await Address.find({ userId }).select(
    "-createdAt -updatedAt -userId"
  );

  let message = `All addresses for user ${req.user.name} fetched successfully`;
  if (!addresses.length) {
    message = `No address found for user ${req.user.name}`;
  }

  res.status(200).json(new ApiResponse(200, addresses, message));
});

const updateAnAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;

  const addressUser = await Address.findById(addressId).select("userId");
  if (addressUser.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "Address doesn't belongs to this user and hence can't update the address"
    );
  }
  console.log(req.body);

  if (req.body?.isDefault) {
    const defaultAddress = await Address.findOne({
      userId: req.user._id,
      isDefault: true,
    });
    if (defaultAddress) {
      defaultAddress.isDefault = false;
      await defaultAddress.save();
      console.log(defaultAddress);
    }
  }

  console.log(req.params);
  const address = await Address.findByIdAndUpdate(addressId, req.body, {
    new: true,
  });
  console.log("Address updated successfully");
  res
    .status(200)
    .json(new ApiResponse(200, address, "Address updated successfully"));
});

const deleteAnAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;

  const addressUser = await Address.findById(addressId).select("userId");
  if (addressUser.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "Address doesn't belongs to this user and hence can't delete the address"
    );
  }

  const address = await Address.findByIdAndDelete(addressId);
  console.log("Address deleted successfully");
  res
    .status(200)
    .json(new ApiResponse(200, address, "Address deleted successfully"));
});

module.exports = {
  addAnAddress,
  getUserAddresses,
  updateAnAddress,
  deleteAnAddress,
};
