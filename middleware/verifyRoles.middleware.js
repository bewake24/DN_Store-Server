const ApiResponse = require("../utils/ApiResponse");
const verifyRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    const result = Object.values(req.user.roles)
      .filter((value) => value)
      .map((role) => allowedRoles.includes(role))
      .some((value) => value === true);

    if (!result) {
      ApiResponse.unauthorized(
        res,
        "Chickens don't fly, You are not allowed to perform this action"
      );
    }
    next();
  };

module.exports = verifyRoles;
