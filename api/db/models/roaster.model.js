const mongoose = require('mongoose');

const RoasterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Roaster = mongoose.model('Roaster', RoasterSchema);

module.exports = { Roaster }