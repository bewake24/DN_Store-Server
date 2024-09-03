const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const validator = require("../utils/validator");
const User = require("../model/user.model");

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  let { username, password, name, email, phoneNo, gender } = req.body;

  // validation of data

  // 1. Check for empty input fields
  const isEmpty = [username, password, name, email, phoneNo].some(
    (fields) => fields === undefined || fields.trim() === ""
  );

  if (isEmpty) {
    throw new ApiError(400, "All Fields are required");
  }

  //2. Validate pattern of necessary fields;
  if (username) username = validator.validateUsername(username);
  if (password) password = validator.validatePasword(password);
  if (name) name = validator.validatename(name);
  if (email) email = validator.validateEmail(email);
  if (phoneNo) phoneNo = validator.validatePhoneNo(phoneNo);
  if (gender) gender = validator.validateGender(gender);

  const invalidFields = [username, password, name, phoneNo, email, gender]
    .filter((index) => index.isValid === false)
    .map((index) => index.type)
    .join(", ");

  if (invalidFields) {
    throw new ApiError(
      400,
      `Please enter the proper format!! Invalid field(s): ${invalidFields}`
    );
  }

  // check if user already exist
  const dublicate = await User.findOne({
    $or: [{ username: username.value }, { email: email.value }],
  }).exec();
  if (dublicate) {
    throw new ApiError(409, "Username already exists");
  }

  // check for avatar and upload to file server
  let userAvatar;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    userAvatar = req.files.avatar[0].path.split(`${username.value}/`)[1];
  }

  // create user object & entry in DB
  const user = await User.create({
    name: name.value,
    username: username.value,
    password: password.value,
    email: email.value,
    phoneNo: phoneNo.value,
    gender: gender.value,
    avatar: userAvatar
  });

  // Check if user created in database of not & remove password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -addresses"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error while registering the user.");
  }

  // send response back
  console.log("User added successfully");
  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Get data from frontend
  const { usernameOrEmail, password } = req.body;

  if (validator.validateEmail(usernameOrEmail)) {
  }
  // Validate data;
  // match credentials
  // send responese back
});

module.exports = { registerUser };
