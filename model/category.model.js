const mongoose = require("mongoose");
const { CATEGORY } = require("../constants/models.constants");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    thumbnail: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    parent_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CATEGORY,
      default: null,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model(CATEGORY, categorySchema);

module.exports = Category;
