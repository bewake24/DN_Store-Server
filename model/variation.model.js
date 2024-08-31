const mongoose = require('mongoose');
const { VARIATION } = require("../constants/models.constants")

const optionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    thumbnail: {
        type: String
    },
    mrp: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        required: true
    },
    stockQuantity: {
        type: Number,
        default: -1
    },
    sku: {
        type: String,
        uppercase: true
    }
})

const variationSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    options:[optionSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

const Variation = mongoose.model(VARIATION, variationSchema)

module.exports = Variation;


// If stockQuantity === -1  => Stock quantity not specified
//If stockQuantity === 0  => Item not in stock and can't be ordered by CUSTOMER