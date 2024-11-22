const router = require("express").Router();
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const ROLES_LIST = require("../config/rolesList");
const csrfProtection = require("../middleware/csrf.middleware");
const limiter = require("../middleware/rateLimit.middleware");
const {
  createAttribute,
  getAllAttributes,
  getAnAttribute,
  updateAnAttribute,
  deleteAnAttribute,
} = require("../controllers/attribute.controller");

router
  .route("/create-attribute")
  .post(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    createAttribute
  );

router
  .route("/get-all-attributes")
  .get(
    limiter("15m", 100),
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    getAllAttributes
  );

router
  .route("/get-an-attribute/:id")
  .get(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    getAnAttribute
  );

router
  .route("/update-an-attribute")
  .patch(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    updateAnAttribute
  );

router
  .route("/delete-an-attribute/:id")
  .delete(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    deleteAnAttribute
  );

module.exports = router;
