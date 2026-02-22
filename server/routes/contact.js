const express = require('express');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/contact - Public
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const contact = new Contact({ name, email, message });
        await contact.save();
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/contact - Admin
router.get('/', authMiddleware, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// PUT /api/contact/:id/read - Admin
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        if (!contact) return res.status(404).json({ message: 'Message not found.' });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE /api/contact/:id - Admin
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Message not found.' });
        res.json({ message: 'Message deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
