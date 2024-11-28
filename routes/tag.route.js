const router = require("express").Router();
const {
  createTag,
  getTags,
  getATag,
  deleteTag,
  updateTag,
} = require("../controllers/tag.controller");
const upload = require("../middleware/multer.middleware");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const limiter = require("../middleware/rateLimit.middleware");
const csrfProtection = require("../middleware/csrf.middleware");
const ROLES_LIST = require("../config/rolesList");

router
  .route("/create-tag")
  .post(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    createTag
  );

router
  .route("/get-all-tags")
  .get(
    limiter("15m", 100),
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    getTags
  );

router
  .route("/get-tag/:name")
  .get(
    limiter("15m", 100),
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    getATag
  );

router
  .route("/update-tag/:id")
  .patch(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    updateTag
  );

router
  .route("/delete-tag/:name")
  .delete(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    deleteTag
  );

module.exports = router;
