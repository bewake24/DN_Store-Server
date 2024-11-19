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
const ROLES_LIST = require("../config/rolesList");

router
  .route("/add-a-variation/:id")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    addAVariation
  );

router
  .route("/get-all-variations-of-a-product/:id")
  .get(getAllVariationsOfAProduct);

router
  .route("/delete-a-variation/:id")
  .delete(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), deleteAVariation);

router
  .route("/delete-all-variations-of-a-product/:id")
  .delete(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    deleteAllVariationsOfAProduct
  );

router
  .route("/update-a-variation/:id")
  .patch(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    updateAVariation
  );

module.exports = router;
