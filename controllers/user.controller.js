const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validateUsername,
  validateGender,
  validatePhoneNo,
  validateName,
  validatePasword,
} = require("../utils/validator");
const User = require("../model/user.model");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //didn't run validation to save the user here it will not ask for password.
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error while generating access and refresh token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  let { username, password, name, email, phoneNo, gender } = req.body;
  console.log(req.body);
  // validation of data

  // 1. Check for empty input fields
  const isEmpty = [username, password, name, email, phoneNo].some(
    (fields) => fields === undefined || fields.trim() === ""
  );

  if (isEmpty) {
    throw new ApiError(400, "All Fields are required");
  }
  let invalidFields = [];

  //2. Validate pattern of necessary fields;
  name = validateName(name) || invalidFields.push("name");
  email = validateEmail(email) || invalidFields.push("email");
  gender = validateGender(gender) || invalidFields.push("gender");
  phoneNo = validatePhoneNo(phoneNo) || invalidFields.push("phoneNo");
  password = validatePasword(password) || invalidFields.push("password");
  username = validateUsername(username) || invalidFields.push("username");

  if (invalidFields.length) {
    throw new ApiError(
      400,
      `Please enter the proper format!! Invalid field(s): ${invalidFields.join(", ")}`
    );
  }

  // check if user already exist
  const dublicate = await User.findOne({
    $or: [{ username }, { email }],
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
    userAvatar = req.files.avatar[0].path.split(`${username}/`)[1];
  }

  // create user object & entry in DB
  const user = await User.create({
    name,
    username,
    password,
    email,
    phoneNo,
    gender,
    avatar: userAvatar,
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

  let email;
  let username;

  // Validate data;
  if (validateEmail(usernameOrEmail)) email = validateEmail(usernameOrEmail);
  if (validateUsername(usernameOrEmail))
    username = validateUsername(usernameOrEmail);

  if (!email && !username) {
    throw new ApiError(400, "Valid username or email is required");
  }

  // Find user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).exec();

  // Match User
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password didn't matched");
  }

  // Send responese back
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log(loggedInUser.name + " Loggedin Successefully");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  // console.log(req.user);
  // Remove remove user credentials from Db
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // remove the field from DB completely
      },
    },
    {
      new: true, // Returns the updated value in response
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  //Send response back
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken; // req.body.refreshToken -> If user is sending data from moblie application
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorised Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Token expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    console.log("New Tokens Generated Successfully");

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "New Tokens generated succesfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

const updateUserInfo = asyncHandler(async (req, res) => {
  console.log(req.user.name);
  let updates = req.body;
  const allowedUpdates = ["name", "email", "gender", "phoneNo"];
  let fieldsToUpdate = {};

  Object.keys(updates).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      fieldsToUpdate[key] = updates[key];
    }
  });

  //Validate Incoming Updates
  if (updates.name)
    fieldsToUpdate.name = validateName(fieldsToUpdate.name) || false;
  if (updates.email)
    fieldsToUpdate.email = validateEmail(fieldsToUpdate.email) || false;
  if (updates.gender)
    fieldsToUpdate.gender =
      validateGender(fieldsToUpdate.gender) || false;
  if (updates.phoneNo)
    fieldsToUpdate.phoneNo =
      validatePhoneNo(fieldsToUpdate.phoneNo) || false;

  //Find All Invalid Fields
  const invalidFields = Object.keys(fieldsToUpdate)
    .filter((key) => fieldsToUpdate[key] === false)
    .join(", ");
  console.log(fieldsToUpdate);

  if (invalidFields) {
    throw new ApiError(
      400,
      `Invalid data provided for fields: ${invalidFields}`
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: fieldsToUpdate,
    },
    {
      new: true,
      runValidators: true, // Run validation on update
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  refreshAccessToken,
  updateUserInfo,
};
