import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaProjectDiagram, FaBlog, FaCogs, FaEnvelope, FaSignOutAlt, FaHome, FaTachometerAlt, FaCertificate, FaEdit } from 'react-icons/fa';
import { isAuthenticated, logout } from '../utils/auth';
import ManageProjects from '../admin/ManageProjects';
import ManageBlogs from '../admin/ManageBlogs';
import ManageSkills from '../admin/ManageSkills';
import ManageCertifications from '../admin/ManageCertifications';
import ManageContent from '../admin/ManageContent';
import Messages from '../admin/Messages';

const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/content', label: 'Site Content', icon: FaEdit },
    { path: '/admin/projects', label: 'Projects', icon: FaProjectDiagram },
    { path: '/admin/blogs', label: 'Blog Posts', icon: FaBlog },
    { path: '/admin/skills', label: 'Skills', icon: FaCogs },
    { path: '/admin/certifications', label: 'Certifications', icon: FaCertificate },
    { path: '/admin/messages', label: 'Messages', icon: FaEnvelope },
];

function DashboardHome() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
                { label: 'Site Content', icon: FaEdit, color: 'neon-green', path: '/admin/content' },
                { label: 'Projects', icon: FaProjectDiagram, color: 'neon-blue', path: '/admin/projects' },
                { label: 'Blog Posts', icon: FaBlog, color: 'neon-purple', path: '/admin/blogs' },
                { label: 'Skills', icon: FaCogs, color: 'neon-green', path: '/admin/skills' },
                { label: 'Certifications', icon: FaCertificate, color: 'neon-blue', path: '/admin/certifications' },
                { label: 'Messages', icon: FaEnvelope, color: 'neon-red', path: '/admin/messages' },
            ].map((item) => (
                <Link
                    key={item.label}
                    to={item.path}
                    className="cyber-card group text-center"
                >
                    <item.icon className={`text-3xl text-${item.color} mx-auto mb-3`} />
                    <h3 className="text-white font-semibold group-hover:text-neon-green transition-colors">
                        Manage {item.label}
                    </h3>
                </Link>
            ))}
        </div>
    );
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/admin/login');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-cyber-black flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-cyber-dark border-r border-cyber-border transition-all duration-300 flex flex-col shrink-0`}>
                <div className="p-4 border-b border-cyber-border">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold font-mono neon-text">{'<SR/>'}</span>
                        {sidebarOpen && <span className="text-gray-400 text-sm">Admin</span>}
                    </Link>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${location.pathname === item.path
                                ? 'bg-neon-green/10 text-neon-green'
                                : 'text-gray-400 hover:text-white hover:bg-cyber-gray'
                                }`}
                        >
                            <item.icon className="shrink-0" />
                            {sidebarOpen && item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-3 border-t border-cyber-border space-y-1">
                    <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-cyber-gray transition-all">
                        <FaHome className="shrink-0" />
                        {sidebarOpen && 'View Site'}
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neon-red hover:bg-neon-red/10 transition-all"
                    >
                        <FaSignOutAlt className="shrink-0" />
                        {sidebarOpen && 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Routes>
                            <Route path="dashboard" element={<DashboardHome />} />
                            <Route path="content" element={<ManageContent />} />
                            <Route path="projects" element={<ManageProjects />} />
                            <Route path="blogs" element={<ManageBlogs />} />
                            <Route path="skills" element={<ManageSkills />} />
                            <Route path="certifications" element={<ManageCertifications />} />
                            <Route path="messages" element={<Messages />} />
                        </Routes>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
