const mongoose = require("mongoose");
const { PRODUCT, USER, CART } = require("../constants/models.constants");

const cartItemsSchema = new mongoose.Schema({
  productVariationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PRODUCT,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  _id: false,
});

const cartSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER,
    },
    cartItems: [cartItemsSchema],
  },
  { timeStamps: true }
);

const Cart = mongoose.model(CART, cartSchema);

module.exports = Cart;
