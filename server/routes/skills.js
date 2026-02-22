const express = require('express');
const Skill = require('../models/Skill');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/skills - Public
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().sort({ category: 1, name: 1 });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/skills - Admin
router.post('/', authMiddleware, async (req, res) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/skills/:id - Admin
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!skill) return res.status(404).json({ message: 'Skill not found.' });
        res.json(skill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/skills/:id - Admin
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) return res.status(404).json({ message: 'Skill not found.' });
        res.json({ message: 'Skill deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
