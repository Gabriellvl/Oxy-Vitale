const express = require('express');
const router = express.Router();

const Client = require("./clientModel");

router.get('/', async (req, res) => {
    const clients = await Client.find();
    res.json(clients);
});

router.get('/:id', async (req, res) => {
    const client = await Client.findById(req.params.id);
    res.json(client);
});

router.post('/', async (req, res) => {
    const client = new Client(req.body);
    try {
        await client.save();
        res.json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Edit an article
router.put('/:id', async (req, res) => {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(client);
});

// Delete an article
router.delete('/:id', async (req, res) => {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted' });
});

module.exports = router;
