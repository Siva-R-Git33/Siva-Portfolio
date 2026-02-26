import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { settingsAPI } from './utils/api';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/AdminLogin';
import HackerModeToggle from './components/HackerModeToggle';
import HireMeModal from './components/HireMeModal';
import CommandPalette from './components/CommandPalette';
import ThemePicker from './components/ThemePicker';

// Lazy-loaded routes for performance optimization
const SecurityLab = React.lazy(() => import('./pages/SecurityLab'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
import useTheme from './hooks/useTheme';

function App() {
    const [loading, setLoading] = useState(true);
    const [seo, setSeo] = useState({
        title: 'Siva R | Cybersecurity Portfolio',
        description: 'Aspiring Ethical Hacker and Blue Team professional focused on vulnerability assessment and threat detection.',
        keywords: 'cybersecurity, ethical hacking, blue team, penetration testing, CTF, portfolio, security analyst',
        ogImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=hacker'
    });
    useTheme();

    useEffect(() => {
        // Fetch SEO settings alongside the synthetic timer
        settingsAPI.get('seo_settings').then(res => {
            if (res.data) setSeo(prev => ({ ...prev, ...res.data }));
        }).catch(() => { });

        const timer = setTimeout(() => setLoading(false), 2800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-cyber-black grid-bg">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <meta name="keywords" content={seo.keywords} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:image" content={seo.ogImage} />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            <HackerModeToggle />
            <HireMeModal />
            <CommandPalette />
            <ThemePicker />
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div id="site-wrapper">
                                <Navbar />
                                <Home />
                                <Footer />
                            </div>
                        }
                    />
                    <Route
                        path="/blog/:slug"
                        element={
                            <div id="site-wrapper">
                                <Navbar />
                                <BlogPost />
                                <Footer />
                            </div>
                        }
                    />
                    <Route
                        path="/lab"
                        element={
                            <div id="site-wrapper">
                                <Navbar />
                                <SecurityLab />
                                <Footer />
                            </div>
                        }
                    />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={<AdminDashboard />} />
                    {/* Catch-all 404 Route redirecting to home */}
                    <Route path="*" element={<Home />} />
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;
