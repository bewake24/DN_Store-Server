const router = require("express").Router();
const verifyJWT = require("../middleware/verifyJWT.middleware");
const limiter = require("../middleware/rateLimit.middleware");
const csrfProtection = require("../middleware/csrf.middleware");
const {
  addAnAddress,
  getUserAddresses,
  updateAnAddress,
  deleteAnAddress,
} = require("../controllers/address.controller");

router
  .route("/add-an-address")
  .post(limiter("15m", 100), verifyJWT, addAnAddress);

router
  .route("/get-user-addresses")
  .get(limiter("15m", 100), verifyJWT, getUserAddresses);

router
  .route("/update/:id")
  .put(limiter("15m", 100), csrfProtection, verifyJWT, updateAnAddress);

router
  .route("/delete/:id")
  .delete(limiter("15m", 100), csrfProtection, verifyJWT, deleteAnAddress);

module.exports = router;
