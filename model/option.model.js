const optionSchema = new mongoose.Schema({
    attributes: [
      {
        name: String,    // e.g., 'Color'
        value: String,   // e.g., 'Red'
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
      default: -1,  // -1 for unlimited stock
    }
  });
  
  const Option = mongoose.model('Option', optionSchema);
  


// If stockQuantity === -1  => Stock quantity not specified
//If stockQuantity === 0  => Item not in stock and can't be ordered by CUSTOMER