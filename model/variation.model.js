const VARIATION = require("../constants/models.constants");
const mongoose = require("mongoose");
const variationSchema = new mongoose.Schema({
  attributes: [
    {
      name: { type: String, required: true },
      value: { type: String, required: true },
      _id: false, // Disable the automatic _id for subdocuments
    },
  ],
  sku: {
    type: String,
    uppercase: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
  },
  stockQuantity: {
    type: Number,
    default: -1, // -1 for unlimited stock
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const Variation = mongoose.model("Variation", variationSchema);

module.exports = Variation;

// If stockQuantity === -1  => Stock quantity not specified
//If stockQuantity === 0  => Item not in stock and can't be ordered by CUSTOMER

/*
 Displaying to the frontend
 Color: |  Red  |  Green  |  Blue   |   Yellow  |  White   |
 Rendererd color : |  Red  |  Green  |  Blue   | only available for the given products ==> Do this through Set()

 Weight: |  2Kg  |  1Kg  |  500g   |   3Kg |
 Rendered Weight :|      2Kg    |     3Kg     |
 
 ==> Highlight all variation available for one option for the product if that option is not out of stock
 e.g. 2kg --> show red in highlight because red is the only color available for 2kg and in stock.
*/
