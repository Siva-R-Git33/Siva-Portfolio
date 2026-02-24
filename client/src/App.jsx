import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import HackerModeToggle from './components/HackerModeToggle';
import useTheme from './hooks/useTheme';

function App() {
    const [loading, setLoading] = useState(true);
    useTheme();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-cyber-black grid-bg">
            <HackerModeToggle />
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
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
        </div>
    );
}

export default App;
