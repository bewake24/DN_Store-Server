const router = require("express").Router();
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const ROLES_LIST = require("../config/rolesList");
const {
  createAttribute,
  getAllAttributes,
  getAnAttribute,
  updateAnAttribute,
  deleteAnAttribute,
} = require("../controllers/attribute.controller");

router.post(
  "/create-attribute",
  verifyJWT,
  verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
  createAttribute
);

router.get(
  "/get-all-attributes",
  verifyJWT,
  verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
  getAllAttributes
);

router.get(
  "/get-an-attribute/:id",
  verifyJWT,
  verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
  getAnAttribute
);

router.patch(
  "/update-an-attribute/:id",
  verifyJWT,
  verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
  updateAnAttribute
);

router.delete(
  "/delete-an-attribute/:id",
  verifyJWT,
  verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
  deleteAnAttribute
);

module.exports = router;
