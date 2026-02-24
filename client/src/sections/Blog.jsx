import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaArrowRight } from 'react-icons/fa';
import { blogsAPI, settingsAPI } from '../utils/api';

const tagColors = {
    CTF: 'bg-neon-green/10 text-neon-green',
    'Blue Team': 'bg-neon-blue/10 text-neon-blue',
    Pentesting: 'bg-neon-purple/10 text-neon-purple',
    Writeup: 'bg-neon-red/10 text-neon-red',
};

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [activeTag, setActiveTag] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [showSection, setShowSection] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        settingsAPI.get('showBlogSection').then((r) => {
            if (r.data !== null) setShowSection(r.data);
        }).catch(() => { });

        settingsAPI.get('feature_flags').then(res => {
            if (res.data?.showProjectFilters) setShowFilters(true);
        }).catch(() => { });
    }, []);

    useEffect(() => {
        setLoaded(false);
        blogsAPI.getAll(activeTag)
            .then((res) => {
                setPosts(res.data);
                setLoaded(true);
            })
            .catch(() => { setLoaded(true); });
    }, [activeTag]);

    if (!showSection) return null;

    const tags = ['CTF', 'Blue Team', 'Pentesting', 'Writeup'];

    return (
        <section id="blog" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Section title — no animation wrapper, just plain visible text */}
                <div className="text-center mb-16">
                    <h2 className="section-title">Blog &amp; CTF Writeups</h2>
                    <p className="section-subtitle">Sharing knowledge and documenting challenges</p>
                </div>

                {/* Tag Filter */}
                {showFilters && (
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        <button
                            onClick={() => setActiveTag(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 ${!activeTag
                                ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                                : 'bg-cyber-gray text-gray-400 border border-cyber-border hover:text-neon-green'
                                }`}
                        >
                            All
                        </button>
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className={`px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 ${activeTag === tag
                                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                                    : 'bg-cyber-gray text-gray-400 border border-cyber-border hover:text-neon-green'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}

                {/* Blog Posts */}
                {loaded && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, i) => (
                            <div
                                key={post.id}
                                style={{ animation: `fadeInUp 0.4s ease ${i * 0.1}s both` }}
                            >
                                <Link to={`/blog/${post.slug}`} className="cyber-card block group h-full">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {post.tags?.map((tag) => (
                                            <span
                                                key={tag}
                                                className={`text-xs font-mono px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-cyber-gray text-gray-400'}`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-green transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                                        {post.excerpt || 'Read more...'}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-gray-600 text-xs flex items-center gap-1">
                                            <FaCalendar />
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-neon-green text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read <FaArrowRight className="text-xs" />
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {loaded && posts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="terminal-window max-w-md mx-auto">
                            <div className="terminal-header">
                                <div className="terminal-dot bg-red-500" />
                                <div className="terminal-dot bg-yellow-500" />
                                <div className="terminal-dot bg-green-500" />
                                <span className="ml-3 text-gray-400 text-xs font-mono">blog</span>
                            </div>
                            <div className="terminal-body text-center py-8">
                                <p className="text-neon-green font-mono text-sm mb-2">&gt; ls ./writeups</p>
                                <p className="text-gray-500 font-mono text-sm">Coming soon...</p>
                                <p className="text-gray-600 font-mono text-xs mt-2">CTF writeups and security blogs in progress</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
