const router = require("express").Router();
const verifyJWT = require("../middleware/verifyJWT.middleware");
const ROLES_LIST = require("../config/rolesList");
const { addAProduct } = require("../controllers/products.controller");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const validateInputs = require("../middleware/validateInputs.middleware");

router
  .route("/add-a-product")
  .post(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), validateInputs, addAProduct);

module.exports = router;
