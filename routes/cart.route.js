const router = require("express").Router();
const verifyJWT = require("../middleware/verifyJWT.middleware");
const {
  createACart,
  addItemsToCart,
  getAllCarts,
  getCartOfACustomer,
} = require("../controllers/cart.controller");
const ROLES_LIST = require("../config/rolesList");
const varifyRoles = require("../middleware/verifyRoles.middleware");

router.route("/create-a-cart").post(verifyJWT, createACart);
router.route("/add-items-to-cart").patch(verifyJWT, addItemsToCart);
router
  .route("/get-all-carts")
  .get(
    verifyJWT,
    varifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    getAllCarts
  );
router
  .route("/get-cart-of-a-customer/:customerId")
  .get(verifyJWT, getCartOfACustomer);

module.exports = router;
