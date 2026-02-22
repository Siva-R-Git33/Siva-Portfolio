import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { blogsAPI } from '../utils/api';

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        blogsAPI.getBySlug(slug)
            .then((res) => {
                setPost(res.data);
                setLoading(false);
                document.title = `${res.data.title} | Siva R`;
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-neon-green font-mono animate-pulse">Loading...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="terminal-window max-w-md">
                    <div className="terminal-header">
                        <div className="terminal-dot bg-red-500" />
                        <div className="terminal-dot bg-yellow-500" />
                        <div className="terminal-dot bg-green-500" />
                    </div>
                    <div className="terminal-body text-center py-8">
                        <p className="text-neon-red font-mono mb-2">Error 404</p>
                        <p className="text-gray-500 font-mono text-sm">Post not found</p>
                    </div>
                </div>
                <Link to="/#blog" className="mt-6 cyber-btn text-sm">← Back to Blog</Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-16 px-4"
        >
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/#blog"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-green transition-colors mb-8 text-sm"
                >
                    <FaArrowLeft /> Back to Blog
                </Link>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags?.map((tag) => (
                            <span key={tag} className="text-xs font-mono px-3 py-1 rounded-full bg-neon-green/10 text-neon-green">
                                <FaTag className="inline mr-1" />{tag}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-8 pb-8 border-b border-cyber-border">
                        <span className="flex items-center gap-1">
                            <FaCalendar /> {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    {/* Content */}
                    <MarkdownRenderer content={post.content} />
                </motion.article>
            </div>
        </motion.div>
    );
}
