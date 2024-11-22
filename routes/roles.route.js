const router = require("express").Router();
const ROLES_LIST = require("../config/rolesList");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const limiter = require("../middleware/rateLimit.middleware");
const csrfProtection = require("../middleware/csrf.middleware");

const {
  assignRoleToUser,
  revokeRoleFromUser,
} = require("../controllers/roles.controller");

router
  .route("/assign-roles/:id")
  .patch(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    assignRoleToUser
  );

router
  .route("/revoke-roles/:id")
  .patch(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    revokeRoleFromUser
  );

module.exports = router;
