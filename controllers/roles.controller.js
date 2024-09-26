const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../model/user.model");
const rolesObjectToArray = require("../utils/rolesObjectToArray");
const rolesArrayToObject = require("../utils/rolesArrayToObject");
const { CUSTOMER } = require("../config/rolesList");

const assignRoleToUser = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id).select("roles name");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if(!req.validFields?.roles){
    throw new ApiError(404, "Roles filed is empty")
  }

  let currentRoles = rolesObjectToArray(user).roles;
  const incomingRoles = req.validFields.roles
    .toString()
    .split(",")
    .map((role) => Number(role));

  user.roles = rolesArrayToObject([
    ...new Set([...currentRoles, ...incomingRoles]),
  ]);

  await user.save()

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        rolesObjectToArray(JSON.parse(JSON.stringify(user))),
        "User updated successfully"
      )
    );
});

const revokeRoleFromUser = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id).select("roles name");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let currentRoles = rolesObjectToArray(user).roles;
  let rolesToRevoke = req.validFields.roles
  .toString()
  .split(",")
  .map((role) => Number(role));

  if(rolesToRevoke.includes(CUSTOMER)){
    throw new ApiError(404, "revoke request contains default user role, can't remove this. If you want user to not access this platform kindly change the status of user to Blocked.")
  }

  const roles = rolesArrayToObject([...new Set(currentRoles.filter(index => !rolesToRevoke.includes(index)))])

  user.roles = roles;
  await user.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        rolesObjectToArray(JSON.parse(JSON.stringify(user))),
        "User role revoked successfully"
      )
    );

})

module.exports = {
  assignRoleToUser,
  revokeRoleFromUser
};
