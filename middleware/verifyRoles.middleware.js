const apiXRes = require("../utils/apiXRes");
const verifyRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    const result = Object.values(req.user.roles)
      .filter((value) => value)
      .map((role) => allowedRoles.includes(role))
      .some((value) => value === true);

    if (!result) {
      apiXRes.unauthorized(res, "You are not allowed to perform this action");
    }
    next();
  };

module.exports = verifyRoles;
