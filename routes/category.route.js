const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/category.controller");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer.middleware");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const limiter = require("../middleware/rateLimit.middleware");
const csrfProtection = require("../middleware/csrf.middleware");
const ROLES_LIST = require("../config/rolesList");

router
  .route("/create-category")
  .post(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    upload.single("thumbnail"),
    createCategory
  );

router
  .route("/get-categories")
  .get(
    limiter("15m", 100),
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    getCategories
  );

router
  .route("/delete-category/:slug")
  .delete(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    deleteCategory
  );

router
  .route("/update-category/:slug")
  .patch(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    upload.single("thumbnail"),
    updateCategory
  );

module.exports = router;
