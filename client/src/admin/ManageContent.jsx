import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaPlus, FaTrash, FaUpload, FaFilePdf, FaCheckCircle, FaExclamationTriangle, FaImage, FaSpinner } from 'react-icons/fa';
import { settingsAPI, storageAPI } from '../utils/api';

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
    showEmail: true,
    phone: '+91 9150782041',
    showPhone: true,
    location: 'Tenkasi, Tamil Nadu, India',
    showLocation: true,
    github: 'https://github.com/Siva-R-Git33',
    linkedin: 'https://www.linkedin.com/in/sivarr31',
    tryhackme: 'https://tryhackme.com/p/rsshiva403'
};

export default function ManageContent() {
    const [hero, setHero] = useState(defaultHero);
    const [about, setAbout] = useState(defaultAbout);
    const [socials, setSocials] = useState(defaultSocials);
    const [heroProfile, setHeroProfile] = useState({ enabled: false, url: '', position: 'left' });
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [seo, setSeo] = useState({
        title: 'Siva R | Cybersecurity Portfolio',
        description: 'Aspiring Ethical Hacker and Blue Team professional focused on vulnerability assessment and threat detection.',
        keywords: 'cybersecurity, ethical hacking, blue team, penetration testing, CTF, portfolio, security analyst',
        ogImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=hacker'
    });

    const [resumeVersions, setResumeVersions] = useState([]);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [showBlog, setShowBlog] = useState(true);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [hRes, aRes, sRes, bRes, rRes, hpRes, seoRes] = await Promise.all([
                settingsAPI.get('hero_content'),
                settingsAPI.get('about_content'),
                settingsAPI.get('social_links'),
                settingsAPI.get('showBlogSection'),
                settingsAPI.get('resumeVersions'),
                settingsAPI.get('hero_profile'),
                settingsAPI.get('seo_settings')
            ]);
            if (hRes.data) setHero(hRes.data);
            if (aRes.data) setAbout(aRes.data);
            if (sRes.data) setSocials(sRes.data);
            if (bRes.data !== null) setShowBlog(bRes.data);
            if (rRes.data) setResumeVersions(rRes.data);
            if (hpRes.data) setHeroProfile(hpRes.data);
            if (seoRes.data) setSeo(seoRes.data);
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

    const toggleBlog = async () => {
        const next = !showBlog;
        setShowBlog(next);
        await settingsAPI.set('showBlogSection', next);
    };

    const toggleHeroProfile = async () => {
        const next = { ...heroProfile, enabled: !heroProfile.enabled };
        setHeroProfile(next);
        await settingsAPI.set('hero_profile', next);
    };

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be under 2MB.');
            return;
        }

        setUploadingProfile(true);
        try {
            const filename = `profile_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const path = `profile/${filename}`;

            await storageAPI.uploadFile('uploads', path, file);
            const { data: url } = storageAPI.getPublicUrl('uploads', path);

            const next = { ...heroProfile, url };
            setHeroProfile(next);
            await settingsAPI.set('hero_profile', next);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload profile picture.');
        } finally {
            setUploadingProfile(false);
            e.target.value = '';
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadError('');
        if (file.type !== 'application/pdf') {
            setUploadError('Only PDF files are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File exceeds 5MB limit.');
            return;
        }
        if (resumeVersions.length >= 5) {
            setUploadError('Maximum 5 versions reached. Please delete an older resume first.');
            return;
        }

        setUploadingResume(true);
        try {
            // Generate unique filename to avoid caching issues
            const filename = `resume_${Date.now()}.pdf`;
            const path = `resumes/${filename}`;

            // Upload to Supabase Storage
            await storageAPI.uploadFile('uploads', path, file);

            // Get public URL
            const { data: url } = storageAPI.getPublicUrl('uploads', path);

            // Create new version record
            const newVersion = {
                id: Date.now().toString(),
                filename: file.name,
                url,
                storagePath: path,
                uploadedAt: new Date().toISOString(),
                active: resumeVersions.length === 0 // Make active if it's the first one
            };

            const updatedVersions = [newVersion, ...resumeVersions];
            setResumeVersions(updatedVersions);
            await settingsAPI.set('resumeVersions', updatedVersions);

            e.target.value = ''; // Reset input
        } catch (err) {
            console.error('Upload failed:', err);
            setUploadError('Failed to upload file. Check storage permissions.');
        } finally {
            setUploadingResume(false);
        }
    };

    const setActiveResume = async (id) => {
        const updated = resumeVersions.map(v => ({ ...v, active: v.id === id }));
        setResumeVersions(updated);
        await settingsAPI.set('resumeVersions', updated);
    };

    const deleteResumeVersion = async (id, path) => {
        if (!window.confirm('Are you sure you want to delete this resume?')) return;

        try {
            await storageAPI.deleteFile('uploads', path); // Delete from bucket
            const updated = resumeVersions.filter(v => v.id !== id);

            // If we deleted the active one, make the newest remaining one active
            if (resumeVersions.find(v => v.id === id)?.active && updated.length > 0) {
                updated[0].active = true;
            }

            setResumeVersions(updated);
            await settingsAPI.set('resumeVersions', updated);
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete file from storage.');
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-10 pb-20">
            <h1 className="text-2xl font-bold text-white mb-6">Site Content Manager</h1>

            {/* v2: Blog Section Toggle */}
            <div className="cyber-card">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-neon-green">Blog Section</h2>
                        <p className="text-gray-400 text-sm mt-1">Show or hide the Blog &amp; CTF Writeups section on your portfolio.</p>
                    </div>
                    <button
                        onClick={toggleBlog}
                        className={`relative inline-flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${showBlog ? 'bg-neon-green' : 'bg-cyber-gray border border-cyber-border'}`}
                    >
                        <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${showBlog ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                </div>
                <p className="text-xs mt-3 font-mono text-gray-500">
                    Status: <span className={showBlog ? 'text-neon-green' : 'text-gray-400'}>{showBlog ? '● Visible' : '○ Hidden'}</span>
                </p>
            </div>

            {/* Resume File Manager */}
            <div className="cyber-card">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#ffdd00]">Resume Manager</h2>
                        <p className="text-gray-400 text-sm mt-1">Upload PDF resumes (max 5 versions, 5MB limit). Set the active version for the public Hero section.</p>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="flex items-center justify-center w-full max-w-md h-24 border-2 border-dashed border-cyber-border rounded-lg cursor-pointer bg-cyber-dark hover:bg-cyber-dark/80 hover:border-[#ffdd00] transition-colors relative">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaUpload className="text-gray-400 mb-2" />
                            <p className="text-sm text-gray-400"><span className="font-semibold text-[#ffdd00]">Click to upload</span> (PDF max 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept="application/pdf" onChange={handleResumeUpload} disabled={uploadingResume || resumeVersions.length >= 5} />
                        {uploadingResume && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                                <span className="text-[#ffdd00] text-sm animate-pulse font-mono">Uploading to Supabase...</span>
                            </div>
                        )}
                    </label>
                    {uploadError && (
                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><FaExclamationTriangle /> {uploadError}</p>
                    )}
                    {resumeVersions.length >= 5 && (
                        <p className="text-[#ff8800] text-xs mt-2 flex items-center gap-1"><FaExclamationTriangle /> Max capacity reached. Delete an older version to upload a new one.</p>
                    )}
                </div>

                {resumeVersions.length > 0 && (
                    <div className="bg-cyber-black border border-cyber-border rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#111] text-xs uppercase text-gray-500 font-mono">
                                <tr>
                                    <th className="px-4 py-3">Filename</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resumeVersions.map((v) => (
                                    <tr key={v.id} className="border-t border-cyber-border hover:bg-cyber-dark/50">
                                        <td className="px-4 py-3">
                                            <a href={v.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white hover:text-[#ffdd00]">
                                                <FaFilePdf className="text-red-500" />
                                                <span className="truncate max-w-[150px] inline-block">{v.filename}</span>
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-xs">{new Date(v.uploadedAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            {v.active ? (
                                                <span className="text-neon-green text-xs flex items-center gap-1 bg-neon-green/10 px-2 py-1 rounded w-fit"><FaCheckCircle /> Active</span>
                                            ) : (
                                                <button onClick={() => setActiveResume(v.id)} className="text-xs border border-cyber-gray px-2 py-1 rounded hover:text-white hover:border-white transition-colors">Set Active</button>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => deleteResumeVersion(v.id, v.storagePath)} className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Contact & Social Links Form */}
            <div className="cyber-card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neon-blue">Contact & Social Links</h2>
                    <button onClick={() => saveSettings('social_links', socials)} className="cyber-btn-solid text-xs flex items-center gap-2">
                        <FaSave /> Save Info
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Primary Contact Info with Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cyber-black p-4 rounded-lg border border-cyber-border">
                        {/* Email */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-gray-400 text-sm font-mono uppercase">Email</label>
                                <button onClick={() => setSocials({ ...socials, showEmail: !socials.showEmail })} className={`text-xs px-2 py-0.5 rounded border ${socials.showEmail !== false ? 'bg-neon-green/10 border-neon-green text-neon-green' : 'bg-cyber-gray border-cyber-gray text-gray-500'}`}>
                                    {socials.showEmail !== false ? 'Visible' : 'Hidden'}
                                </button>
                            </div>
                            <input type="text" value={socials.email || ''} onChange={(e) => setSocials({ ...socials, email: e.target.value })}
                                className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm" />
                        </div>
                        {/* Phone */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-gray-400 text-sm font-mono uppercase">Phone</label>
                                <button onClick={() => setSocials({ ...socials, showPhone: !socials.showPhone })} className={`text-xs px-2 py-0.5 rounded border ${socials.showPhone !== false ? 'bg-neon-green/10 border-neon-green text-neon-green' : 'bg-cyber-gray border-cyber-gray text-gray-500'}`}>
                                    {socials.showPhone !== false ? 'Visible' : 'Hidden'}
                                </button>
                            </div>
                            <input type="text" value={socials.phone || ''} onChange={(e) => setSocials({ ...socials, phone: e.target.value })}
                                className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm" />
                        </div>
                        {/* Location */}
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-gray-400 text-sm font-mono uppercase">Location</label>
                                <button onClick={() => setSocials({ ...socials, showLocation: !socials.showLocation })} className={`text-xs px-2 py-0.5 rounded border ${socials.showLocation !== false ? 'bg-neon-green/10 border-neon-green text-neon-green' : 'bg-cyber-gray border-cyber-gray text-gray-500'}`}>
                                    {socials.showLocation !== false ? 'Visible' : 'Hidden'}
                                </button>
                            </div>
                            <input type="text" value={socials.location || ''} onChange={(e) => setSocials({ ...socials, location: e.target.value })}
                                className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm" />
                        </div>
                    </div>

                    {/* Social URLs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['github', 'linkedin', 'tryhackme'].map((k) => (
                            <div key={k}>
                                <label className="block text-gray-400 text-sm mb-1 font-mono uppercase">{k}</label>
                                <input type="text" value={socials[k] || ''} onChange={(e) => setSocials({ ...socials, [k]: e.target.value })}
                                    className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm" />
                            </div>
                        ))}
                    </div>
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

            {/* Hero Profile Picture Toggle & Settings */}
            <div className="cyber-card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neon-blue">Hero Profile Picture</h2>
                    <button onClick={() => saveSettings('hero_profile', heroProfile)} className="cyber-btn-solid text-xs flex items-center gap-2">
                        <FaSave /> Save Profile Settings
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Enable Toggle */}
                    <div className="flex justify-between items-center bg-cyber-dark p-4 rounded-lg border border-cyber-border">
                        <div>
                            <p className="text-white font-semibold">Show Profile Picture</p>
                            <p className="text-gray-400 text-sm mt-1">If enabled, the Hero section will split into two columns with your image on one side.</p>
                        </div>
                        <button
                            onClick={toggleHeroProfile}
                            className={`relative inline-flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${heroProfile.enabled ? 'bg-neon-green' : 'bg-cyber-gray border border-cyber-border'}`}
                        >
                            <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${heroProfile.enabled ? 'translate-x-8' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {heroProfile.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cyber-black p-4 rounded-lg border border-cyber-border">
                            {/* Position Selector */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2 font-mono">Image Position</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setHeroProfile({ ...heroProfile, position: 'left' })}
                                        className={`flex-1 py-2 px-4 rounded-lg transition-colors border font-mono text-sm ${heroProfile.position === 'left' ? 'bg-neon-green/20 border-neon-green text-neon-green' : 'bg-cyber-dark border-cyber-gray text-gray-400 hover:text-white'}`}
                                    >
                                        [ Image | Text ] (Left)
                                    </button>
                                    <button
                                        onClick={() => setHeroProfile({ ...heroProfile, position: 'right' })}
                                        className={`flex-1 py-2 px-4 rounded-lg transition-colors border font-mono text-sm ${heroProfile.position === 'right' ? 'bg-neon-green/20 border-neon-green text-neon-green' : 'bg-cyber-dark border-cyber-gray text-gray-400 hover:text-white'}`}
                                    >
                                        [ Text | Image ] (Right)
                                    </button>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-2 font-mono">Image URL or Upload</label>
                                <div className="flex gap-2 mb-2">
                                    <input type="text" value={heroProfile.url} onChange={(e) => setHeroProfile({ ...heroProfile, url: e.target.value })}
                                        className="flex-1 bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm"
                                        placeholder="https://..." />
                                    <label className="flex items-center justify-center bg-cyber-dark border border-cyber-border rounded-lg px-4 cursor-pointer hover:border-neon-green transition-colors disabled:opacity-50 h-[38px]">
                                        {uploadingProfile ? <FaSpinner className="animate-spin text-neon-green" /> : <FaUpload className="text-gray-400" />}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} disabled={uploadingProfile} />
                                    </label>
                                </div>
                                {heroProfile.url && (
                                    <div className="mt-2 text-center">
                                        <div className="w-24 h-24 rounded-full border-2 border-neon-green mx-auto overflow-hidden bg-cyber-dark">
                                            <img src={heroProfile.url} alt="Profile Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 font-mono">Current Preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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

            {/* SEO Settings Form */}
            <div className="cyber-card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#ff8800]">Global SEO Settings</h2>
                    <button onClick={() => saveSettings('seo_settings', seo)} className="cyber-btn-solid text-xs flex items-center gap-2">
                        <FaSave /> Save SEO
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-mono">Site Title Tag</label>
                        <input type="text" value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                            className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm focus:border-[#ff8800] outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-mono">Meta Description</label>
                        <textarea rows={3} value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                            className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm resize-none focus:border-[#ff8800] outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-mono">Meta Keywords (Comma-separated)</label>
                        <input type="text" value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                            className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm focus:border-[#ff8800] outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-mono">OpenGraph Image URL (For link previews)</label>
                        <input type="text" value={seo.ogImage} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                            className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-white text-sm focus:border-[#ff8800] outline-none" />
                    </div>
                </div>
            </div>

        </div>
    );
}
