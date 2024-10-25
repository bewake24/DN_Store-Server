const {
  validateEmail,
  validatePassword,
  validateName,
  validatePhoneNo,
  validateUsername,
  validateGender,
  validateRoles
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
    case "alternatePhoneNo":
      return validatePhoneNo(input);
    case "username":
      return validateUsername(input);
    case "gender":
      return validateGender(input);
    case "usernameOrEmail":
      return validateEmail(input) || validateUsername(input);
    case "roles":
      return validateRoles(input)
    default:
      return input;
  }
};

module.exports = validateInput;
