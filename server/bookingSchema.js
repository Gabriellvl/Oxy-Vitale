const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    time: {
        date: {
            type: String,
            required: true
        },
        timestamp: {
            type: String,
            required: true
        }
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    contact: {
        email: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        }
    },
    comment: {
        type: String,
        default: ''
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    }
});

bookingSchema.index({ room: 1, 'time.date': 1, 'time.timestamp': 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
