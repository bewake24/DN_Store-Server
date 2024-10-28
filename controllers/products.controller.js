const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/*
    Product CRUD algo:
        1. Check if user logged in.
        2. CHeck if user is admin.
        3. Add admin id to cratedBy field.
*/

const addAProduct = asyncHandler(async (req, res) => {
    console.log(req.user)
    console.log(req.validFields)

    res.sendStatus(200)
    // const product = await Product.create(req.validFields);
    // res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
})


module.exports = {
    addAProduct
}