const router = require("express").Router();
const verifyJWT = require("../middleware/verifyJWT.middleware");
const {
  createACart,
  addItemsToCart,
  getAllCarts,
  getCartOfACustomer,
} = require("../controllers/cart.controller");
const ROLES_LIST = require("../config/rolesList");
const verifyRoles = require("../middleware/verifyRoles.middleware");
const limiter = require("../middleware/rateLimit.middleware");
const csrfProtection = require("../middleware/csrf.middleware");

router.route("/create-a-cart").post(verifyJWT, createACart);
router.route("/add-items-to-cart").patch(verifyJWT, addItemsToCart);
router
  .route("/get-all-carts")
  .get(
    limiter("15m", 100),
    verifyJWT,
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.MANAGER),
    getAllCarts
  );
router
  .route("/get-cart-of-a-customer/:customerId")
  .get(limiter("15m", 100), verifyJWT, getCartOfACustomer);

module.exports = router;
