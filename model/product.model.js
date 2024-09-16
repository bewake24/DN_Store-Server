const mongoose = require("mongoose");
const {
  CATEGORY,
  TAG,
  USER,
  PRODUCT,
  PUBLISHED,
  DRAFT,
  UNDER_REVIEW,
} = require("../constants/models.constants");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    pruductType: {
      type: String,
      enum: ["variable", "simple"],
    },
    description: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: CATEGORY,
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: TAG,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER,
    },
    productStatus: {
      type: String,
      enum: [PUBLISHED, DRAFT, UNDER_REVIEW],
      default: "active",
    },

    // simple product specific fields
    price: {
      type: Number,
      required: function () {
        return this.pruductType === "simple";
      },
    },
    salePrice: {
      type: Number,
      required: function () {
        return this.pruductType === "simple";
      },
    },

    stockQuantity: {
      type: Number,
      required: function () {
        return this.pruductType === "simple";
      },
    },
    sku: {
      type: String,
      uppercase: true,
      unique: true,
      required: function () {
        return this.productType === "simple"; // Required only for simple products
      },
    },
    // variable product specific fields
    attributes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
      },
    ],
    variations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Option",
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model(PRODUCT, productSchema);

module.exports = Product;
