const User = require("../model/user.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorisation")?.replace("Bearer ", ""); // req.header for requests which came from mobile application

    if (!token) {
      return ApiResponse.unauthorized(
        res,
        "Unauthorised request make sure you are logged in and  you have proper access rights"
      );
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return ApiResponse.notFound(res, "Invalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    ApiResponse.unauthorized(res, error?.message || "Invalid access token");
  }
});

module.exports = verifyJWT;
