const { MALE, FEMALE, OTHERS } = require("../constants/models.constants");

class validator {
  static validateEmail(input) {
    const response = { type: "email" };
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //trim the input
    const email = input.trim().toLowerCase();

    // return false if input doesn't satisfy
    if (!pattern.test(email)) {
      response.isValid = false;
      return false;
    }
    response.isValid = true;
    response.value = email;

    // return the valid input
    return email;
  }

  static validatePasword(input) {
    const response = { type: "password" };
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    const password = input.trim();
    if (!pattern.test(password)) {
      response.isValid = false;
      return false;
    }

    response.isValid = true;
    response.value = password;
    return password;
  }

  static validateName(input) {
    const response = { type: "name" };
    const pattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const name = input
      .trim()
      .split(" ")
      .filter((index) => index !== "")
      .join(" ");
    if (!pattern.test(name)) {
      response.isValid = false;
      return false;
    }

    response.isValid = true;
    response.value = name;
    return name;
  }

  static validateUsername(input) {
    const response = { type: "username" };
    const pattern = /^(?=.{3,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/;
    const username = input.trim().toLowerCase();

    if (!pattern.test(username)) {
      response.isValid = false;
      return false;
    }
    response.isValid = true;
    response.value = username;
    return username;
  }

  static validatePhoneNo(input) {
    const response = { type: "phoneNo" };
    const pattern = /^\d{10}$/;
    const phoneNo = input.trim();
    if (!pattern.test(phoneNo)) {
      response.isValid = false;
      return false;
    }
    response.isValid = true;
    response.value = phoneNo;
    return phoneNo;
  }

  static validateGender(input) {
    const response = { type: "gender" };
    if (input === MALE || input === FEMALE || input === OTHERS) {
      response.isValid = true;
      response.value = input;
      return input;
    }
    response.isValid = false;

    return false;
  }
}

module.exports = validator;


// Initial Approach
//  return properties to each method
//    1.) type
//    2.) isValid
//    3.) value

// Current Approach
//   Return false if input doesnt satisfy regesx
//   Return value if input satisfies regesx
