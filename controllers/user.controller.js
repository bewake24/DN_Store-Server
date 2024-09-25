const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../model/user.model");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const ROLES_LIST = require("../config/rolesList");
const rolesObjectToArray = require("../utils/rolesObjectToArray");
const rolesArrayToObject = require("../utils/rolesArrayToObject");

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
  let { username, password, name, email, phoneNo, gender } = req.validFields;

  // check if user already exist
  const dublicate = await User.findOne({
    $or: [{ username }, { email }],
  }).exec();
  if (dublicate) {
    throw new ApiError(409, "Username already exists");
  }

  // check for avatar and upload to file server
  let userAvatar;
  if (req.file) {
    userAvatar = req.file?.filename;
  }

  console.log(userAvatar);

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
  // Get data vaidated data from frontend
  let { usernameOrEmail, password } = req.validFields;

  // Find user
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
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
  const loggedInUser = await User.findById(user._id).select("-refreshToken");
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
  let updates = req.validFields;
  const allowedUpdates = ["name", "email", "gender", "phoneNo"];
  let fieldsToUpdate = {};

  Object.keys(updates).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      fieldsToUpdate[key] = updates[key];
    }
  });

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
  console.log("User updated successfully");
  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  // Get user from cookies
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not loggedin or found");
  }

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  //Find old avatar from DB
  const oldAvatarPath = path.join(
    __dirname,
    "..",
    "public",
    "uploads",
    user.username,
    user.avatar
  );

  // Save new Avatar to DB
  user.avatar = req.file?.filename;
  await user.save();

  // Delete old avatar from server
  if (fs.existsSync(oldAvatarPath)) {
    fs.unlink(oldAvatarPath, (err) => {
      if (err) {
        throw new ApiError(500, "Failed to delete old avatar");
      }
    });
  }
  console.log("User avatar updated successfully");
  res
    .status(200)
    .json(new ApiResponse(200, user, "User avatar updated successfully"));
});

const updateUsername = asyncHandler(async (req, res) => {
  const incomingUsername = req.validFields.username;
  const oldUsername = req.user.username;
  // Get user from cookies

  if (!req.user?._id === incomingUsername) {
    throw new ApiError(403, "New username can't be same as current username");
  }

  if (!req.user?._id) {
    throw new ApiError(404, "User not loggedin or not found");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { username: incomingUsername },
    },
    {
      new: true,
      runValidators: true, // Run validation on update
    }
  );
  console.log("User updated successfully");

  // Rename folder for user according to the new username
  const oldPath = path.join(__dirname, "..", "public", "uploads", oldUsername);
  const newPath = path.join(
    __dirname,
    "..",
    "public",
    "uploads",
    incomingUsername
  );

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully renamed the directory.");
    }
  });

  console.log({ oldPath, newPath });

  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  let users = await User.find().select("roles username").lean();
  users = rolesObjectToArray(users);
  res.status(200).json(new ApiResponse(200, users, "All users fetched"));
});

const getUsersByRole = asyncHandler(async (req, res) => {
  const roles = req.query.roles ? req.query.roles.toUpperCase().split(",") : [];
  const numericRoles = roles
    .map((role) => ROLES_LIST[role])
    .filter((role) => role !== undefined);

  if (!numericRoles.length) {
    return res.status(400).json({ message: "Invalid roles provided" });
  }

  const users = await User.find({
    $or: numericRoles.map((roleValue) => ({
      [`roles.${Object.keys(ROLES_LIST).find(
        (key) => ROLES_LIST[key] === roleValue
      )}`]: roleValue,
    })),
  });
  res.status(200).json(new ApiResponse(200, users, "All users fetched"));
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  updateUsername,
  refreshAccessToken,
  updateUserInfo,
  updateAvatar,
  getAllUsers,
  getUsersByRole,
};

// Is it necessary to check for allowed updates while updating user?
