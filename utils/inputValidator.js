class inputValidator {
  // Define the patterns as static properties of the class
  static patterns = {
    username: /^(?=.{3,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
    phoneNo: /^\d{10}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    name: /^[A-Za-z]+(?: [A-Za-z]+)*$/
  };

  // Generic method to validate input based on pattern type
  static validateOne(input, type) {
    const pattern = this.patterns[type];
    if (!pattern) {
      throw new Error(`Validation type '${type}' is not supported.`);
    }
    return pattern.test(input.trim());
  }

  // Method to validate multiple inputs at once and return the invalid ones
  static validateMany(inputs) {
    return inputs
      .map(({ input, type }) => ({
        input,
        type,
        isValid: this.validateOne(input, type)
      }))
      .filter(result => !result.isValid)  // Filter out the valid inputs, keeping only the invalid ones
      .map(result => (' '+ result.type)).toString();  // Return only input and type
  }
}

module.exports = inputValidator;
