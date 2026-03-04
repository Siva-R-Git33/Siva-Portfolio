import React, { useMemo } from 'react';

const GlobalBackground = () => {
    // Generate static stars once to prevent React from recalculating on every render
    const createStars = (count, size, duration) => {
        const stars = [];
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * 2000);
            const y = Math.floor(Math.random() * 2000);

            // Cyberpunk color palette for stars
            const colors = ['#00ff41', '#00d4ff', '#bd00ff', '#ffffff'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            stars.push(`${x}px ${y}px ${color}`);
        }

        const style = {
            width: `${size}px`,
            height: `${size}px`,
            background: 'transparent',
            boxShadow: stars.join(', '),
            animation: `animStar ${duration}s linear infinite`,
            borderRadius: '50%'
        };

        return (
            <div className="absolute top-0 left-0" style={style}>
                <div className="absolute top-[2000px] left-0" style={style}></div>
            </div>
        );
    };

    const starsSmall = useMemo(() => createStars(300, 1, 100), []);
    const starsMedium = useMemo(() => createStars(100, 2, 150), []);
    const starsLarge = useMemo(() => createStars(30, 3, 200), []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden mix-blend-screen" style={{ zIndex: -1 }}>
            {/* Global soft ambient glows */}
            <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[150px]"></div>

            {starsSmall}
            {starsMedium}
            {starsLarge}

            <style>{`
                @keyframes animStar {
                    from { transform: translateY(0px) }
                    to { transform: translateY(-2000px) }
                }
            `}</style>
        </div>
    );
};

export default GlobalBackground;
