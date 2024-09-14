const { MALE, FEMALE, OTHERS } = require("../../constants/models.constants");

class validator {
  static validateEmail(emailAddress) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = emailAddress.trim().toLowerCase();
    return emailPattern.test(trimmedEmail) ? trimmedEmail : false;
  }

  static validatePassword(input) {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    const trimmedPassword = input.trim();
    return passwordPattern.test(trimmedPassword) ? trimmedPassword : false;
  }

  static validateName(input) {
    const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const trimmedName = input.trim().split(" ").filter(Boolean).join(" ");
    return namePattern.test(trimmedName) ? trimmedName : false;
  }

  static validateUsername(input) {
    const pattern = /^(?=.{3,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/;
    const username = input.trim().toLowerCase();
    if (!pattern.test(username)) {
      return false;
    }
    return username;
  }

  static validatePhoneNo(phoneNumber) {
    const phonePattern = /^\d{10}$/;
    const trimmedPhoneNumber = phoneNumber.trim();
    return phonePattern.test(trimmedPhoneNumber) ? trimmedPhoneNumber : false;
  }

  static validateGender(genderValue) {
    const validGenderValues = [MALE, FEMALE, OTHERS];
    return validGenderValues.includes(genderValue) ? genderValue : false;
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
