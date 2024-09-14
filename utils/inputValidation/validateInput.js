const {
    validateEmail,
    validatePassword,
    validateName,
    validatePhoneNo,
    validateUsername,
    validateGender,
  } = require("./validators.js");
  
  const validateInput = (input, type) => {
    switch (type) {
      case "email":
        return validateEmail(input);
      case "password":
        return validatePassword(input);
      case "name":
        return validateName(input);
      case "phoneNo":
        return validatePhoneNo(input);
      case "username":
        return validateUsername(input);
      case "gender":
        return validateGender(input);
      default:
        return input;
    }
  };

module.exports = validateInput