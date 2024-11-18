const mongoose = require("mongoose");
const slugify = require("slugify");
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
const { productNameRegex } = require("../constants/regex.constants");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      match: [productNameRegex, "Product Name not in proper format"],
      required: [true, "Product Name is required"],
    },
    slug: {
      type: String,
      trim: true,
      required: [true, "Product Slug is required"],
      unique: [true, "Product slug must be unique"],
    },
    productType: {
      type: String,
      enum: [SIMPLE, VARIABLE],
      default: SIMPLE,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [4, "Description must be at least 4 characters long"],
      maxlength: [2048, "Description must be at most 2048 characters long"],
    },
    shortDescription: {
      type: String,
      trim: true,
      required: [true, "Short description is required"],
      minlength: [4, "Short description must be at least 4 characters long"],
      maxlength: [512, "Short description must be at most 512 characters long"],
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
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variation",
        },
      ],
      validate: {
        validator: function (value) {
          if (this.productType === SIMPLE && value.length > 0) {
            return false; // Invalid if SIMPLE product has any variations
          }
          if (this.productType === VARIABLE && value.length < 1) {
            return false; // Invalid if VARIABLE product has no variations
          }
          return true;
        },
        message: (props) =>
          props.instance.productType === SIMPLE
            ? "A SIMPLE product must not have any variations."
            : "A VARIABLE product must have at least one variation.",
      },
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },

    // variable product specific fields
    attributes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
        validate: {
          validator: function (value) {
            return this.productType === VARIABLE;
          },
          message: "Attributes are required for VARIABLE products.",
        },
      },
    ],
  },
  { timestamps: true }
);

// Middleware to automatically generate a slug from the name
productSchema.pre("validate", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Product = mongoose.model(PRODUCT, productSchema);

module.exports = Product;
