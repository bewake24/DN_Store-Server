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
const { emailRegex, usernameRegex, passwordRegex, nameRegex} = require("../constants/regex.constants");
const ROLES_LIST = require("../config/rolesList");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      match: [usernameRegex, "Username not in proper format"],
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [32, "Username must be at most 32 characters long"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //Enables optimised searching of data
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    refreshToken: String,
    name: {
      type: String,
      trim: true,
      match : [nameRegex, "Name not in proper format"],
      required: [true, "Name is required"],
    },
    avatar: String, //Save Images to a seperate folder and store the link of the image to database
    email: {
      type: String,
      match: [emailRegex, "Email not in proper format"],
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: String,
    gender: {
      type: String,
      uppercase: true,
      enum: [MALE, FEMALE, OTHERS],
    },
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
    status: {
      type: String,
      enum: [ACTIVE, INACTIVE, UNDER_REVIEW, BLOCKED],
      default: ACTIVE,
    },
  },
  { timestamps: true }
);

userSchema.pre("validate", function(next){
  if (this.isModified("password") && !passwordRegex.test(this.password)) {
    this.invalidate(
      "password",
      "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
    );
  }
  next();
})

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
      roles: this.roles,
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

userSchema.methods.rolesObjectToArray = function () {
  return Object.values(this.roles);
};

const User = mongoose.model(USER, userSchema);

module.exports = User;


/*
  put regex in the model.
  remove validators from the code.
  validate directly while saving in the DB. 

*/
