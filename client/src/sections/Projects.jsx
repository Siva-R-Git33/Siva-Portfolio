import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch } from 'react-icons/fa';
import { projectsAPI, githubAPI } from '../utils/api';

const featuredFallback = {
    title: 'Offline Signature Verification System',
    description: 'Built a CNN-based handwritten signature verification system in MATLAB to detect genuine and forged signatures using image processing and classification techniques.',
    techStack: ['MATLAB', 'CNN', 'Image Processing', 'Classification'],
    featured: true,
};

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export default function Projects() {
    const [projects, setProjects] = useState([featuredFallback]);
    const [githubRepos, setGithubRepos] = useState([]);
    const [showRepos, setShowRepos] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');

    // Extract unique tags from projects
    const allTags = ['All', ...new Set(projects.flatMap(p => p.techStack || []))].filter(Boolean);

    useEffect(() => {
        projectsAPI.getAll()
            .then((res) => {
                if (res.data.length > 0) setProjects(res.data);
            })
            .catch(() => { });

        // Fetch feature flags for advanced filters
        import('../utils/api').then(({ settingsAPI }) => {
            settingsAPI.get('feature_flags').then(res => {
                if (res.data?.showProjectFilters) setShowFilters(true);
            }).catch(() => { });

            settingsAPI.get('showGitHubRepos')
                .then((res) => {
                    const isVisible = res.data !== false; // default true
                    setShowRepos(isVisible);
                    if (isVisible) {
                        githubAPI.getRepos()
                            .then((res) => setGithubRepos(res.data))
                            .catch(() => { });
                    }
                })
                .catch(() => {
                    // Fallback to true if settings fail
                    githubAPI.getRepos()
                        .then((res) => setGithubRepos(res.data))
                        .catch(() => { });
                });
        });
    }, []);

    const languageColors = {
        Python: '#3572A5',
        JavaScript: '#f1e05a',
        MATLAB: '#e16737',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Shell: '#89e051',
        Bash: '#89e051',
        TypeScript: '#2b7489',
    };

    return (
        <section id="projects" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">Projects</h2>
                    <p className="section-subtitle">Things I've built and contributed to</p>
                </motion.div>

                {/* Featured Projects */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h3 className="text-lg font-bold text-neon-green font-mono">
                            {'>'} Featured Projects
                        </h3>

                        {/* Dynamic Filters */}
                        {showFilters && allTags.length > 2 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setActiveFilter(tag)}
                                        className={`px-3 py-1 text-xs font-mono rounded-full transition-colors ${activeFilter === tag
                                                ? 'bg-neon-green text-black'
                                                : 'bg-cyber-gray/50 text-gray-400 hover:text-neon-green hover:border-neon-green border border-transparent'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects
                            .filter(p => activeFilter === 'All' || (p.techStack && p.techStack.includes(activeFilter)))
                            .map((project, i) => (
                                <motion.div
                                    key={project.id || i}
                                    variants={cardVariants}
                                    className="cyber-card group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="text-xl font-bold text-white group-hover:text-neon-green transition-colors">
                                            {project.title}
                                        </h4>
                                        <div className="flex gap-2">
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                                    className="text-gray-500 hover:text-neon-green transition-colors">
                                                    <FaGithub />
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                                                    className="text-gray-500 hover:text-neon-blue transition-colors">
                                                    <FaExternalLinkAlt className="text-sm" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack?.map((tech) => (
                                            <span key={tech} className="text-xs font-mono px-2 py-1 rounded bg-neon-green/10 text-neon-green">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </motion.div>

                {/* GitHub Repos */}
                {(showRepos && githubRepos.length > 0) && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h3 className="text-lg font-bold text-neon-blue mb-6 font-mono">
                            {'>'} GitHub Repositories
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {githubRepos.slice(0, 9).map((repo) => (
                                <motion.a
                                    key={repo.id}
                                    variants={cardVariants}
                                    href={repo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cyber-card group block"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaGithub className="text-gray-500" />
                                        <h4 className="text-white font-semibold text-sm group-hover:text-neon-green transition-colors truncate">
                                            {repo.name}
                                        </h4>
                                    </div>
                                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                                        {repo.description || 'No description'}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        {repo.language && (
                                            <span className="flex items-center gap-1">
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: languageColors[repo.language] || '#586069' }}
                                                />
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <FaStar className="text-yellow-500" /> {repo.stars}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaCodeBranch /> {repo.forks}
                                        </span>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
