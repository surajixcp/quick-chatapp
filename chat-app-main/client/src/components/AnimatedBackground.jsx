import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Deep Space Base */}
            <div className="absolute inset-0 bg-[#0f0c29]"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/20 via-[#302b63] to-[#24243e]"></div>

            {/* SVG Pattern - Grid / Connections */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="white" strokeWidth="1" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>

            {/* Floating Blobs SVG */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] animate-blob mix-blend-screen opacity-40">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#7C3AED" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.3,22.9,71.3,34.3C60.3,45.7,49.5,54.9,37.6,63.1C25.7,71.3,12.9,78.5,-1.3,80.8C-15.5,83,-31,80.3,-44.7,73.1C-58.4,65.9,-70.3,54.2,-78.6,40.6C-86.9,27,-91.6,11.5,-90.1,-3.5C-88.6,-18.5,-80.9,-33,-69.8,-43.8C-58.7,-54.6,-44.2,-61.7,-30.2,-68.9C-16.2,-76.1,-2.7,-83.4,12.7,-85.4L44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>

            <div className="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] animate-blob animation-delay-2000 mix-blend-screen opacity-40">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4338CA" d="M38.1,-63.3C49.2,-54.3,57.9,-42.6,65.3,-30.2C72.7,-17.8,78.8,-4.7,76.6,7.5C74.3,19.7,63.7,31,53.4,41.2C43.1,51.4,33.1,60.5,21.6,65.8C10.1,71.1,-2.9,72.6,-14.8,69.5C-26.7,66.4,-37.6,58.7,-47.1,49.5C-56.6,40.3,-64.7,29.6,-68.2,17.7C-71.7,5.8,-70.6,-7.3,-64.9,-18.8C-59.2,-30.3,-48.9,-40.2,-37.5,-49C-26,-57.8,-13,-65.5,0.7,-66.6C14.4,-67.7,28.8,-62.1,38.1,-63.3Z" transform="translate(100 100)" />
                </svg>
            </div>

            <div className="absolute top-[40%] left-[40%] w-[40vh] h-[40vh] animate-blob animation-delay-4000 mix-blend-overlay opacity-30">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#A78BFA" d="M47.2,-73.4C60.5,-64.3,70.2,-50.2,76.8,-35.1C83.4,-20,86.9,-3.9,85.2,11.5C83.5,26.9,76.6,41.6,66.3,53.3C56,65,42.3,73.8,27.6,77.5C12.9,81.2,-2.8,79.8,-17.2,74.9C-31.6,70,-44.7,61.6,-56.1,51.2C-67.5,40.8,-77.2,28.4,-79.8,14.4C-82.4,0.4,-77.9,-15.2,-69.3,-28.4C-60.7,-41.6,-48,-52.4,-34.5,-61.4C-21,-70.4,-6.7,-77.6,6.3,-87.3L47.2,-73.4Z" transform="translate(100 100)" />
                </svg>
            </div>

        </div>
    );
};

export default AnimatedBackground;
