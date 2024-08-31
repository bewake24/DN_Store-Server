const mongoose = require("mongoose");
const { WORK, HOME, ADDRESS } = require("../constants/models.constants");

const addressSchema = new mongoose.schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    alternatePhoneNo: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    addressState: {
      type: Sring, //Enum
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    addressType: {
      type: String,
      enum: [WORK, HOME],
      default: HOME,
    },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Address = mongoose.model(ADDRESS, addressSchema);

module.exports = Address;
