const verifyRoles =
  (...allowedRoles) =>
  (req, _, next) => {
    const result = Object.values(req.user.roles)
      .filter((value) => value)
      .map((role) => allowedRoles.includes(role))
      .some((value) => value === true);

    if (!result) {
      throw new Error("Unauthorized access");
    }
    next();
  };

module.exports = verifyRoles;
