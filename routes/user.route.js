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

router
  .route("/register")
  .post(
    limiter("15m", 100),
    csrfProtection,
    upload.single("avatar"),
    registerUser
  );
router.route("/login").post(limiter("15m", 100), csrfProtection, loginUser);

//Secured Routes
router
  .route("/logout")
  .post(limiter("15m", 100), csrfProtection, verifyJWT, logout);

router
  .route("/refresh-access-token")
  .get(limiter("15m", 100), verifyJWT, refreshAccessToken);

router
  .route("/update-user")
  .patch(limiter("15m", 100), csrfProtection, verifyJWT, updateUserInfo);

router
  .route("/update-username")
  .patch(limiter("15m", 100), csrfProtection, verifyJWT, updateUsername);

router
  .route("/update-avatar")
  .post(
    limiter("15m", 100),
    csrfProtection,
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
  );

router
  .route("/get-all-users")
  .get(
    limiter("15m", 100),
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    getAllUsers
  );

router
  .route("/get-users")
  .get(
    limiter("15m", 100),
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN),
    getUsersByRole
  );
module.exports = router;
