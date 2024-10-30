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
    thumbnail: {
      type: String,
      trim: true,
    },
    gallery: [
      {
        type: String,
        trim: true,
      },
    ],
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

    variations: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variation" }], // List of variations
      validate: {
        validator: function (value) {
          // Simple product must have exactly one variation
          return (
            (this.productType === SIMPLE && value.length === 1) ||
            (this.productType === VARIABLE && value.length > 1)
          );
        },
        message: (props) =>
          `A ${props.instance.productType} product must have ${
            props.instance.productType === SIMPLE ? "one" : "more than one"
          } variation(s).`,
      },
    },

    // variable product specific fields
    attributes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
        validate: {
          validator: function (value) {
            // custom validation logic here
            return this.productType === VARIABLE;
          },
          message: "Variations are required for product type VARIABLE",
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model(PRODUCT, productSchema);

module.exports = Product;
