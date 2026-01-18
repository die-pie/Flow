import React from 'react';
import { motion } from 'framer-motion';

const AuroraBackground = () => (
    <div 
        className="fixed inset-0 z-[-50] bg-[#f5f5f7] dark:bg-black overflow-hidden transition-colors duration-700 transform-gpu"
        style={{ contain: 'strict' }}
    >
        {/* Blob 1: Cyan/Blue (Top-Left) */}
        <motion.div 
            className="absolute top-0 left-0 w-[50vw] h-[50vw] rounded-full bg-cyan-400/30 mix-blend-multiply dark:mix-blend-screen blur-[100px] will-change-transform"
            style={{ x: '-10%', y: '-10%' }} 
            animate={{ 
                x: ['-10%', '30%', '-20%', '-10%'],
                y: ['-10%', '20%', '0%', '-10%'],
                scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Blob 2: Purple/Violet (Bottom-Right) */}
        <motion.div 
            className="absolute bottom-0 right-0 w-[60vw] h-[60vw] rounded-full bg-purple-500/30 mix-blend-multiply dark:mix-blend-screen blur-[120px] will-change-transform"
            style={{ x: '10%', y: '10%' }}
            animate={{ 
                x: ['10%', '-30%', '20%', '10%'],
                y: ['10%', '-20%', '30%', '10%'],
                scale: [1, 1.2, 0.95, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Blob 3: White/Pink (Center - subtle) */}
        <motion.div 
            className="absolute top-1/2 left-1/2 w-[40vw] h-[40vw] rounded-full bg-pink-300/20 mix-blend-multiply dark:mix-blend-screen blur-[80px] will-change-transform"
            style={{ x: '-50%', y: '-50%' }}
            animate={{ 
                x: ['-50%', '-30%', '-60%', '-50%'],
                y: ['-50%', '-40%', '-60%', '-50%'],
                scale: [1, 1.3, 0.8, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
    </div>
);

export default AuroraBackground;
