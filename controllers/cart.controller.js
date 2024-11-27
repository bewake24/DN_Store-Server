const {
  MONGOOSE_CAST_ERROR,
  MONGOOSE_OBJECT_ID,
} = require("../constants/models.constants");
const Cart = require("../model/cart.model");
const User = require("../model/user.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const validateCartItems = (cartItems) => {
  const validationError = cartItems.every(
    (item) =>
      !item.productVariationId ||
      !item.quantity ||
      Object.keys(item).length != 2
  );

  if (validationError) {
    return {
      cartItems:
        "Invalid cart items provided. Cart Items must and only contain productVariationId and quantity",
    };
  }
  return null;
};

const mergeCartItems = (existingItems, incomingItems) => {
  const existingItemsMap = new Map();

  existingItems.forEach((item) => {
    existingItemsMap.set(item.productVariationId.toString(), item.quantity);
  });

  incomingItems.forEach((newItem) => {
    const existingQuantity =
      existingItemsMap.get(newItem.productVariationId) || 0;
    const updatedQuantity = existingQuantity + newItem.quantity;

    if (updatedQuantity > 0) {
      existingItemsMap.set(newItem.productVariationId, updatedQuantity);
    } else {
      existingItemsMap.delete(newItem.productVariationId);
    }
  });

  const updatedCartItems = Array.from(existingItemsMap.entries()).map(
    ([productVariationId, quantity]) => ({
      productVariationId,
      quantity,
    })
  );

  return updatedCartItems;
};

const createACart = asyncHandler(async (req, res) => {
  try {
    const { cartItems } = req.body;

    const userId = req.user?._id;

    if (!userId) {
      return ApiResponse.validationError(
        res,
        "Cart creation failed",
        {
          userId: "You must be loggedin to create a cart",
        },
        400
      );
    }

    const userCart = await Cart.findOne({ customerId: userId });

    if (userCart) {
      return ApiResponse.conflict(
        res,
        "Cart for this user already exista. An user can have only one cart at max."
      );
    }

    const validateCartItemsError = validateCartItems(cartItems);
    if (validateCartItemsError) {
      return ApiResponse.validationError(
        res,
        "Cart creation failed",
        validateCartItemsError,
        400
      );
    }
    const cart = await Cart.create({ customerId: userId, cartItems });

    ApiResponse.success(
      res,
      "Cart created successfully",
      { cart, csrfTolken: req.csrfToken() },
      200
    );
  } catch (error) {
    if (
      error.name === MONGOOSE_CAST_ERROR &&
      error.kind === MONGOOSE_OBJECT_ID
    ) {
      return ApiResponse.notFound(res, "Invalid Customer ID  Provided");
    }
    ApiResponse.error(res, "Error while creating cart", 500, error);
  }
});

const addItemsToCart = asyncHandler(async (req, res) => {
  try {
    const { cartItems } = req.body;

    const userId = req.user._id;

    if (!userId) {
      return ApiResponse.validationError(
        res,
        "Addition of Item to the cart failed. User must be loggedin.",
        {
          userId: "You must be loggedin to update a cart",
        },
        400
      );
    }

    const validateCartItemsError = validateCartItems(cartItems);
    if (validateCartItemsError) {
      return ApiResponse.validationError(
        res,
        "Cart update failed",
        validateCartItemsError,
        400
      );
    }

    const cart = await Cart.findOne({ customerId: userId });

    if (!cart) {
      return ApiResponse.notFound(
        res,
        "Cart doesnot exists for this user please create a cart for this user.",
        404
      );
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { customerId: userId },
      { $set: { cartItems: mergeCartItems(cart.cartItems, cartItems) } },
      { new: true, runValidators: true }
    );
    ApiResponse.success(
      res,
      "Cart updated successfully",
      { cart: updatedCart, csrfTolken: req.csrfToken() },
      200
    );
  } catch (error) {
    ApiResponse.error(res, "Error while updating cart", 500, error);
  }
});

const getAllCarts = asyncHandler(async (req, res) => {
  try {
    const carts = await Cart.find();
    ApiResponse.success(res, "All carts fetched successfully", carts, 200);
  } catch (error) {
    ApiResponse.error(res, "Error while fetching all carts", 500, error);
  }
});

const getCartOfACustomer = asyncHandler(async (req, res) => {
  try {
    const { customerId } = req.params;

    console.log(customerId);

    const customer = await User.findById(customerId);
    if (!customer) {
      return ApiResponse.notFound(res, "Customer doesnot exists", 404);
    }
    const cart = await Cart.findOne({ customerId });
    ApiResponse.success(res, "Cart fetched successfully", cart, 200);
  } catch (error) {
    ApiResponse.error(res, "Error while fetching cart", 500, error);
  }
});

module.exports = {
  createACart,
  addItemsToCart,
  getAllCarts,
  getCartOfACustomer,
};
