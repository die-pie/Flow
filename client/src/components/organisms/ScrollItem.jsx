import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import clsx from 'clsx';
import KineticText from '../molecules/KineticText';

const ScrollItem = ({ data, isActive, onOpen }) => {
  const { ref, inView } = useInView({
    threshold: 0.6, // Trigger when 60% visible
    triggerOnce: false
  });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  // Dynamic variants based on post type (placeholder for now)
  const variants = {
    hidden: { opacity: 0.5, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } // Apple-like ease
    }
  };

  const isImage = data.type === 'image';

  return (
    <section 
        ref={ref}
        className="snap-center h-screen w-full flex items-center justify-center relative overflow-hidden bg-transparent py-10" 
    >
      {/* Background Image Layer (Optional, subtle blend) */}
      {isImage && (
        <motion.div 
            className="absolute inset-0 z-0 opacity-20 dark:opacity-40" 
            animate={inView ? { scale: 1.1 } : { scale: 1.0 }}
            transition={{ duration: 10, ease: "linear" }}
        >
            <img 
                src={data.mediaUrl} 
                alt={data.title} 
                className="w-full h-full object-cover blur-sm" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/80 to-transparent" />
        </motion.div>
      )}

      {/* Content Layer - Premium Glass Card */}
      <motion.div 
        className="z-10 relative w-full max-w-2xl mx-6 p-8 md:p-12 
                   bg-white/70 dark:bg-black/60 
                   backdrop-blur-xl 
                   rounded-[2rem] 
                   border border-white/40 dark:border-white/10
                   shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] 
                   drop-shadow-2xl 
                   cursor-pointer 
                   hover:scale-[1.02] transition-transform duration-500 ease-out 
                   group overflow-hidden"
        initial="hidden"
        animate={controls}
        variants={variants}
        onClick={() => onOpen && onOpen(data)}
      >
        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none" />

        {/* Metadata Badges */}
        <div className="flex justify-center gap-3 mb-8 relative z-30">
            <span className="px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider backdrop-blur-md border border-black/5 dark:border-white/5">
                {Math.max(1, Math.round((data.content?.split(' ').length || 0) / 200))} min read
            </span>
            {data.type && (
                <span className="px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider backdrop-blur-md border border-black/5 dark:border-white/5">
                    {data.type}
                </span>
            )}
        </div>

        {/* Title */}
        <motion.h2 
            layoutId={`title-${data._id}`}
            className="mb-6 text-center block relative z-30"
        >
            <KineticText 
                text={data.title}
                type={data.typography?.animationType || 'slide'}
                className="text-4xl md:text-6xl font-sans font-bold tracking-tighter leading-none text-zinc-900 dark:text-white drop-shadow-sm"
            />
        </motion.h2>

        {/* Truncated Teaser Content */}
        {data.content && (
            <div className="relative z-30">
                <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed line-clamp-3 text-center px-4 font-medium">
                     {data.content}
                </p>
            </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 flex flex-col items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500 relative z-30">
            <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-[0.3em]">Read Article</span>
            <div className="w-1 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
        </div>

      </motion.div>
    </section>
  );
};

export default ScrollItem;
