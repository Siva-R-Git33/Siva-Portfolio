const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ['Programming', 'Operating Systems', 'Cybersecurity Tools', 'Security Knowledge'] },
    icon: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
