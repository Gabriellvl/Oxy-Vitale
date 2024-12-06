const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    description: {
        type: String,
        default: "none"
    }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
