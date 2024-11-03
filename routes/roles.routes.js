const router = require("express").Router();
const ROLES_LIST = require("../config/rolesList");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");

const {
  assignRoleToUser,
  revokeRoleFromUser,
} = require("../controllers/roles.controller");

router
  .route("/assign-roles/:id")
  .patch(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    assignRoleToUser
  );

router
  .route("/revoke-roles/:id")
  .patch(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    revokeRoleFromUser
  );

module.exports = router;