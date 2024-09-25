const router = require("express").Router();
const ROLES_LIST = require("../config/rolesList");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const validateInputs = require("../middleware/validateInputs.middleware");
const { assignRoleToUser } = require("../controllers/rolesController");

router
  .route("/assign-roles/:id")
  .patch(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    validateInputs,
    assignRoleToUser
  );

module.exports = router