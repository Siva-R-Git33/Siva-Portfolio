require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Skill = require('./models/Skill');
const Project = require('./models/Project');

const seedData = async () => {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});

    // Create admin user
    await User.create({
        username: 'admin',
        password: 'admin123',
    });
    console.log('✅ Admin user created (admin / admin123)');

    // Seed Skills
    const skills = [
        { name: 'Python', category: 'Programming' },
        { name: 'SQL', category: 'Programming' },
        { name: 'Bash', category: 'Programming' },
        { name: 'MATLAB', category: 'Programming' },
        { name: 'Windows', category: 'Operating Systems' },
        { name: 'Linux', category: 'Operating Systems' },
        { name: 'Kali Linux', category: 'Cybersecurity Tools' },
        { name: 'Nmap', category: 'Cybersecurity Tools' },
        { name: 'Metasploit', category: 'Cybersecurity Tools' },
        { name: 'Networking', category: 'Security Knowledge' },
        { name: 'Malware Analysis', category: 'Security Knowledge' },
        { name: 'Log Analysis', category: 'Security Knowledge' },
        { name: 'Wazuh (SIEM)', category: 'Security Knowledge' },
    ];
    await Skill.insertMany(skills);
    console.log('✅ Skills seeded');

    // Seed Featured Project
    await Project.create({
        title: 'Offline Signature Verification System',
        description: 'Built a CNN-based handwritten signature verification system in MATLAB to detect genuine and forged signatures using image processing and classification techniques.',
        techStack: ['MATLAB', 'CNN', 'Image Processing', 'Classification'],
        featured: true,
    });
    console.log('✅ Featured project seeded');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
};

seedData().catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
});
