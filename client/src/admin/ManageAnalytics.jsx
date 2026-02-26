import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaDownload, FaHistory, FaCalendar } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase, settingsAPI } from '../utils/api';

export default function ManageAnalytics() {
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const { data: featureData } = await settingsAPI.get('feature_flags');
                if (featureData?.enableResumeTracking) {
                    setAnalyticsEnabled(true);
                    await fetchLogs();
                }
            } catch (error) {
                console.error('Failed to init analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('analytics_logs')
                .select('*')
                .eq('event_type', 'resume_download')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    // Aggregate logs into daily counts for the chart
    const chartData = useMemo(() => {
        const dailyMap = {};
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            dailyMap[key] = 0;
        }
        logs.forEach(log => {
            const day = new Date(log.created_at).toISOString().split('T')[0];
            if (dailyMap[day] !== undefined) dailyMap[day]++;
        });
        return Object.entries(dailyMap).map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            downloads: count,
        }));
    }, [logs]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!analyticsEnabled) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-center">
                <FaChartLine className="text-6xl text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-400 mb-2">Analytics Disabled</h2>
                <p className="text-gray-500">Enable "Pro Analytics &amp; Resume Tracking" in the Feature Flags section to start collecting data.</p>
            </motion.div>
        );
    }

    const totalDownloads = logs.length;
    const downloadsThisWeek = logs.filter(log => {
        const logDate = new Date(log.created_at);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return logDate >= oneWeekAgo;
    }).length;

    const ChartTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-cyber-dark border border-neon-green/30 rounded-lg px-4 py-2 shadow-xl">
                    <p className="text-gray-400 text-xs font-mono">{label}</p>
                    <p className="text-neon-green font-bold text-lg">{payload[0].value} downloads</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3 mb-6">
                <span className="text-neon-blue">&gt;</span> Site Analytics
            </h1>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="cyber-card flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-neon-green/10 flex items-center justify-center">
                        <FaDownload className="text-2xl text-neon-green" />
                    </div>
                    <div>
                        <p className="text-gray-400 font-mono text-sm">TOTAL RESUME DOWNLOADS</p>
                        <h3 className="text-4xl font-black text-white">{totalDownloads}</h3>
                    </div>
                </div>
                <div className="cyber-card flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center">
                        <FaHistory className="text-2xl text-neon-blue" />
                    </div>
                    <div>
                        <p className="text-gray-400 font-mono text-sm">DOWNLOADS THIS WEEK</p>
                        <h3 className="text-4xl font-black text-white">{downloadsThisWeek}</h3>
                    </div>
                </div>
            </div>

            {/* Downloads Over Time Chart */}
            <div className="cyber-card">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaChartLine className="text-neon-green" /> Downloads (Last 14 Days)
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00ff41" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }} />
                            <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="downloads"
                                stroke="#00ff41"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#greenGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Log Table */}
            <div className="cyber-card overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaCalendar className="text-neon-blue" /> Recent Downloads
                </h3>

                {logs.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No analytic logs recorded yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 bg-cyber-black/50 border-b border-cyber-border text-neon-blue font-mono text-sm font-normal">EVENT TYPE</th>
                                    <th className="py-3 px-4 bg-cyber-black/50 border-b border-cyber-border text-neon-blue font-mono text-sm font-normal">TIMESTAMP</th>
                                    <th className="py-3 px-4 bg-cyber-black/50 border-b border-cyber-border text-neon-blue font-mono text-sm font-normal">DETAILS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-b border-cyber-border/50 hover:bg-cyber-gray/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 rounded bg-neon-green/10 text-neon-green text-xs font-mono">
                                                {log.event_type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300 text-sm">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-gray-400 text-xs font-mono truncate max-w-xs">
                                            {JSON.stringify(log.details)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
