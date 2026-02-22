import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaGithub } from 'react-icons/fa';
import { projectsAPI, settingsAPI } from '../utils/api';

export default function ManageProjects() {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showGithubRepos, setShowGithubRepos] = useState(true);
    const [form, setForm] = useState({
        title: '', description: '', techStack: '', githubLink: '', liveLink: '', featured: false,
    });

    const load = async () => {
        try {
            const [projRes, settingsRes] = await Promise.all([
                projectsAPI.getAll(),
                settingsAPI.get('showGitHubRepos')
            ]);
            setProjects(projRes.data || []);
            setShowGithubRepos(settingsRes.data !== false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { load(); }, []);

    const toggleGithubRepos = async () => {
        const newValue = !showGithubRepos;
        setShowGithubRepos(newValue);
        try {
            await settingsAPI.set('showGitHubRepos', newValue);
        } catch (err) {
            alert('Failed to update setting');
            setShowGithubRepos(!newValue); // revert on fail
        }
    };

    const openNew = () => {
        setEditing(null);
        setForm({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', featured: false });
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setForm({
            title: p.title, description: p.description,
            techStack: p.techStack?.join(', ') || '',
            githubLink: p.githubLink || '', liveLink: p.liveLink || '',
            featured: p.featured || false,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form, techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean) };
        try {
            if (editing) {
                await projectsAPI.update(editing.id, data);
            } else {
                await projectsAPI.create(data);
            }
            setShowModal(false);
            load();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving project');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return;
        await projectsAPI.delete(id);
        load();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-bold text-white">Projects</h1>
                    <label className="flex items-center gap-2 cursor-pointer bg-cyber-dark px-3 py-1.5 rounded-lg border border-cyber-border">
                        <FaGithub className="text-gray-400" />
                        <span className="text-sm text-gray-300 font-mono hidden sm:inline">Show GitHub Repos</span>
                        <div className="relative inline-flex items-center">
                            <input type="checkbox" className="sr-only peer" checked={showGithubRepos} onChange={toggleGithubRepos} />
                            <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-green"></div>
                        </div>
                    </label>
                </div>
                <button onClick={openNew} className="cyber-btn-solid text-sm flex items-center gap-2">
                    <FaPlus /> Add Project
                </button>
            </div>

            <div className="space-y-3">
                {projects.map((p) => (
                    <div key={p.id} className="cyber-card flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-semibold">{p.title}</h3>
                            <p className="text-gray-500 text-sm truncate max-w-lg">{p.description}</p>
                            <div className="flex gap-2 mt-1">
                                {p.techStack?.map((t) => (
                                    <span key={t} className="text-xs font-mono px-2 py-0.5 rounded bg-neon-green/10 text-neon-green">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0 ml-4">
                            <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-all">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red/20 transition-all">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <p className="text-gray-500 text-center py-8 font-mono text-sm">No projects yet. Add your first project.</p>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="glass rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">{editing ? 'Edit Project' : 'New Project'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Description</label>
                                    <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm resize-none" />
                                </div>
                                <Input label="Tech Stack (comma-separated)" value={form.techStack} onChange={(v) => setForm({ ...form, techStack: v })} />
                                <Input label="GitHub Link" value={form.githubLink} onChange={(v) => setForm({ ...form, githubLink: v })} />
                                <Input label="Live Link" value={form.liveLink} onChange={(v) => setForm({ ...form, liveLink: v })} />
                                <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                        className="accent-neon-green" />
                                    Featured project
                                </label>
                                <button type="submit" className="w-full cyber-btn-solid flex items-center justify-center gap-2">
                                    <FaSave /> {editing ? 'Update' : 'Create'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Input({ label, value, onChange, required }) {
    return (
        <div>
            <label className="block text-gray-400 text-sm mb-1 font-mono">{label}</label>
            <input type="text" required={required} value={value} onChange={(e) => onChange(e.target.value)}
                className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm" />
        </div>
    );
}
