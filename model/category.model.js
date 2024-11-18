const mongoose = require("mongoose");
const slugify = require("slugify");
const { CATEGORY } = require("../constants/models.constants");
const { nameRegex } = require("../constants/regex.constants");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name is required"],
      unique: true,
      match: [nameRegex, "Category Name not in proper format"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Category Slug is required"],
      lowercase: true,
      unique: [true, "Category slug must be unique"],
    },
    thumbnail: {
      type: String,
      default: null, // Optional field, defaults to null
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Indexed for faster queries
    },
  },
  { timestamps: true }
);

// Middleware to automatically generate a slug from the name
categorySchema.pre("validate", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Index frequently queried fields
categorySchema.index({ slug: 1, isActive: 1 });

const Category = mongoose.model(CATEGORY, categorySchema);

module.exports = Category;
