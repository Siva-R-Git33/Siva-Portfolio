import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';
import { skillsAPI } from '../utils/api';

const defaultCategories = ['Programming', 'Operating Systems', 'Cybersecurity Tools', 'Security Knowledge'];

export default function ManageSkills() {
    const [skills, setSkills] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [customCategory, setCustomCategory] = useState('');
    const [form, setForm] = useState({ name: '', category: defaultCategories[0] });

    const load = () => skillsAPI.getAll().then((res) => setSkills(res.data)).catch(() => { });

    useEffect(() => { load(); }, []);

    const openNew = () => {
        setEditing(null);
        setCustomCategory('');
        setForm({ name: '', category: defaultCategories[0] });
        setShowModal(true);
    };

    const openEdit = (s) => {
        setEditing(s);
        const isCustom = !defaultCategories.includes(s.category);
        setCustomCategory(isCustom ? s.category : '');
        setForm({ name: s.name, category: isCustom ? '+ Custom...' : s.category });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalCategory = form.category === '+ Custom...' ? customCategory.trim() : form.category;
        if (!finalCategory) return alert('Please enter a custom category name.');
        const data = { ...form, category: finalCategory };
        try {
            if (editing) {
                await skillsAPI.update(editing.id, data);
            } else {
                await skillsAPI.create(data);
            }
            setShowModal(false);
            load();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving skill');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this skill?')) return;
        await skillsAPI.delete(id);
        load();
    };

    // All unique categories (defaults + any from DB)
    const allCategories = [
        ...defaultCategories,
        ...Object.keys(
            skills.reduce((acc, s) => { acc[s.category] = true; return acc; }, {})
        ).filter((c) => !defaultCategories.includes(c)),
        '+ Custom...',
    ];

    // Group by category
    const grouped = {};
    skills.forEach((s) => {
        if (!grouped[s.category]) grouped[s.category] = [];
        grouped[s.category].push(s);
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Skills</h1>
                <button onClick={openNew} className="cyber-btn-solid text-sm flex items-center gap-2">
                    <FaPlus /> Add Skill
                </button>
            </div>

            <div className="space-y-6">
                {Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-neon-green font-mono text-sm mb-2">{category}</h3>
                        <div className="flex flex-wrap gap-2">
                            {items.map((s) => (
                                <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyber-gray border border-cyber-border group">
                                    <span className="text-gray-200 text-sm">{s.name}</span>
                                    <button onClick={() => openEdit(s)} className="text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(s.id)} className="text-neon-red opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {skills.length === 0 && (
                    <p className="text-gray-500 text-center py-8 font-mono text-sm">No skills yet. Run the seed script or add them here.</p>
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
                            className="glass rounded-xl p-6 w-full max-w-md"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Name</label>
                                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm"
                                    >
                                        {allCategories.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    {form.category === '+ Custom...' && (
                                        <input
                                            type="text"
                                            required
                                            placeholder="Type new category name..."
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            className="w-full mt-2 bg-cyber-gray border border-neon-green/50 rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm"
                                        />
                                    )}
                                </div>
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
