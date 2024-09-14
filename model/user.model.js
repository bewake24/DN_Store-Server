const mongoose = require("mongoose");
const {
  OTHERS,
  FEMALE,
  MALE,
  ACTIVE,
  INACTIVE,
  UNDER_REVIEW,
  BLOCKED,
  USER,
} = require("../constants/models.constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //Enables optimised searching of data
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: String,
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    avatar: String, //Save Images to a seperate folder and store the link of the image to database
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: String,
    gender: {
      type: String,
      enum: [MALE, FEMALE, OTHERS],
    },
    // roles: {
    //   type: [String],
    //   enum: [MANAGER, EDITOR, ADMIN, CUSTOMER, OWNER],
    //   default: CUSTOMER,
    // },
    roles: {
      CUSTOMER: {
        type: Number,
        default: 2189,
      },
      MANAGER: Number,
      EDITOR: Number,
      ADMIN: Number,
      OWNER: Number,
    },
    // addresses: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: ADDRESS,
    //     //references to address schema
    //   },
    // ],
    status: {
      type: String,
      enum: [ACTIVE, INACTIVE, UNDER_REVIEW, BLOCKED],
      default: ACTIVE,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id, // Which data you want to be saved in payload.
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User = mongoose.model(USER, userSchema);

module.exports = User;
