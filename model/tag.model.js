const mongoose = require('mongoose');
const { TAG } = require('../constants/models.constants');
const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    }
});

const Tag = mongoose.model(TAG, tagSchema);

module.exports = Tag;