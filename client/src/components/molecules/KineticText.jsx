import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useKineticType } from '../../hooks/useKineticType';

const KineticText = ({ text, type = 'slide', className }) => {
    // We need a ref for the scroll progress of THIS specific element
    const ref = React.useRef(null);
    const { skew, stretch, distortion } = useKineticType(ref);

    // Split text into words for granular control
    const words = text.split(' ');

    if (type === 'distort') {
        return (
            <motion.div ref={ref} className={clsx("flex flex-wrap justify-center gap-x-3 gap-y-1 perspective-1000", className)} style={{ perspective: '1000px' }}>
                {words.map((word, i) => (
                    <motion.span
                        key={i}
                        className="inline-block origin-center will-change-transform"
                        style={{ 
                            skewX: skew,
                            scaleY: stretch,
                            x: i % 2 === 0 ? distortion : 0 // Parallax effect between even/odd words
                        }}
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.div>
        );
    }

    if (type === 'slide') {
        return (
            <motion.div ref={ref} className={clsx("overflow-hidden", className)}>
                {words.map((word, i) => (
                    <motion.span
                        key={i}
                        className="inline-block mr-2"
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ margin: "-10% 0px -10% 0px" }} // Trigger slightly inside viewport
                        transition={{ 
                            delay: i * 0.03, // Cascading delay
                            duration: 0.5, 
                            ease: [0.33, 1, 0.68, 1] 
                        }}
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.div>
        );
    }

    if (type === 'fade') {
         // High-performance opacity reveal
         return (
            <motion.p 
                ref={ref}
                className={className}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8 }}
            >
                {text}
            </motion.p>
        );
    }

    // Default static
    return <p className={className}>{text}</p>;
};

export default KineticText;
