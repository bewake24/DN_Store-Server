const mongoose = require("mongoose");
const {
  ADDRESS,
  MANAGER,
  EDITOR,
  ADMIN,
  CUSTOMER,
  OWNER,
  OTHERS,
  FEMALE,
  MALE,
  ACTIVE,
  INACTIVE,
  UNDER_REVIEW,
  BLOCKED,
  USER,
} = require("../constants/models.constants");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: String,
    name: {
      type: String,
      required: true,
    },
    avatar: String, //Save Images to a seperate folder and store the link of the image to database
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNo: String,
    gender: {
      type: String,
      enum: [MALE, FEMALE, OTHERS],
    },
    roles: {
      type: String,
      enum: [MANAGER, EDITOR, ADMIN, CUSTOMER, OWNER],
      default: CUSTOMER,
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ADDRESS,
        //references to address schema
      },
    ],
    paymentMethods: [
      {
        //refrences to payment methods table
      },
    ],
    status: {
      type: String,
      enum: [ACTIVE, INACTIVE, UNDER_REVIEW, BLOCKED],
      default: ACTIVE,
    },
  },
  { timestamps: true }
);

const User = mongoose.model(USER, userSchema);

module.exports = User;
