const attributeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    values: [String],  // Possible values for the attribute, e.g., ['Red', 'Blue', 'Green'] for color
  });
  
  const Attribute = mongoose.model('Attribute', attributeSchema);
  