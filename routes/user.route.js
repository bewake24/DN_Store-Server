const { registerUser, loginUser, logout, refreshAccessToken} = require('../controllers/user.controller');
const upload = require('../middleware/multer.middleware');
const verifyJWT = require('../middleware/verifyJWT.middleware');

const router = require('express').Router();

router.route('/register').post(upload.fields([{name: "avatar", maxcCount: 1}]), registerUser)

router.route('/login').post(loginUser) // if using form data in frontend then add upload.none() middleware in the route

//Secured Routes
router.route('/logout').post(verifyJWT, logout);
router.route('/refreshAccessToken').get(verifyJWT, refreshAccessToken)

module.exports = router