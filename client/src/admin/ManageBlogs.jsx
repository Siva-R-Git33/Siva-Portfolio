import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { blogsAPI } from '../utils/api';

export default function ManageBlogs() {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        title: '', slug: '', content: '', excerpt: '', tags: '', published: false,
    });

    const load = () => blogsAPI.getAllAdmin().then((res) => setPosts(res.data)).catch(() => { });

    useEffect(() => { load(); }, []);

    const openNew = () => {
        setEditing(null);
        setForm({ title: '', slug: '', content: '', excerpt: '', tags: '', published: false });
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setForm({
            title: p.title, slug: p.slug, content: p.content,
            excerpt: p.excerpt || '', tags: p.tags?.join(', ') || '',
            published: p.published,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...form,
            slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        };
        try {
            if (editing) {
                await blogsAPI.update(editing._id, data);
            } else {
                await blogsAPI.create(data);
            }
            setShowModal(false);
            load();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving post');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this post?')) return;
        await blogsAPI.delete(id);
        load();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
                <button onClick={openNew} className="cyber-btn-solid text-sm flex items-center gap-2">
                    <FaPlus /> New Post
                </button>
            </div>

            <div className="space-y-3">
                {posts.map((p) => (
                    <div key={p._id} className="cyber-card flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-white font-semibold truncate">{p.title}</h3>
                                {p.published ? (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green shrink-0">Published</span>
                                ) : (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-600/30 text-gray-400 shrink-0">Draft</span>
                                )}
                            </div>
                            <p className="text-gray-500 text-sm font-mono">/blog/{p.slug}</p>
                            <div className="flex gap-2 mt-1">
                                {p.tags?.map((t) => (
                                    <span key={t} className="text-xs font-mono px-2 py-0.5 rounded bg-neon-blue/10 text-neon-blue">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0 ml-4">
                            <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-all">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red/20 transition-all">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && (
                    <p className="text-gray-500 text-center py-8 font-mono text-sm">No blog posts yet. Write your first post!</p>
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
                            className="glass rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">{editing ? 'Edit Post' : 'New Post'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Title</label>
                                    <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Slug (auto-generated if empty)</label>
                                    <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm"
                                        placeholder="my-blog-post" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Excerpt</label>
                                    <input type="text" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm"
                                        placeholder="Short description..." />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Content (Markdown)</label>
                                    <textarea required rows={12} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm font-mono resize-none" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Tags (comma-separated: CTF, Blue Team, Pentesting)</label>
                                    <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-green focus:outline-none text-sm" />
                                </div>
                                <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })}
                                        className="accent-neon-green" />
                                    Published
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
