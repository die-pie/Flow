import React from 'react';
import { motion } from 'framer-motion';

const FocusLens = ({ isVisible = true, height = 192, accentColor = '#ffffff' }) => {
    return (
        <motion.div 
            className="fixed top-1/2 left-1/2 w-[95%] md:w-full max-w-5xl pointer-events-none z-[5] block rounded-[32px] border border-white/10 overflow-hidden"
            style={{ 
                boxShadow: `inset 0 0 30px ${accentColor}20`, // Accent glow
            }}
            initial={{ opacity: 0, scaleX: 0.9, x: "-50%", y: "-50%", height: 192 }}
            animate={{ 
                opacity: isVisible ? 1 : 0, 
                scaleX: isVisible ? 1 : 0.9,
                x: "-50%",
                y: "-50%",
                height: height
            }}
            transition={{ 
                duration: 0.4, 
                ease: "circOut",
                height: { type: "spring", stiffness: 300, damping: 30 } 
            }}
        >
            {/* Glass Gradient & Blur */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-[2px] transition-colors duration-700" />
            
            {/* Top Shine */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
        </motion.div>
    );
};

export default FocusLens;
