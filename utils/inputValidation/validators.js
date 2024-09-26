const ROLES_LIST = require("../../config/rolesList");
const { MALE, FEMALE, OTHERS } = require("../../constants/models.constants");

const validateEmail = (emailAddress) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = emailAddress.trim().toLowerCase();
  return emailPattern.test(trimmedEmail) ? trimmedEmail : false;
};

const validateUsername = (input) => {
  const pattern = /^(?=.{3,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/;
  const trimmedUsername = input.trim();
  return pattern.test(trimmedUsername) ? trimmedUsername : false;
};

const validatePassword = (input) => {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
  const trimmedPassword = input.trim();
  return passwordPattern.test(trimmedPassword) ? trimmedPassword : false;
}; 

const validateName = (input) => {
  const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  const trimmedName = input.trim().split(" ").filter(Boolean).join(" ");
  return namePattern.test(trimmedName) ? trimmedName : false;
};

const validatePhoneNo = (phoneNumber) => {
  const phonePattern = /^\d{10}$/;
  const trimmedPhoneNumber = phoneNumber.trim();
  return phonePattern.test(trimmedPhoneNumber) ? trimmedPhoneNumber : false;
};

const validateGender = (genderValue) => {
  const validGenderValues = [MALE, FEMALE, OTHERS];
  return validGenderValues.includes(genderValue) ? genderValue : false;
};

const validateRoles = (roles) => {
  const validRoles = Object.values(ROLES_LIST);
  const rolesArray = roles
  .toString()
  .split(",")
  .map((role) => Number(role));
  
  return rolesArray.every((role) => validRoles.includes(role)) ? rolesArray : false
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validatePhoneNo,
  validateUsername,
  validateGender,
  validateRoles
}

// Current Approach
//   Return false if input doesnt satisfy regex
//   Return value if input satisfies regex
