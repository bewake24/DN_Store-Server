const ROLES_LIST = require("../config/rolesList");
const {
  addAProduct,
  getAllProducts,
  getAProduct,
  updateAProduct,
  updateProductThumbnail,
  updateProductGallery,
  deleteAProduct,
} = require("../controllers/product.controller");
const upload = require("../middleware/multer.middleware");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const limiter = require("../middleware/rateLimit.middleware");
const csrfProtection = require("../middleware/csrf.middleware");

const router = require("express").Router();

router
  .route("/add-a-product")
  .post(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "gallery" }]),
    addAProduct
  );

router.route("/get-all-products").get(limiter("15m", 100), getAllProducts);

router.route("/get-a-product/:id").get(limiter("15m", 100), getAProduct);

router
  .route("/update-a-product/:id")
  .patch(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    updateAProduct
  );

router
  .route("/update-product-thumbnail/:id")
  .patch(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    upload.single("thumbnail"),
    updateProductThumbnail
  );

router
  .route("/update-product-gallery/:id")
  .patch(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    upload.array("gallery", 10),
    updateProductGallery
  );

router
  .route("/delete-a-product/:id")
  .delete(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    deleteAProduct
  );

module.exports = router;
