const { registerUser } = require('../controllers/user.controller');
const upload = require('../middleware/multer.middleware')

const router = require('express').Router();

router.route('/register').post(upload.fields([{name: "avatar", maxcCount: 1}]), registerUser)

module.exports = router