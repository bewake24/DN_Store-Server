const ROLES_LIST = require("../config/rolesList");
const {
  addAProduct,
  getAllProducts,
  getAProduct,
  updateAProduct,
  deleteAProduct,
} = require("../controllers/product.controller");
const upload = require("../middleware/multer.middleware");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");

const router = require("express").Router();

router
  .route("/add-a-product")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "gallery" }]),
    addAProduct
  );

router.route("/get-all-products").get(getAllProducts);
router.route("/get-a-product/:id").get(getAProduct);

router
  .route("/update-a-product/:id")
  .patch(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    updateAProduct
  );

router
  .route("/delete-a-product/:id")
  .delete(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), deleteAProduct);

module.exports = router;
