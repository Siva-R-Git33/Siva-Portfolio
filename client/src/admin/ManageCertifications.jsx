import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaCertificate, FaUpload, FaFilePdf, FaImage } from 'react-icons/fa';
import { certificationsAPI, storageAPI } from '../utils/api';

export default function ManageCertifications() {
    const [certifications, setCertifications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', issuer: '', color: 'neon-blue', file_url: '' });

    // File Upload State
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);

    const load = () => certificationsAPI.getAll().then((res) => setCertifications(res.data)).catch(() => { });

    useEffect(() => { load(); }, []);

    const openNew = () => {
        setEditing(null);
        setForm({ name: '', issuer: '', color: 'neon-blue', file_url: '' });
        setUploadError('');
        setShowModal(true);
    };

    const openEdit = (c) => {
        setEditing(c);
        setForm({ name: c.name, issuer: c.issuer, color: c.color, file_url: c.file_url || '' });
        setUploadError('');
        setShowModal(true);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type and size (max 2MB)
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setUploadError('Please select a valid image or PDF file.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setUploadError('File size must be less than 2MB.');
            return;
        }

        setUploading(true);
        setUploadError('');

        try {
            const ext = file.name.split('.').pop();
            const fileName = `cert-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
            const path = `certifications/${fileName}`;

            await storageAPI.uploadFile('uploads', path, file);
            const { data: publicUrl } = storageAPI.getPublicUrl('uploads', path);

            // Cleanup old file if editing
            if (form.file_url && form.file_url.includes('supabase.co')) {
                try {
                    const oldUrl = new URL(form.file_url);
                    const oldPathParts = oldUrl.pathname.split('/public/uploads/');
                    if (oldPathParts.length > 1) {
                        const oldStoragePath = oldPathParts[1];
                        await storageAPI.deleteFile('uploads', oldStoragePath);
                    }
                } catch (err) {
                    console.error('Failed to delete old file, continuing...', err);
                }
            }

            setForm({ ...form, file_url: publicUrl });
        } catch (error) {
            console.error('Upload Error:', error);
            setUploadError('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
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

    const handleDelete = async (c) => {
        if (!confirm('Delete this certification?')) return;

        try {
            // Cleanup attached file if it exists
            if (c.file_url && c.file_url.includes('supabase.co')) {
                const url = new URL(c.file_url);
                const pathParts = url.pathname.split('/public/uploads/');
                if (pathParts.length > 1) {
                    await storageAPI.deleteFile('uploads', pathParts[1]).catch(() => { });
                }
            }
            await certificationsAPI.delete(c.id);
            load();
        } catch (error) {
            alert('Failed to delete certification');
        }
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
                            <button onClick={() => handleDelete(c)} className="p-2 rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red/20 transition-all">
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
                                    <div className="flex gap-3 flex-wrap">
                                        {[
                                            { key: 'neon-green', hex: '#00ff41', label: 'Green' },
                                            { key: 'neon-blue', hex: '#00b4d8', label: 'Blue' },
                                            { key: 'neon-purple', hex: '#a855f7', label: 'Purple' },
                                            { key: 'neon-red', hex: '#ff2d55', label: 'Red' },
                                        ].map(({ key, hex, label }) => (
                                            <button
                                                key={key} type="button"
                                                onClick={() => setForm({ ...form, color: key })}
                                                title={label}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    backgroundColor: hex,
                                                    border: form.color === key ? '3px solid white' : '3px solid transparent',
                                                    outline: form.color === key ? `2px solid ${hex}` : 'none',
                                                    transform: form.color === key ? 'scale(1.15)' : 'scale(1)',
                                                    transition: 'all 0.2s',
                                                    cursor: 'pointer',
                                                    boxShadow: form.color === key ? `0 0 10px ${hex}` : 'none',
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-500 font-mono text-xs mt-2">Selected: <span style={{ color: { 'neon-green': '#00ff41', 'neon-blue': '#00b4d8', 'neon-purple': '#a855f7', 'neon-red': '#ff2d55' }[form.color] }}>{form.color}</span></p>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Attachment (Image or PDF, max 2MB)</label>

                                    {/* Preview Box */}
                                    <div className="relative group rounded-lg overflow-hidden border border-cyber-border bg-cyber-gray h-24 flex flex-col items-center justify-center mb-2">
                                        {uploading ? (
                                            <div className="text-neon-blue font-mono text-sm animate-pulse">Uploading...</div>
                                        ) : form.file_url ? (
                                            form.file_url.toLowerCase().endsWith('.pdf') || form.file_url.includes('/pdf') ? (
                                                <div className="text-neon-red flex flex-col items-center gap-2">
                                                    <FaFilePdf className="text-3xl" />
                                                    <span className="text-xs font-mono break-all px-2 text-center text-white">{form.file_url.split('/').pop()}</span>
                                                </div>
                                            ) : (
                                                <img src={form.file_url} alt="Preview" className="w-full h-full object-contain transition-transform group-hover:scale-105 p-1" />
                                            )
                                        ) : (
                                            <div className="text-gray-500 flex flex-col items-center gap-2">
                                                <FaImage className="text-3xl opacity-50" />
                                                <span className="text-xs font-mono">No File Selected</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*,application/pdf"
                                            onChange={handleFileUpload}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="px-3 py-1.5 rounded bg-cyber-gray border border-cyber-border text-xs text-gray-300 hover:text-white hover:border-neon-blue transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {uploading ? <span className="animate-pulse">Uploading...</span> : <><FaUpload /> {form.file_url ? 'Change File' : 'Upload File'}</>}
                                        </button>

                                        {form.file_url && (
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, file_url: '' })}
                                                className="px-3 py-1.5 rounded border border-cyber-border text-xs text-neon-red hover:bg-neon-red/10 transition-all font-mono"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    {uploadError && <p className="text-neon-red text-xs mt-1 font-mono">{uploadError}</p>}
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
