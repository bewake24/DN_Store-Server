const { registerUser, loginUser, logout, refreshAccessToken, updateUserInfo} = require('../controllers/user.controller');
const upload = require('../middleware/multer.middleware');
const verifyJWT = require('../middleware/verifyJWT.middleware');

const router = require('express').Router();

router.route('/register').post(upload.fields([{name: "avatar", maxcCount: 1}]), registerUser)
router.route('/login').post(loginUser) // if using form data in frontend then add upload.none() middleware in the route 
//    or check:=> Content-Type multipart/form-data (in psotman)
//    or send data in form data in postman as: x-www-form-urlencoded


//Secured Routes
router.route('/logout').post(verifyJWT, logout);
router.route('/refresh-access-token').get(verifyJWT, refreshAccessToken)
router.route('/update-user').patch(verifyJWT, updateUserInfo)

module.exports = router