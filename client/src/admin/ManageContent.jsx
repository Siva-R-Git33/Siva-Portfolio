import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { settingsAPI } from '../utils/api';

const defaultHero = {
    name: 'Siva R',
    titles: ['Cybersecurity Enthusiast', 'Ethical Hacker', 'Blue Team Defender', 'CTF Player'],
    description: 'I specialize in identifying vulnerabilities, securing networks, and analyzing threats to build resilient digital environments. Always learning, always building.',
    resumeUrl: '/Siva R-Resume.pdf'
};

const defaultAbout = {
    objective: 'Aspiring Ethical Hacker and Blue Team professional focused on vulnerability assessment, threat detection, and responsible cybersecurity practices. Seeking an entry-level opportunity to grow in offensive and defensive security domains.',
    location: 'Tenkasi, Tamil Nadu, India',
    education: [
        { degree: 'MSc Cyber Security', school: 'Bharathiar University', year: '2025 – Present', score: '' },
        { degree: 'BSc Computer Science (Cognitive Systems)', school: 'Karpagam Academy of Higher Education', year: '2021 – 2024', score: '88.30%' },
        { degree: 'HSC', school: 'Nadar Committee Higher Secondary School', year: '2021', score: '85.54%' },
        { degree: 'SSLC', school: 'Nadar Committee Higher Secondary School', year: '2019', score: '79.20%' },
    ],
    hobbies: ['Playing Cricket', 'Exercise', 'Listening Music', 'Traveling'],
    platforms: [
        { name: 'TryHackMe', tag: 'Primary', link: 'https://tryhackme.com/p/rsshiva403' },
        { name: 'Hack The Box', tag: 'HTB', link: '' },
        { name: 'Blue Team Labs Online', tag: 'BTLO', link: '' },
    ]
};

const defaultSocials = {
    email: 'shivar6277@gmail.com',
    phone: '+91 9150782041',
    github: 'https://github.com/Siva-R-Git33',
    linkedin: 'https://www.linkedin.com/in/sivarr31',
    tryhackme: 'https://tryhackme.com/p/rsshiva403'
};

