const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const apiXRes = require("../utils/apiXRes");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../model/user.model");
const rolesObjectToArray = require("../utils/rolesObjectToArray");
const rolesArrayToObject = require("../utils/rolesArrayToObject");
const { CUSTOMER } = require("../config/rolesList");
const ROLES_LIST = require("../config/rolesList");

const assignRoleToUser = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id).select("roles name");

  if (!user) {
    apiXRes.notFound(res, "User not found");
  }

  if (!req.body.roles) {
    apiXRes.validationError(
      res,
      "Roles field is empty",
      { roles: "Roles field is required" },
      400
    );
  }

  const validRoles = Object.values(ROLES_LIST);

  let currentRoles = rolesObjectToArray(user).roles.filter((role) => role);
  const incomingRoles = req.body.roles
    .toString()
    .split(",")
    .map((role) => Number(role));

  const areAllRolesValid = incomingRoles.every((role) =>
    validRoles.includes(role)
  );
  if (!areAllRolesValid) {
    apiXRes.validationError(
      res,
      "Roles contains some invalid roles",
      { roles: "All roles values must be valid" },
      400
    );
  }

  user.roles = rolesArrayToObject([
    ...new Set([...currentRoles, ...incomingRoles]),
  ]);

  await user.save();

  apiXRes.success(
    res,
    "User updated successfully",
    rolesObjectToArray(JSON.parse(JSON.stringify(user))),
    200
  );
});

const revokeRoleFromUser = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id).select("roles name");

  if (!user) {
    apiXRes.notFound(res, "User not found");
  }

  if (!req.body.roles) {
    apiXRes.validationError(
      res,
      "Roles field is empty",
      { roles: "Roles field is required" },
      400
    );
  }

  const validRoles = Object.values(ROLES_LIST);

  let rolesToRevoke = req.body.roles
    .toString()
    .split(",")
    .map((role) => Number(role));

  const areAllRolesValid = rolesToRevoke.every((role) =>
    validRoles.includes(role)
  );
  if (!areAllRolesValid) {
    apiXRes.validationError(
      res,
      "Roles contains some invalid roles",
      { roles: "All roles values must be valid" },
      400
    );
  }

  if (rolesToRevoke.includes(CUSTOMER)) {
    apiXRes.forbidden(
      res,
      "Revoke request contains default user role, can't remove this. If you want user to not access this platform kindly change the status of user to Blocked."
    );
  }

  let currentRoles = rolesObjectToArray(user).roles.filter((role) => role);
  console.log(currentRoles);

  const roles = rolesArrayToObject([
    ...new Set(currentRoles.filter((index) => !rolesToRevoke.includes(index))),
  ]);

  user.roles = roles;
  await user.save();

  apiXRes.success(
    res,
    "User updated successfully",
    rolesObjectToArray(JSON.parse(JSON.stringify(user))),
    200
  );
});

module.exports = {
  assignRoleToUser,
  revokeRoleFromUser,
};
