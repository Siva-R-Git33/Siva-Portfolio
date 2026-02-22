import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaCertificate } from 'react-icons/fa';
import { certificationsAPI } from '../utils/api';

export default function ManageCertifications() {
    const [certifications, setCertifications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', issuer: '', color: 'neon-blue' });

    const load = () => certificationsAPI.getAll().then((res) => setCertifications(res.data)).catch(() => { });

    useEffect(() => { load(); }, []);

    const openNew = () => {
        setEditing(null);
        setForm({ name: '', issuer: '', color: 'neon-blue' });
        setShowModal(true);
    };

    const openEdit = (c) => {
        setEditing(c);
        setForm({ name: c.name, issuer: c.issuer, color: c.color });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await certificationsAPI.update(editing.id, form);
            } else {
                await certificationsAPI.create(form);
            }
            setShowModal(false);
            load();
        } catch (err) {
            alert(err.message || 'Error saving certification');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this certification?')) return;
        await certificationsAPI.delete(id);
        load();
    };

    const colorOptions = ['neon-green', 'neon-blue', 'neon-purple', 'neon-red'];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Certifications</h1>
                <button onClick={openNew} className="cyber-btn-solid text-sm flex items-center gap-2">
                    <FaPlus /> Add Certification
                </button>
            </div>

            <div className="space-y-3">
                {certifications.map((c) => (
                    <div key={c.id} className="cyber-card flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-${c.color}/10 text-${c.color}`}>
                                <FaCertificate className="text-lg" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">{c.name}</h3>
                                <p className="text-gray-500 text-sm font-mono">{c.issuer}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0 ml-4">
                            <button onClick={() => openEdit(c)} className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-all">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red/20 transition-all">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
                {certifications.length === 0 && (
                    <p className="text-gray-500 text-center py-8 font-mono text-sm">No certifications yet. Add your first one.</p>
                )}
            </div>

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
                                <h2 className="text-lg font-bold text-white">{editing ? 'Edit Certification' : 'New Certification'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Certification Name</label>
                                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Issuer (e.g., Cisco, CompTIA)</label>
                                    <input type="text" required value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2 font-mono">Theme Color</label>
                                    <div className="flex gap-3">
                                        {colorOptions.map(color => (
                                            <button
                                                key={color} type="button"
                                                onClick={() => setForm({ ...form, color })}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === color ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'} bg-${color.replace('neon-', '')}-500`}
                                                style={{ backgroundColor: `var(--${color})` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="w-full cyber-btn-solid flex items-center justify-center gap-2 mt-6">
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
