const { MALE, FEMALE, OTHERS } = require("../constants/models.constants");

class validator {
  static validateEmail(input) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //trim the input
    const email = input.trim().toLowerCase();

    // return false if input doesn't satisfy
    if (!pattern.test(email)) return {type: "email", isValid: false};

    // return the valid input
    return email;
  }

  static validatePasword(input) {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    const password = input.trim();
    if (!pattern.test(password)) return {type: "password", isValid: false};
    return password;
  }

  static validatename(input) {
    const pattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const name = input
      .trim()
      .split(" ")
      .filter((index) => index !== "")
      .join(" ");
    if (!pattern.test(name)) return {type: "name", isValid: false};
    return name;
  }

  static validateUsername(input) {
    const pattern = /^(?=.{3,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/;
    const username = input.trim().toLowerCase();
    if (!pattern.test(username)) return {type: "username", isValid: false};
    return username;
  }

  static validatePhoneNo(input) {
    const pattern = /^\d{10}$/;
    const phoneNo = input.trim();
    if (!pattern.test(phoneNo)) return {type: "Phone number", isValid: false};
    return phoneNo;
  }

  static validateGender(input) {
    if (input === MALE || input === FEMALE || input === OTHERS) return input;
    return {type: "Gender", isValid: false};
  }
}

module.exports = validator;
