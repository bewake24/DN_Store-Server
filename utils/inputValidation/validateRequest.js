const validateInput = require("./validateInput");

const validateRequest = (inputObject, inputType) => {
  let validFields = {};
  let invalidFields = [];

  for (const field in inputObject) {
    if (inputObject.hasOwnProperty(field)) {
      const value = validateInput(inputObject[field], inputType[field]);

      if (!value) {
        invalidFields.push(inputType[field]);
      } else {
        validFields[field] = value;
      }
    }
  }

  return { validFields, invalidFields };
};

module.exports = validateRequest;
