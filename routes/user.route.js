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
  addRoleToUser,
} = require("../controllers/user.controller");
const ROLES_LIST = require("../config/rolesList");

const upload = require("../middleware/multer.middleware");
const verifyJWT = require("../middleware/verifyJWT.middleware");
const validateInputs = require("../middleware/validateInputs.middleware");
const verifyRoles = require("../middleware/verifyRoles.middleware");

const router = require("express").Router();

router
  .route("/register")
  .post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser); // if using form data in frontend then add upload.none() middleware in the route
//    or check:=> Content-Type multipart/form-data (in postman)
//    or send data in form data in postman as: x-www-form-urlencoded


//Secured Routes
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-access-token").get(verifyJWT, refreshAccessToken);
router.route("/update-user").patch(verifyJWT, updateUserInfo);
router
  .route("/update-username")
  .patch(verifyJWT, updateUsername);
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