export default function ManageContent() {
    const [hero, setHero] = useState(defaultHero);
    const [about, setAbout] = useState(defaultAbout);
    const [socials, setSocials] = useState(defaultSocials);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [hRes, aRes, sRes] = await Promise.all([
                settingsAPI.get('hero_content'),
                settingsAPI.get('about_content'),
                settingsAPI.get('social_links')
            ]);
            if (hRes.data) setHero(hRes.data);
            if (aRes.data) setAbout(aRes.data);
            if (sRes.data) setSocials(sRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const saveSettings = async (key, val) => {
        try {
            await settingsAPI.set(key, val);
            alert(`${key} saved successfully!`);
        } catch (err) {
            alert(`Failed to save ${key}`);
            console.error(err);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-10 pb-20">
            <h1 className="text-2xl font-bold text-white mb-6">Site Content Manager</h1>

            {/* Social Links Form */}
            <div className="cyber-card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neon-blue">Social Links</h2>
                    <button onClick={() => saveSettings('social_links', socials)} className="cyber-btn-solid text-xs flex items-center gap-2">
                        <FaSave /> Save Socials
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(socials).map((k) => (
                        <div key={k}>
                            <label className="block text-gray-400 text-sm mb-1 font-mono uppercase">{k}</label>
                            <input type="text" value={socials[k]} onChange={(e) => setSocials({ ...socials, [k]: e.target.value })}
                                className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Section Form */}
            <div className="cyber-card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neon-green">Hero Section</h2>
                    <button onClick={() => saveSettings('hero_content', hero)} className="cyber-btn-solid text-xs flex items-center gap-2">
                        <FaSave /> Save Hero
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1 font-mono">My Name</label>
                            <input type="text" value={hero.name} onChange={(e) => setHero({ ...hero, name: e.target.value })}
                                className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1 font-mono">Resume / CV URL</label>
                            <input type="text" value={hero.resumeUrl} onChange={(e) => setHero({ ...hero, resumeUrl: e.target.value })}
                                className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-mono">Typing Animation Titles (Comma-separated)</label>
                        <input type="text" value={hero.titles.join(', ')} onChange={(e) => setHero({ ...hero, titles: e.target.value.split(',').map(s => s.trim()) })}
                            className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-mono">Bio Description</label>
                        <textarea rows={3} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })}
                            className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm resize-none" />
                    </div>
                </div>
            </div>

            {/* About Section Form */}
            <div className="cyber-card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neon-purple">About Section</h2>
                    <button onClick={() => saveSettings('about_content', about)} className="cyber-btn-solid text-xs flex items-center gap-2">
                        <FaSave /> Save About
                    </button>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-mono">Career Objective</label>
                        <textarea rows={4} value={about.objective} onChange={(e) => setAbout({ ...about, objective: e.target.value })}
                            className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm resize-none" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-mono">Location</label>
                        <input type="text" value={about.location} onChange={(e) => setAbout({ ...about, location: e.target.value })}
                            className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm" />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-400 text-sm font-mono">Education Timeline</label>
                            <button onClick={() => setAbout({ ...about, education: [{ degree: '', school: '', year: '', score: '' }, ...about.education] })} className="text-xs text-neon-green hover:underline">
                                + Add Row
                            </button>
                        </div>
                        <div className="space-y-2">
                            {about.education.map((edu, idx) => (
                                <div key={idx} className="flex gap-2 items-start bg-cyber-black p-2 rounded border border-cyber-border">
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <input type="text" placeholder="Degree/Cert" value={edu.degree} onChange={(e) => { const ne = [...about.education]; ne[idx].degree = e.target.value; setAbout({ ...about, education: ne }); }} className="bg-cyber-dark border border-cyber-gray rounded p-1 text-xs text-white" />
                                        <input type="text" placeholder="School/Institution" value={edu.school} onChange={(e) => { const ne = [...about.education]; ne[idx].school = e.target.value; setAbout({ ...about, education: ne }); }} className="bg-cyber-dark border border-cyber-gray rounded p-1 text-xs text-white" />
                                        <input type="text" placeholder="Year" value={edu.year} onChange={(e) => { const ne = [...about.education]; ne[idx].year = e.target.value; setAbout({ ...about, education: ne }); }} className="bg-cyber-dark border border-cyber-gray rounded p-1 text-xs text-white" />
                                        <input type="text" placeholder="Score/Grade" value={edu.score} onChange={(e) => { const ne = [...about.education]; ne[idx].score = e.target.value; setAbout({ ...about, education: ne }); }} className="bg-cyber-dark border border-cyber-gray rounded p-1 text-xs text-white" />
                                    </div>
                                    <button onClick={() => { const ne = about.education.filter((_, i) => i !== idx); setAbout({ ...about, education: ne }); }} className="p-2 text-red-500 hover:bg-neon-red/10 rounded">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-mono">Hobbies (Comma-separated)</label>
                        <input type="text" value={about.hobbies.join(', ')} onChange={(e) => setAbout({ ...about, hobbies: e.target.value.split(',').map(s => s.trim()) })}
                            className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm" />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-400 text-sm font-mono">Hands-on Platforms</label>
                            <button onClick={() => setAbout({ ...about, platforms: [...about.platforms, { name: '', tag: '', link: '' }] })} className="text-xs text-neon-green hover:underline">
                                + Add Platform
                            </button>
                        </div>
                        <div className="space-y-2">
                            {about.platforms.map((plat, idx) => (
                                <div key={idx} className="flex gap-2 items-start bg-cyber-black p-2 rounded border border-cyber-border">
                                    <div className="flex-1 grid grid-cols-3 gap-2">
                                        <input type="text" placeholder="Name" value={plat.name} onChange={(e) => { const np = [...about.platforms]; np[idx].name = e.target.value; setAbout({ ...about, platforms: np }); }} className="bg-cyber-dark border border-cyber-gray rounded p-1 text-xs text-white" />
                                        <input type="text" placeholder="Tag (e.g. HTB)" value={plat.tag} onChange={(e) => { const np = [...about.platforms]; np[idx].tag = e.target.value; setAbout({ ...about, platforms: np }); }} className="bg-cyber-dark border border-cyber-gray rounded p-1 text-xs text-white" />
                                        <input type="text" placeholder="Profile URL" value={plat.link} onChange={(e) => { const np = [...about.platforms]; np[idx].link = e.target.value; setAbout({ ...about, platforms: np }); }} className="bg-cyber-dark border border-cyber-gray rounded p-1 text-xs text-white" />
                                    </div>
                                    <button onClick={() => { const np = about.platforms.filter((_, i) => i !== idx); setAbout({ ...about, platforms: np }); }} className="p-2 text-red-500 hover:bg-neon-red/10 rounded">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
