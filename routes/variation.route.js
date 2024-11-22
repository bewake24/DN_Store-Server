const router = require("express").Router();
const {
  addAVariation,
  // getVariations,
  // getAVariation,
  updateAVariation,
  getAllVariationsOfAProduct,
  deleteAVariation,
  deleteAllVariationsOfAProduct,
} = require("../controllers/variation.controller");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const limiter = require("../middleware/rateLimit.middleware");
const csrfProtection = require("../middleware/csrf.middleware");
const ROLES_LIST = require("../config/rolesList");

router
  .route("/add-a-variation/:id")
  .post(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    addAVariation
  );

router
  .route("/get-all-variations-of-a-product/:id")
  .get(limiter("15m", 100), getAllVariationsOfAProduct);

router
  .route("/delete-a-variation/:id")
  .delete(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    deleteAVariation
  );

router
  .route("/delete-all-variations-of-a-product/:id")
  .delete(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    deleteAllVariationsOfAProduct
  );

router
  .route("/update-a-variation/:id")
  .patch(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    updateAVariation
  );

module.exports = router;
