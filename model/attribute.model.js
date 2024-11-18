const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "Attribute name must be unique"],
    required: [true, "Attribute name is required"],
  },
  values: [String], // Possible values for the attribute, e.g., ['Red', 'Blue', 'Green'] for color
});

const Attribute = mongoose.model("Attribute", attributeSchema);

module.exports = Attribute;
