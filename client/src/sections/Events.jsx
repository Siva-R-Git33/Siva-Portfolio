import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import { eventsAPI, settingsAPI } from '../utils/api';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpcoming, setShowUpcoming] = useState(true);
    const [showPast, setShowPast] = useState(true);

    useEffect(() => {
        Promise.all([
            Object.keys(eventsAPI).length > 0 ? eventsAPI.getAll() : Promise.resolve({ data: [] }),
            settingsAPI.get('feature_flags')
        ]).then(([eventsRes, flagsRes]) => {
            setEvents(eventsRes.data || []);
            if (flagsRes.data) {
                if (flagsRes.data.showUpcomingEvents === false) setShowUpcoming(false);
                if (flagsRes.data.showPastEvents === false) setShowPast(false);
            }
        }).catch(err => console.error("Failed to load events/flags", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section id="events" className="py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="section-title text-neon-purple/50 animate-pulse">Loading Events...</h2>
                </div>
            </section>
        );
    }

    if (events.length === 0) return null;

    // Split events into Upcoming and Past based on current date
    const now = new Date();
    const upcomingEvents = events.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
    const pastEvents = events.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));

    const EventCard = ({ event, isPast }) => {
        const eventDate = new Date(event.date);
        const day = eventDate.toLocaleDateString(undefined, { day: '2-digit' });
        const month = eventDate.toLocaleDateString(undefined, { month: 'short' });
        const year = eventDate.getFullYear() !== now.getFullYear() ? `'${eventDate.getFullYear().toString().slice(2)}` : '';
        const time = eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                className={`cyber-card relative ${isPast ? 'opacity-70 hover:opacity-100 transition-opacity' : 'border-neon-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'}`}
            >
                {/* Date Badge */}
                <div className={`absolute -top-4 -left-4 w-16 h-16 rounded-xl flex flex-col items-center justify-center font-mono shadow-lg border ${isPast ? 'bg-cyber-gray border-cyber-border text-gray-400' : 'bg-neon-purple/20 border-neon-purple text-neon-purple backdrop-blur-md'
                    }`}>
                    <span className="text-xl font-bold leading-none">{day}</span>
                    <span className="text-xs font-semibold uppercase">{month} {year}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-6 ml-6 md:ml-10">
                    {/* Event Details */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <h3 className={`text-xl font-bold ${isPast ? 'text-gray-300' : 'text-white'}`}>{event.title}</h3>
                            {event.link && (
                                <a href={event.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-cyber-black rounded border border-cyber-border text-gray-400 hover:text-neon-purple hover:border-neon-purple transition-colors shrink-0">
                                    <FaLink />
                                </a>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500">
                            <span className="flex items-center gap-1.5"><FaCalendarAlt /> {time}</span>
                            {event.location && (
                                <span className="flex items-center gap-1.5"><FaMapMarkerAlt /> {event.location}</span>
                            )}
                        </div>

                        <p className={`text-sm leading-relaxed ${isPast ? 'text-gray-500' : 'text-gray-400'}`}>
                            {event.description}
                        </p>
                    </div>

                    {/* Banner Images (if exist) */}
                    {event.images && event.images.length > 0 && (
                        <div className={`w-full md:w-48 shrink-0 hidden md:flex flex-col gap-2`}>
                            {event.images.map((imgUrl, idx) => (
                                <div key={idx} className="w-full h-24 rounded-lg overflow-hidden border border-cyber-border/50 group relative">
                                    <img src={imgUrl} alt={`${event.title} - ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Images (rendered below text on small screens) */}
                {event.images && event.images.length > 0 && (
                    <div className="w-full mt-4 flex gap-2 overflow-x-auto pb-2 md:hidden hide-scrollbar">
                        {event.images.map((imgUrl, idx) => (
                            <div key={idx} className="w-40 h-28 shrink-0 rounded-lg overflow-hidden border border-cyber-border/50">
                                <img src={imgUrl} alt={`${event.title} - ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <section id="events" className="py-20 px-4 relative">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title mb-2">
                        <span className="text-neon-purple">Upcoming</span> Events
                    </h2>
                    <p className="section-subtitle">Conferences, CTFs, and meetups</p>
                </motion.div>

                {/* Vertical Timeline Line */}
                <div className="relative border-l-2 border-dashed border-cyber-border/50 pl-4 md:pl-8 ml-4 md:ml-8 space-y-12">

                    {/* Upcoming Events */}
                    {showUpcoming && (
                        <div className="space-y-12">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map(event => <EventCard key={event.id} event={event} isPast={false} />)
                            ) : (
                                <div className="cyber-card py-8 text-center text-gray-500 font-mono text-sm border-dashed">
                                    No upcoming events currently scheduled.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Past Events */}
                    {showPast && pastEvents.length > 0 && (
                        <div className="space-y-12">
                            <div className="relative">
                                <div className="absolute -left-[21px] md:-left-[37px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyber-border"></div>
                                <h3 className="text-gray-500 font-mono font-semibold uppercase tracking-widest pl-2">Past Archives</h3>
                            </div>
                            {pastEvents.map(event => <EventCard key={event.id} event={event} isPast={true} />)}
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}
