const express = require('express');
const router = express.Router();

const Room = require('./roomSchema');

// Get all rooms
router.get('/', async (req, res) => {
    const rooms = await Room.find();
    res.json(rooms);
});

// Get a single room by ID
router.get('/:id', async (req, res) => {
    const room = await Room.findById(req.params.id);
    res.json(room);
});

// Add a new room
router.post('/', async (req, res) => {
    const room = new Room(req.body);
    try {
        await room.save();
        res.json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Edit a room description
router.put('/:id', async (req, res) => {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
});

// Delete a booking
router.delete('/:id', async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: 'Room deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
