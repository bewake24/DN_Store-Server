const mongoose = require("mongoose");
const { PRODUCT, USER, REVIEW } = require("../constants/models.constants");

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: USER, required: true },
    productId: { type: Schema.Types.ObjectId, ref: PRODUCT, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    content: String,
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = mongoose.model(REVIEW, reviewSchema);

module.exports = Review;
