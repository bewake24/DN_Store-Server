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
const ROLES_LIST = require("../config/rolesList");

router
  .route("/create-tag")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    createTag
  );

router
  .route("/get-all-tags")
  .get(verifyJWT, verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER), getTags);

router
  .route("/get-tag/:name")
  .get(verifyJWT, verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER), getATag);

router
  .route("/update-tag/:id")
  .patch(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    updateTag
  );

router
  .route("/delete-tag/:name")
  .delete(
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    deleteTag
  );

module.exports = router;
