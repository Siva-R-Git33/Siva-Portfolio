import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaCalendarAlt, FaMapMarkerAlt, FaLink, FaImage, FaUpload } from 'react-icons/fa';
import { eventsAPI, storageAPI } from '../utils/api';

export default function ManageEvents() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', date: '', description: '', location: '', link: '', images: [] });

    // Image Upload State
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);

    const load = () => Object.entries(eventsAPI).length > 0 && eventsAPI.getAll().then((res) => setEvents(res.data)).catch(() => { });

    useEffect(() => { load(); }, []);

    const openNew = () => {
        setEditing(null);
        setForm({ title: '', date: '', description: '', location: '', link: '', images: [] });
        setUploadError('');
        setShowModal(true);
    };

    const openEdit = (e) => {
        setEditing(e);
        // Format date for datetime-local input
        const safeDate = e.date ? new Date(e.date).toISOString().slice(0, 16) : '';
        setForm({
            title: e.title,
            date: safeDate,
            description: e.description,
            location: e.location || '',
            link: e.link || '',
            images: e.images || []
        });
        setUploadError('');
        setShowModal(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (form.images.length >= 3) {
            setUploadError('Maximum 3 images allowed per event.');
            return;
        }

        // Validate file type and size (max 2MB)
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select a valid image file.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setUploadError('Image size must be less than 2MB.');
            return;
        }

        setUploading(true);
        setUploadError('');

        try {
            const ext = file.name.split('.').pop();
            const fileName = `event-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
            const path = `events/${fileName}`;

            await storageAPI.uploadFile('uploads', path, file);
            const { data: publicUrl } = storageAPI.getPublicUrl('uploads', path);

            setForm({ ...form, images: [...form.images, publicUrl] });

        } catch (error) {
            console.error('Upload Error:', error);
            setUploadError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = async (urlToRemove) => {
        try {
            const url = new URL(urlToRemove);
            const pathParts = url.pathname.split('/public/uploads/');
            if (pathParts.length > 1) {
                await storageAPI.deleteFile('uploads', pathParts[1]);
            }
        } catch (err) {
            console.error('Failed to delete old image, continuing...', err);
        }
        setForm({ ...form, images: form.images.filter(img => img !== urlToRemove) });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure date is properly formatted for DB (UTC ISO string)
            const payload = { ...form, date: new Date(form.date).toISOString() };
            if (editing) {
                await eventsAPI.update(editing.id, payload);
            } else {
                await eventsAPI.create(payload);
            }
            setShowModal(false);
            load();
        } catch (err) {
            alert(err.message || 'Error saving event');
        }
    };

    const handleDelete = async (e) => {
        if (!confirm('Delete this event?')) return;

        try {
            // Cleanup attached images if they exist in our bucket
            if (e.images && e.images.length > 0) {
                for (const imgUrl of e.images) {
                    if (imgUrl.includes('supabase.co')) {
                        const url = new URL(imgUrl);
                        const pathParts = url.pathname.split('/public/uploads/');
                        if (pathParts.length > 1) {
                            await storageAPI.deleteFile('uploads', pathParts[1]).catch(() => { });
                        }
                    }
                }
            }
            await eventsAPI.delete(e.id);
            load();
        } catch (error) {
            alert('Failed to delete event');
        }
    };

    const now = new Date();
    const upcomingEvents = events.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
    const pastEvents = events.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Reusable Event row component for the admin list
    const EventRow = ({ e }) => (
        <div key={e.id} className="cyber-card flex items-center justify-between group">
            <div className="flex items-center gap-4 w-full max-w-[80%]">
                {e.images && e.images.length > 0 ? (
                    <img src={e.images[0]} alt={e.title} className="w-16 h-16 rounded-lg object-cover shrink-0 border border-cyber-border" />
                ) : (
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                        <FaCalendarAlt className="text-2xl" />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <h3 className="text-white font-semibold truncate">{e.title}</h3>
                    <p className="text-gray-500 text-sm font-mono mt-1">
                        {new Date(e.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {(e.location || e.link) && (
                        <div className="flex gap-4 mt-2 text-xs text-gray-400 font-mono flex-wrap">
                            {e.location && <span className="flex items-center gap-1"><FaMapMarkerAlt /> <span className="truncate">{e.location}</span></span>}
                            {e.link && <span className="flex items-center gap-1 text-neon-blue truncate max-w-[200px]"><FaLink /> {e.link}</span>}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-2 shrink-0 ml-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(e)} className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-all">
                    <FaEdit />
                </button>
                <button onClick={() => handleDelete(e)} className="p-2 rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red/20 transition-all">
                    <FaTrash />
                </button>
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Events</h1>
                <button onClick={openNew} className="cyber-btn-solid text-sm flex items-center gap-2">
                    <FaPlus /> Add Event
                </button>
            </div>

            <div className="space-y-6">
                {/* Upcoming Events Section */}
                <div>
                    <h2 className="text-lg font-bold text-neon-purple mb-3 font-mono border-b border-cyber-border pb-2 flex items-center gap-2">
                        <FaCalendarAlt /> Upcoming Events ({upcomingEvents.length})
                    </h2>
                    <div className="space-y-3">
                        {upcomingEvents.map(e => <EventRow key={e.id} e={e} />)}
                        {upcomingEvents.length === 0 && (
                            <p className="text-gray-500 py-4 font-mono text-sm border border-dashed border-cyber-border rounded-lg text-center bg-cyber-black/50">
                                No upcoming events scheduled. Add an event you will attend.
                            </p>
                        )}
                    </div>
                </div>

                {/* Past Events Section */}
                <div>
                    <h2 className="text-lg font-bold text-gray-400 mb-3 font-mono border-b border-cyber-border pb-2 flex items-center gap-2">
                        <FaCalendarAlt /> Past Events ({pastEvents.length})
                    </h2>
                    <div className="space-y-3">
                        {pastEvents.map(e => <EventRow key={e.id} e={e} />)}
                        {pastEvents.length === 0 && (
                            <p className="text-gray-500 py-4 font-mono text-sm border border-dashed border-cyber-border rounded-lg text-center bg-cyber-black/50">
                                No past events recorded.
                            </p>
                        )}
                    </div>
                </div>
            </div>

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
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaCalendarAlt className="text-neon-purple" /> {editing ? 'Edit Event' : 'New Event'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-neon-red transition-colors"><FaTimes /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Inputs */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1 font-mono">Event Title *</label>
                                        <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:outline-none text-sm transition-colors" placeholder="DefCon 2026" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1 font-mono">Date & Time *</label>
                                        <input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                                            className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:outline-none text-sm transition-colors" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1 font-mono">Location</label>
                                        <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                                            className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:outline-none text-sm transition-colors" placeholder="Las Vegas, NV or Virtual" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1 font-mono">Link (Optional)</label>
                                        <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
                                            className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:outline-none text-sm transition-colors" placeholder="https://..." />
                                    </div>
                                </div>

                                {/* Right Column: Image & Description */}
                                <div className="space-y-4 flex flex-col h-full">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1 font-mono">Event Images (Max 3, 2MB each)</label>

                                        {/* Image Previews Box */}
                                        {form.images.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                {form.images.map((imgUrl, idx) => (
                                                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-cyber-border bg-cyber-gray h-20">
                                                        <img src={imgUrl} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(imgUrl)}
                                                            className="absolute top-1 right-1 bg-black/70 hover:bg-neon-red text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all font-mono text-[10px]"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                            {form.images.length < 3 && (
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={uploading}
                                                    className="px-3 py-1.5 rounded bg-cyber-gray border border-cyber-border text-xs text-gray-300 hover:text-white hover:border-neon-purple transition-all flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {uploading ? <span className="animate-pulse">Uploading...</span> : <><FaUpload /> Upload Image</>}
                                                </button>
                                            )}
                                        </div>
                                        {uploadError && <p className="text-neon-red text-xs mt-1 font-mono">{uploadError}</p>}
                                    </div>

                                    <div className="flex-1 flex flex-col mt-2">
                                        <label className="block text-gray-400 text-sm mb-1 font-mono">Description *</label>
                                        <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className="w-full flex-1 bg-cyber-gray border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:outline-none text-sm transition-colors resize-none" placeholder="Brief details about the event..."></textarea>
                                    </div>
                                </div>

                                {/* Full Width Submit */}
                                <div className="md:col-span-2 pt-4 border-t border-cyber-border/50">
                                    <motion.button type="submit" disabled={uploading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full cyber-btn-solid flex items-center justify-center gap-2 !bg-neon-purple/20 !border-neon-purple !text-neon-purple hover:!bg-neon-purple hover:!text-black disabled:opacity-50">
                                        <FaSave /> {editing ? 'Save Changes' : 'Schedule Event'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
