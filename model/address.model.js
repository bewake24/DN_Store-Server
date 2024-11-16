const mongoose = require("mongoose");
const { WORK, HOME, ADDRESS } = require("../constants/models.constants");
const {
  phoneRegex,
  addressRegex,
  cityRegex,
  nameRegex,
  pincodeRegex,
} = require("../constants/regex.constants");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      match: [nameRegex, "Name not in proper format"],
      trim: true,
      required: [true, "Name is required"],
    },
    phoneNo: {
      type: String,
      trim: true,
      maxlength: 16,
      minlength: 4,
      required: [true, "Phone number is required"],
      match: [phoneRegex, "Phone number not in proper format"],
    },
    alternatePhoneNo: {
      type: String,
      trim: true,
      maxlength: 16,
      minlength: 4,
      match: [phoneRegex, "Phone number not in proper format"],
    },
    pinCode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
      match: [pincodeRegex, "Pincode not in proper format"],
    },
    locality: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    address: {
      trim: true,
      maxlength: 256,
      type: String,
      match: [addressRegex, "Address not in proper format"],
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      trim: true,
      maxlength: 32,
      required: true,
      match: [cityRegex, "City not in proper format"],
    },
    addressState: {
      trim: true,
      maxlength: 32,
      type: String,
      required: true,
      match: [cityRegex, "State/UT not in proper format"],
    },
    landmark: {
      trim: true,
      maxlength: 256,
      type: String,
    },
    addressType: {
      type: String,
      enum: [WORK, HOME],
      default: HOME,
    },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Address = mongoose.model(ADDRESS, addressSchema);

module.exports = Address;
