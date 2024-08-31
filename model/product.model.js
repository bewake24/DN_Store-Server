const mongoose = require("mongoose");
const {
  CATEGORY,
  TAG,
  VARIATION,
  USER,
  REVIEW,
  PRODUCT,
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
    },
    description: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: CATEGORY,
        //Refrences to category model
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: TAG,
        //refrences to tag model
      },
    ],
    variations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: VARIATION,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER,
      //refrences to user model who are store manager
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: REVIEW,
        //refrences to reviews model
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model(PRODUCT, productSchema);

module.exports = Product;
