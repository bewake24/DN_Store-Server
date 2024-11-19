const router = require("express").Router();
const {
  addAVariation,
  // getVariations,
  // getAVariation,
  // updateAVariation,
  // deleteAVariation,
} = require("../controllers/variation.controller");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const ROLES_LIST = require("../config/rolesList");

router
  .route("/add-a-variation/:id")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    addAVariation
  );

module.exports = router;
