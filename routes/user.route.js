const {
  registerUser,
  loginUser,
  logout,
  refreshAccessToken,
  updateUserInfo,
  updateAvatar,
  updateUsername,
  getAllUsers,
  getUsersByRole,
} = require("../controllers/user.controller");
const ROLES_LIST = require("../config/rolesList");
const limiter = require("../middleware/rateLimit.middleware");
const upload = require("../middleware/multer.middleware");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const csrfProtection = require("../middleware/csrf.middleware");

const router = require("express").Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(limiter("15m", 100), csrfProtection, loginUser);

//Secured Routes
router.route("/logout").post(limiter("15m", 100), verifyJWT, logout);
router.route("/refresh-access-token").get(verifyJWT, refreshAccessToken);
router.route("/update-user").patch(verifyJWT, updateUserInfo);
router.route("/update-username").patch(verifyJWT, updateUsername);
router
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateAvatar);
router
  .route("/get-all-users")
  .get(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), getAllUsers);
router
  .route("/get-users")
  .get(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), getUsersByRole);
module.exports = router;
