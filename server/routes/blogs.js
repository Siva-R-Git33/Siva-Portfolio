const express = require('express');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/blogs - Public (only published)
router.get('/', async (req, res) => {
    try {
        const { tag } = req.query;
        const filter = { published: true };
        if (tag) filter.tags = tag;

        const blogs = await Blog.find(filter)
            .select('-content')
            .sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/blogs/all - Admin (all posts)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/blogs/:slug - Public
router.get('/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) return res.status(404).json({ message: 'Blog post not found.' });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/blogs - Admin
router.post('/', authMiddleware, async (req, res) => {
    try {
        const blog = new Blog(req.body);
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/blogs/:id - Admin
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!blog) return res.status(404).json({ message: 'Blog post not found.' });
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/blogs/:id - Admin
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog post not found.' });
        res.json({ message: 'Blog post deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
