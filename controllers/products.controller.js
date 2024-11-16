const asyncHandler = require("../utils/asyncHandler");

const addAProduct = asyncHandler(async (req, res) => {
  console.log(req.user);
  console.log(req.validFields);

  res.sendStatus(200);
});

module.exports = {
  addAProduct,
};
