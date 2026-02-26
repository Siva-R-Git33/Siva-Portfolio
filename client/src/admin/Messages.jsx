import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaEnvelope, FaCheck } from 'react-icons/fa';
import { contactAPI } from '../utils/api';

export default function Messages() {
    const [messages, setMessages] = useState([]);

    const load = () => contactAPI.getAll().then((res) => setMessages(res.data)).catch(() => { });

    useEffect(() => { load(); }, []);

    const markRead = async (id) => {
        await contactAPI.markRead(id);
        load();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this message?')) return;
        await contactAPI.delete(id);
        load();
    };

    const unreadCount = messages.filter((m) => !m.read).length;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Messages</h1>
                    {unreadCount > 0 && (
                        <p className="text-neon-green text-sm font-mono">{unreadCount} unread message{unreadCount > 1 ? 's' : ''}</p>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`cyber-card ${!msg.read ? 'border-neon-green/30' : ''}`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-white font-semibold">{msg.name}</h3>
                                    {!msg.read && (
                                        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                                    )}
                                </div>
                                <p className="text-neon-blue text-sm font-mono mb-2">{msg.email}</p>
                                <p className="text-gray-300 text-sm leading-relaxed">{msg.message}</p>
                                <p className="text-gray-600 text-xs mt-2 font-mono">
                                    {new Date(msg.created_at || msg.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                {!msg.read && (
                                    <button onClick={() => markRead(msg.id)}
                                        className="p-2 rounded-lg bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-all"
                                        title="Mark as read">
                                        <FaCheck />
                                    </button>
                                )}
                                <a href={`mailto:${msg.email}`}
                                    className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-all"
                                    title="Reply">
                                    <FaEnvelope />
                                </a>
                                <button onClick={() => handleDelete(msg.id)}
                                    className="p-2 rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red/20 transition-all"
                                    title="Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {messages.length === 0 && (
                    <p className="text-gray-500 text-center py-8 font-mono text-sm">No messages yet.</p>
                )}
            </div>
        </div>
    );
}
