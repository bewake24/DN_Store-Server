const mongoose = require("mongoose");
const {
  CATEGORY,
  TAG,
  USER,
  PRODUCT,
  PUBLISHED,
  DRAFT,
  UNDER_REVIEW,
  SIMPLE,
  VARIABLE,
} = require("../constants/models.constants");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    pruductType: {
      type: String,
      enum: [SIMPLE, VARIABLE],
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
      default: DRAFT,
    },

    // simple product specific fields
    price: {
      type: Number,
      required: function () {
        return this.pruductType === SIMPLE;
      },
    },
    salePrice: {
      type: Number,
      required: function () {
        return this.pruductType === SIMPLE;
      },
    },

    stockQuantity: {
      type: Number,
      required: function () {
        return this.pruductType === SIMPLE;
      },
    },
    sku: {
      type: String,
      uppercase: true,
      unique: true,
      required: function () {
        return this.productType === SIMPLE; // Required only for simple products
      },
    },
    // variable product specific fields
    attributes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
        validate: {
          validator: function(value) {
            // custom validation logic here
            return this.productType === VARIABLE;
          },
          message: 'Variations are required for product type VARIABLE'
        }
      },
    ],
variations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Option",
        validate: {
          validator: function(value) {
            // custom validation logic here
            return this.productType === VARIABLE;
          },
          message: 'Variations are required for product type VARIABLE'
        }
      },
    ]
  },
  { timestamps: true }
);

const Product = mongoose.model(PRODUCT, productSchema);

module.exports = Product;
