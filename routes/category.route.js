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

router
  .route("/")
  .post(
    verifyJWT,
    verifyRoles("admin"),
    upload.single("thumbnail"),
    createCategory
  );

module.exports = router;
