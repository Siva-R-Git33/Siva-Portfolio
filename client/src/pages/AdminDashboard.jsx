import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaProjectDiagram, FaBlog, FaCogs, FaEnvelope, FaSignOutAlt, FaHome, FaTachometerAlt, FaCertificate, FaEdit, FaPalette, FaKey, FaTimes, FaBars } from 'react-icons/fa';
import { isAuthenticated, logout } from '../utils/auth';
import { authAPI } from '../utils/api';
import ManageProjects from '../admin/ManageProjects';
import ManageBlogs from '../admin/ManageBlogs';
import ManageSkills from '../admin/ManageSkills';
import ManageCertifications from '../admin/ManageCertifications';
import ManageContent from '../admin/ManageContent';
import ManageTheme from '../admin/ManageTheme';
import ManageFeatures from '../admin/ManageFeatures';
import ManageAnalytics from '../admin/ManageAnalytics';
import ManageSecurity from '../admin/ManageSecurity';
import ManageEvents from '../admin/ManageEvents';
import Messages from '../admin/Messages';
import { FaToggleOn, FaChartLine, FaShieldAlt, FaCalendarAlt, FaGripLines } from 'react-icons/fa';

const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/features', label: 'Features & Layout', icon: FaToggleOn },
    { path: '/admin/content', label: 'Site Content', icon: FaEdit },
    { path: '/admin/theme', label: 'Theme', icon: FaPalette },
    { path: '/admin/security', label: 'Security (2FA)', icon: FaShieldAlt },
    { path: '/admin/analytics', label: 'Analytics', icon: FaChartLine },
    { path: '/admin/projects', label: 'Projects', icon: FaProjectDiagram },
    { path: '/admin/blogs', label: 'Blog Posts', icon: FaBlog },
    { path: '/admin/skills', label: 'Skills', icon: FaCogs },
    { path: '/admin/certifications', label: 'Certifications', icon: FaCertificate },
    { path: '/admin/events', label: 'Events', icon: FaCalendarAlt },
    { path: '/admin/messages', label: 'Messages', icon: FaEnvelope },
];

function DashboardHome() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
                { label: 'Features & Layout', icon: FaToggleOn, color: 'neon-purple', path: '/admin/features' },
                { label: 'Security (2FA)', icon: FaShieldAlt, color: 'neon-red', path: '/admin/security' },
                { label: 'Analytics', icon: FaChartLine, color: 'neon-green', path: '/admin/analytics' },
                { label: 'Site Content', icon: FaEdit, color: 'neon-blue', path: '/admin/content' },
                { label: 'Projects', icon: FaProjectDiagram, color: 'neon-purple', path: '/admin/projects' },
                { label: 'Blog Posts', icon: FaBlog, color: 'neon-green', path: '/admin/blogs' },
                { label: 'Skills', icon: FaCogs, color: 'neon-blue', path: '/admin/skills' },
                { label: 'Certifications', icon: FaCertificate, color: 'neon-blue', path: '/admin/certifications' },
                { label: 'Events', icon: FaCalendarAlt, color: 'neon-purple', path: '/admin/events' },
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    // Password Change State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/admin/login');
        }
    }, [navigate]);

    // Prevent Flash of Unauthenticated Content (FOUC)
    if (!isAuthenticated()) {
        return null;
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordForm.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        setPasswordLoading(true);
        try {
            await authAPI.updatePassword(passwordForm.newPassword);
            setPasswordSuccess('Password successfully updated!');
            setPasswordForm({ newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess('');
            }, 2000);
        } catch (err) {
            setPasswordError(err.message || 'Failed to update password.');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cyber-black flex overflow-hidden">
            {/* Mobile Sidebar Overlay Backdrop */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                ${sidebarOpen ? 'w-64' : 'w-16'} 
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                bg-cyber-dark border-r border-cyber-border transition-all duration-300 flex flex-col shrink-0
            `}>
                <div className="p-4 border-b border-cyber-border flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold font-mono neon-text">{'<SR/>'}</span>
                        {sidebarOpen && <span className="text-gray-400 text-sm">Admin</span>}
                    </Link>
                    {/* Native Desktop Sidebar Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden md:block text-gray-500 hover:text-white transition-colors"
                    >
                        <FaBars />
                    </button>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="md:hidden text-gray-500 hover:text-white transition-colors"
                    >
                        <FaTimes />
                    </button>
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
                        onClick={() => {
                            setPasswordForm({ newPassword: '', confirmPassword: '' });
                            setPasswordError('');
                            setPasswordSuccess('');
                            setShowPasswordModal(true);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 transition-all text-left"
                    >
                        <FaKey className="shrink-0" />
                        {sidebarOpen && 'Change Password'}
                    </button>
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
            <main className="flex-1 overflow-y-auto flex flex-col h-screen">
                {/* Mobile Header Bar */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-cyber-border bg-cyber-dark shrink-0">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold font-mono neon-text">{'<SR/>'}</span>
                        <span className="text-gray-400 text-sm">Admin</span>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="text-gray-400 hover:text-white p-2"
                    >
                        <FaBars className="text-xl" />
                    </button>
                </div>

                <div className="p-4 md:p-6 max-w-6xl mx-auto w-full flex-1">
                    <Routes>
                        <Route path="dashboard" element={<DashboardHome />} />
                        <Route path="features" element={<ManageFeatures />} />
                        <Route path="analytics" element={<ManageAnalytics />} />
                        <Route path="security" element={<ManageSecurity />} />
                        <Route path="content" element={<ManageContent />} />
                        <Route path="theme" element={<ManageTheme />} />
                        <Route path="projects" element={<ManageProjects />} />
                        <Route path="blogs" element={<ManageBlogs />} />
                        <Route path="skills" element={<ManageSkills />} />
                        <Route path="certifications" element={<ManageCertifications />} />
                        <Route path="events" element={<ManageEvents />} />
                        <Route path="messages" element={<Messages />} />
                    </Routes>
                </div>
            </main>

            {/* Change Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-cyber-dark border border-cyber-border rounded-xl p-6 w-full max-w-md shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-2 font-mono">
                                <span className="text-neon-blue">&gt;</span> Change Password
                            </h2>
                            <p className="text-sm text-gray-400 mb-6">Update your admin login password. You will use this new password next time you sign in.</p>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full bg-cyber-black border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none text-sm"
                                        placeholder="Min. 6 characters"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full bg-cyber-black border border-cyber-border rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none text-sm"
                                        placeholder="Re-type password"
                                    />
                                </div>

                                {passwordError && <p className="text-red-400 text-sm mt-2">{passwordError}</p>}
                                {passwordSuccess && <p className="text-neon-green text-sm mt-2">{passwordSuccess}</p>}

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className="cyber-btn-solid bg-neon-blue hover:bg-neon-blue/80 text-white !py-2 !px-6 disabled:opacity-50"
                                    >
                                        {passwordLoading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
