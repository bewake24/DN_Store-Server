const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../model/user.model");
const rolesObjectToArray = require("../utils/rolesObjectToArray");
const rolesArrayToObject = require("../utils/rolesArrayToObject");

const assignRoleToUser = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id).select("roles name").lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let currentRoles = rolesObjectToArray(user).roles;
  const incomingRoles = req.validFields.roles
    .toString()
    .split(",")
    .map((role) => Number(role));

  user.roles = rolesArrayToObject([
    ...new Set([...currentRoles, ...incomingRoles]),
  ]);

  await User.findByIdAndUpdate(req.params.id, { roles: user.roles });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        rolesObjectToArray(user),
        "User updated successfully"
      )
    );
});

module.exports = {
  assignRoleToUser,
};
