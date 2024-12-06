const express = require('express');
const router = express.Router();

const Booking = require('./bookingSchema');

// Get all bookings
router.get('/', async (req, res) => {
    const bookings = await Booking.find().populate('room');
    res.json(bookings);
});

// Get a single booking by ID
router.get('/:id', async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate('room');
    res.json(booking);
});

// Get all bookings for a specific room
router.get('/room/:roomId', async (req, res) => {
    try {
        const bookings = await Booking.find({ room: req.params.roomId }).populate('room');
        res.json(bookings);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching bookings for the room' });
    }
});

// Add a new booking
router.post('/', async (req, res) => {
    const booking = new Booking(req.body);
    try {
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Edit a booking
router.put('/:id', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBooking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
