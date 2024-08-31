const mongoose = require("mongoose");
const {
  PRODUCT,
  USER,
  ADDRESS,
  PENDING,
  PROCESSING,
  SHIPPED,
  DELIVERED,
  CANCELLED,
  ORDER,
} = require("../constants/models.constants");

const orderItemsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PRODUCT,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER,
    },
    orderItems: [orderItemsSchema],
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ADDRESS,
      required: true,
    },
    billingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ADDRESS,
      required: true,
    },
    status: {
      type: String,
      enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED],
      default: PENDING,
    },
  },
  { timeStamps: true }
);

const Order = mongoose.model(ORDER, orderSchema);

module.exports = Order;
