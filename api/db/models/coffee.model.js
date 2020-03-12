const mongoose = require('mongoose');

const CoffeeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _roasterId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const Coffee = mongoose.model('Coffee', CoffeeSchema);

module.exports = { Coffee }