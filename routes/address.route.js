const router = require("express").Router();
const verifyJWT = require("../middleware/verifyJWT.middleware");
const {
  addAnAddress,
  getUserAddresses,
  updateAnAddress,
  deleteAnAddress,
} = require("../controllers/address.controller");

router.route("/add-an-address").post(verifyJWT, addAnAddress);
router.route("/get-user-addresses").get(verifyJWT, getUserAddresses);
router.route("/update/:id").put(verifyJWT, updateAnAddress);
router.route("/delete/:id").delete(verifyJWT, deleteAnAddress);

module.exports = router;
