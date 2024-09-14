const ApiError = require("../utils/ApiError");
const inputs = require("../utils/inputValidation/inputs");
const validateRequest = require("../utils/inputValidation/validateRequest");

const validateInputs = (req, _, next) => {
  requestBody = JSON.parse(JSON.stringify(req.body));
  const { invalidFields, validFields } = validateRequest(requestBody, inputs);
  if (invalidFields.length) {
    throw new ApiError(400, `Got Invalid fields: ${invalidFields.join(", ")}`);
  }
  req.validFields = validFields;
  next();
};

module.exports = validateInputs;
