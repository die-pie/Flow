import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
// ... imports ...
import { usePersistentLikes } from '../../hooks/usePersistentLikes';
import { useSmartText } from '../../hooks/useSmartText';
import { useReaderTheme } from '../../hooks/useReaderTheme';
import RainBackground from '../atoms/RainBackground';
import FocusLens from '../atoms/FocusLens';
import Portal from '../atoms/Portal';

const ThemeMenu = ({ appearance, setFont, setBackground, setMode, setColor }) => (
    <div 
        className="fixed top-20 left-6 z-[70] bg-zinc-900/95 backdrop-blur-2xl border border-white/10 p-4 rounded-3xl shadow-2xl flex flex-col gap-4 w-64 origin-top-left"
    >
        {/* Row 1: Typography */}
        <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-500 ml-1">Typeface</span>
            <div className="grid grid-cols-3 gap-1 bg-black/20 p-1 rounded-xl">
                {[
                    { id: 'serif', label: 'Ag', font: 'font-serif' },
                    { id: 'sans', label: 'Ag', font: 'font-sans' },
                    { id: 'mono', label: 'Code', font: 'font-mono text-[10px]' }
                ].map(type => (
                    <button
                        key={type.id}
                        onClick={() => setFont(type.id)}
                        className={`h-8 rounded-lg flex items-center justify-center transition-all ${
                            appearance.font === type.id 
                                ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/5' 
                                : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        <span className={`${type.font} text-base`}>{type.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Row 2: Atmosphere */}
        <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-500 ml-1">Ambience</span>
            <div className="grid grid-cols-3 gap-1 bg-black/20 p-1 rounded-xl">
                {[
                    { id: 'aurora', label: 'Aurora' },
                    { id: 'rain', label: 'Rain' },
                    { id: 'none', label: 'Clean' }
                ].map(bg => (
                    <button
                        key={bg.id}
                        onClick={() => setBackground(bg.id)}
                        className={`h-8 rounded-lg flex items-center justify-center text-[11px] font-medium transition-all ${
                            appearance.background === bg.id 
                                ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/5' 
                                : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        {bg.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Row 3: Lighting */}
         <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-500 ml-1">Lighting</span>
            <div className="grid grid-cols-2 gap-1 bg-black/20 p-1 rounded-xl">
                {[
                    { id: 'light', label: 'Day', icon: (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                    )},
                    { id: 'dark', label: 'Night', icon: (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    )}
                ].map(mode => (
                    <button
                        key={mode.id}
                        onClick={() => setMode(mode.id)}
                        className={`h-8 rounded-lg flex items-center justify-center gap-2 text-[11px] font-medium transition-all ${
                            appearance.mode === mode.id 
                                ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/5' 
                                : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        {mode.icon}
                        {mode.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Row 4: Mint (Tint) */}
        <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-500 ml-1">Tint</span>
            <div className="flex bg-black/20 p-2 rounded-xl gap-3 justify-around">
                {[
                    { id: 'rose', bg: 'bg-rose-600' },
                    { id: 'amber', bg: 'bg-amber-600' },
                    { id: 'blue', bg: 'bg-blue-500' },
                    { id: 'emerald', bg: 'bg-emerald-600' }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setColor(t.id)}
                        className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${t.bg} ${appearance.color === t.id ? 'ring-2 ring-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'opacity-80 hover:opacity-100 ring-1 ring-white/10'}`}
                        aria-label={`Set tint to ${t.id}`}
                    />
                ))}
            </div>
        </div>
    </div>
);

const THEME_PALETTES = {
  rose: {
    blobs: ['#be123c', '#fb7185', '#ffe4e6'],
    rainDark: ['#f43f5e', '#fda4af'],
    rainLight: ['#881337', '#fb7185'], // Dark Crimson / Soft Red
    wash: 'rgba(225, 29, 72, 0.05)'
  },
  amber: {
    blobs: ['#b45309', '#fbbf24', '#fef3c7'],
    rainDark: ['#d97706', '#fcd34d'],
    rainLight: ['#78350f', '#b45309'], // Deep Saddle Brown / Amber
    wash: 'rgba(217, 119, 6, 0.05)'
  },
  blue: {
    blobs: ['#1d4ed8', '#60a5fa', '#dbeafe'],
    rainDark: ['#3b82f6', '#93c5fd'],
    rainLight: ['#1e3a8a', '#2563eb'], // Navy / Royal Blue
    wash: 'rgba(37, 99, 235, 0.05)'
  },
  emerald: {
    blobs: ['#047857', '#34d399', '#d1fae5'],
    rainDark: ['#10b981', '#6ee7b7'],
    rainLight: ['#064e3b', '#059669'], // Dark Green / Emerald
    wash: 'rgba(5, 150, 105, 0.05)'
  }
};

const AuroraBlobs = ({ progress, blobs }) => {
    const backgroundHue = useTransform(progress, [0, 1], [0, 60]); 
    
    return (
        <motion.div 
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden" 
            style={{ 
                background: 'var(--bg-primary)', 
                filter: useTransform(backgroundHue, h => `hue-rotate(${h}deg)`) 
            }}
        >
            <motion.div
                className="absolute top-1/2 left-1/2 w-[150vmax] h-[150vmax] origin-center"
                style={{ 
                    x: "-50%", 
                    y: "-50%",
                    willChange: "transform" 
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute top-0 left-0 w-[80vmax] h-[80vmax] rounded-full blur-[120px] mix-blend-screen opacity-50" style={{ backgroundColor: blobs[0] }} />
                <div className="absolute bottom-0 right-0 w-[80vmax] h-[80vmax] rounded-full blur-[120px] mix-blend-screen opacity-50" style={{ backgroundColor: blobs[1] }} />
                <div className="absolute top-[20%] right-[10%] w-[60vmax] h-[60vmax] rounded-full blur-[100px] mix-blend-screen opacity-50" style={{ backgroundColor: blobs[2] }} />
            </motion.div>
        </motion.div>
    );
};

const BackgroundManager = ({ background, progress, blobs, rain, isLightMode }) => {
    return (
        <AnimatePresence mode="wait">
            {background === 'aurora' && (
                <motion.div 
                    key="aurora"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
                    <AuroraBlobs progress={progress} blobs={blobs} />
                </motion.div>
            )}
            {background === 'rain' && (
                <motion.div 
                    key="rain"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0 bg-[var(--bg-primary)]"
                >
                    <RainBackground palette={rain} isLightMode={isLightMode} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ReaderView = ({ post, onClose }) => {
  if (!post) return null;
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false); // Track if container is mounted
  const [isDragging, setIsDragging] = useState(false);
  const [explosions, setExplosions] = useState([]);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [focusHeight, setFocusHeight] = useState(192);
  
  const { likes, isLineLiked, toggleLike } = usePersistentLikes();
  const { appearance, setFont, setBackground, setMode, setColor } = useReaderTheme();

  // Helper to sync ref and state for hydration
  const onRefChange = useCallback((node) => {
      if (node) {
          containerRef.current = node;
          setIsReady(true);
      }
  }, []);
  
  const { scrollYProgress: totalProgress } = useScroll({
    container: containerRef
  });

  // Dynamic Lens Sizing
  useEffect(() => {
      const checkFocus = () => {
           const centerY = window.innerHeight / 2;
           const centerX = window.innerWidth / 2;
           
           const elements = document.elementsFromPoint(centerX, centerY);
           const target = elements.find(el => el.hasAttribute && el.hasAttribute('data-line-id')) 
                        || elements.find(el => el.closest && el.closest('[data-line-id]'))?.closest('[data-line-id]');
           
           if (target) {
               const textNode = target.querySelector('p') || target.querySelector('h1');
               if (textNode) {
                  const h = textNode.getBoundingClientRect().height;
                  setFocusHeight(Math.max(120, h + 80)); 
               }
           }
      };

      const container = containerRef.current;
      if (container) {
          container.addEventListener('scroll', checkFocus, { passive: true });
          checkFocus(); 
      }
      return () => container?.removeEventListener('scroll', checkFocus);
  }, [post, isReady]);

  const handleLineDoubleTap = (lineId, x, y) => {
      let content = "";
      if (lineId === 'line-title') content = post.title;
      else {
          const index = parseInt(lineId.replace('line-', ''));
          const sentences = post.content ? post.content.match(/[^.!?]+[.!?]+|\n+|.+$/g) || [post.content] : [];
          content = sentences[index]?.trim();
      }

      const alreadyLiked = isLineLiked(post._id, lineId);
      toggleLike(post, lineId, content);
      if (!alreadyLiked) {
          setExplosions(prevExp => [...prevExp, { id: Date.now(), x, y }]);
      }
  };

  const removeExplosion = (id) => setExplosions(prev => prev.filter(e => e.id !== id));

  const scrollToLine = (index) => {
      const targetId = index.toString().startsWith('line-') ? index : `line-${index}`;
      const el = document.getElementById(targetId); 
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const formatIndex = (idx) => idx === 'line-title' ? -1 : parseInt(idx.replace('line-', ''));

  const currentPostLikes = likes
    .filter(l => l.sourcePostId === post._id)
    .map(l => ({ index: l.lineIndex, content: l.text }))
    .sort((a,b) => formatIndex(a.index) - formatIndex(b.index));

  useEffect(() => {
      if (post && (post.initialScrollIndex !== undefined && post.initialScrollIndex !== null)) {
          setTimeout(() => scrollToLine(post.initialScrollIndex), 600);
      }
  }, [post]);

  const sentences = useSmartText(post.content);

  // Compute Root Styles
  const isTransparent = appearance.background !== 'none';
  const rootClasses = `fixed inset-0 z-50 transition-colors duration-700 ease-in-out ${isTransparent && appearance.background !== 'rain' ? 'bg-transparent' : 'bg-[var(--bg-primary)]'} text-[var(--text-primary)]`;

  // Palette Logic
  const activePalette = THEME_PALETTES[appearance.color] || THEME_PALETTES.blue;
  const isLight = appearance.mode === 'light';
  const currentRain = isLight ? activePalette.rainLight : activePalette.rainDark;

  // Map Font
  const fontMap = { serif: 'font-serif', sans: 'font-sans', mono: 'font-mono' };
  const fontClass = fontMap[appearance.font] || 'font-serif';

  return (
    <motion.div 
        className={rootClasses}
        data-mode={appearance.mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        {/* Background Wash */}
        <div 
            className="fixed inset-0 z-0 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: activePalette.wash }}
        />

        {/* Background Manager */}
        <BackgroundManager 
            background={appearance.background} 
            progress={totalProgress} 
            blobs={activePalette.blobs}
            rain={currentRain}
            isLightMode={isLight}
        />
        
        {/* Focus Lens */}
        <FocusLens isVisible={true} height={focusHeight} accentColor={activePalette.rainDark[0]} />
        
        {/* Theme Button */}
        <button 
            className="fixed top-6 left-6 z-50 w-12 h-12 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all group shadow-xl"
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            aria-label="Toggle Theme"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-white transition-colors">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
        </button>

        <Portal>
             <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isThemeMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/10" onClick={() => setIsThemeMenuOpen(false)} />
                <ThemeMenu 
                    appearance={appearance}
                    setFont={setFont}
                    setBackground={setBackground}
                    setMode={setMode}
                    setColor={setColor}
                    onClose={() => setIsThemeMenuOpen(false)} 
                />
            </div>
        </Portal>

        {/* Main Scroll Container */}
        <div 
            ref={onRefChange}
            className="relative z-10 h-full w-full overflow-y-scroll scroll-auto no-scrollbar select-none"
            style={{ scrollSnapType: isDragging ? 'none' : 'y mandatory' }}
        >
             {isReady && (
                <div className="py-[50vh]">
                    <div className="mb-32">
                        <FocusLine 
                            id="line-title"
                            className="mb-12" 
                            rootContainer={containerRef}
                            isLiked={isLineLiked(post._id, 'line-title')}
                            fontClass={fontClass}
                        >
                            <motion.h1 
                                className="text-4xl md:text-6xl font-bold leading-tight text-current opacity-90"
                                style={{ filter: 'var(--tw-blur)' }}
                            >
                                {post.title}
                            </motion.h1>
                        </FocusLine>
                    </div>

                    {sentences.map((sentence, i) => (
                        <FocusLine 
                            key={i} 
                            id={`line-${i}`}
                            rootContainer={containerRef}
                            isLiked={isLineLiked(post._id, `line-${i}`)}
                            fontClass={fontClass}
                        >
                            {sentence.trim()}
                        </FocusLine>
                    ))}
                </div>
            )}
        </div>

        <InteractionOverlay 
            containerRef={containerRef} 
            onLineDoubleTap={handleLineDoubleTap}
            onDragChange={setIsDragging}
        />

        <ReadingProgress progress={totalProgress} />
        
        <button 
            onClick={onClose}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl hover:bg-white/20 hover:scale-105 active:scale-95 transition-all text-current group"
            aria-label="Exit Reader"
        >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 group-hover:opacity-100 transition-opacity">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        
        <JumpToFavorites likedLines={currentPostLikes} onJump={scrollToLine} />
        
        {explosions.map(exp => (
            <LineLikeExplosion 
                key={exp.id} 
                x={exp.x} 
                y={exp.y} 
                onComplete={() => removeExplosion(exp.id)} 
            />
        ))}

    </motion.div>
  );
};


const LineLikeExplosion = ({ x, y, onComplete }) => {
  return (
    <div className="pointer-events-none fixed z-50" style={{ left: x, top: y }}>
        <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
                scale: [0, 1.5, 1],
                rotate: [0, -15, 0],
                opacity: [1, 1, 0] // Fade out at the very end
            }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]"
            onAnimationComplete={() => setTimeout(onComplete, 100)} 
        >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </motion.div>
        
        {/* Confetti Dots */}
        {Array.from({ length: 8 }).map((_, i) => (
             <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                    x: Math.cos((i / 8) * Math.PI * 2) * 80,
                    y: Math.sin((i / 8) * Math.PI * 2) * 80,
                    scale: [1, 0],
                    opacity: [1, 0]
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
             />
        ))}
    </div>
  );
};

// FocusLine Component: Independent physics for every line
const FocusLine = ({ children, className = "", rootContainer, id, isLiked, fontClass = "font-serif" }) => {
  const ref = useRef(null);

  // Track the center of the element relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    container: rootContainer,
    offset: ["center end", "center start"]
  });

  // "Shock Absorber" Physics - Faster/Snappier (30% boost)
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.15,
    stiffness: 150, 
    damping: 20,
    restDelta: 0.001
  });

  // Interpolation Logic
  // Zoom: 0.9 (inactive) -> 1.15 (active) = Distinct Pop
  const scale = useTransform(smoothProgress, [0.25, 0.5, 0.75], [0.9, 1.15, 0.9]);
  // Significantly reduced blur to fix "blurry text" issues
  const blurFilter = useTransform(smoothProgress, [0.3, 0.5, 0.7], ["blur(0.5px)", "blur(0px)", "blur(0.5px)"]);
  const opacity = useTransform(smoothProgress, [0.25, 0.5, 0.75], [0.6, 1, 0.6]);

  // Dynamic Typography Calculation
  const textLength = typeof children === 'string' ? children.length : 0;
  
  let typographyClass = "";
  if (textLength < 60) {
      // Short & Impactful (Headline)
      typographyClass = "text-4xl md:text-6xl font-bold leading-tight tracking-tight";
  } else if (textLength < 150) {
      // Standard (Body)
      typographyClass = "text-2xl md:text-4xl font-medium leading-normal";
  } else {
      // Long (Dense)
      typographyClass = "text-xl md:text-3xl leading-relaxed";
  }

  return (
    <div
      ref={ref}
      id={id}
      data-line-id={id}
      className={`snap-center origin-center py-12 flex flex-col justify-center items-center gap-6 ${className} group relative w-full`} 
    >
      {/* Animated Text Layer */}
      <motion.div
        style={{ 
            scale, 
            opacity, 
            filter: blurFilter,
            willChange: "transform, filter, opacity"
        }}
        className="max-w-4xl px-4 select-none"
      >
          <p className={`${fontClass} text-center ${typographyClass} transition-all duration-300`}>
            {children}
          </p>
      </motion.div>
      
      {/* Persisted Like Icon */}
      <AnimatePresence>
          {isLiked && (
              <motion.div
                style={{ 
                    opacity, 
                    filter: blurFilter 
                }}
                initial={{ scale: 0, y: -10 }}
                animate={{ scale: [0, 1.5, 1], y: 0 }}
                exit={{ scale: 0, y: -10 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 15 }}
                className="flex items-center justify-center pointer-events-none"
              >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

const ReadingProgress = ({ progress }) => {
  const [pct, setPct] = useState(0);
  
  useMotionValueEvent(progress, "change", (latest) => {
    // Normalize: Assume the first 5% is the "focus-in" zone. Reach 100% slightly before the absolute bottom.
    const normalized = Math.max(0, (latest - 0.05) / 0.90);
    setPct(Math.min(100, Math.round(normalized * 100)));
  });

  const isComplete = pct === 100;

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
      <div className="relative flex items-center justify-center w-16 h-16 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full shadow-2xl transition-transform hover:scale-125 scale-110 pointer-events-auto">
        
        {/* SVG Progress Ring */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="rotate-[-90deg] absolute inset-0">
          <circle cx="32" cy="32" r="28" stroke="#333" strokeOpacity="0.5" strokeWidth="2" fill="none" />
          <motion.circle 
            cx="32" cy="32" r="28" 
            stroke="var(--accent-color)" 
            strokeWidth="2" 
            fill="none"
            pathLength={progress}
            strokeLinecap="round"
            style={{ pathLength: progress }}
            className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          />
        </svg>

        {/* Center Content: Number or Checkmark */}
        <div className="z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
                {!isComplete ? (
                    <motion.span 
                        key="percent"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="text-xs font-mono font-bold text-white/90"
                    >
                        {pct}%
                    </motion.span>
                ) : (
                    <motion.svg 
                        key="check"
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="text-[var(--accent-color)] drop-shadow-lg"
                    >
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const JumpToFavorites = ({ likedLines, onJump }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewedCount, setViewedCount] = useState(0);
    
    // Filter dirty data (e.g. raw IDs from old bugs)
    const validLines = likedLines.filter(l => 
        l.content && 
        !l.content.match(/^line-\d+$/) && 
        l.content !== 'line-title'
    );
    
    const unseenCount = Math.max(0, validLines.length - viewedCount);

    if (validLines.length === 0) return null;

    return (
        <div className="fixed bottom-8 left-8 z-50">
             <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-20 left-0 mb-2 w-72 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden origin-bottom-left"
                    >
                        <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                            {validLines.map((line, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        onJump(line.index);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition-colors group flex gap-3 items-start"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-500 shrink-0 mt-0.5">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <p className="text-sm text-white/90 font-medium leading-snug line-clamp-2">
                                        {line.content}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
             </AnimatePresence>

            <button 
                onClick={() => {
                    if (!isOpen) setViewedCount(validLines.length); 
                    setIsOpen(!isOpen);
                }}
                className="w-16 h-16 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
            >
                <div className="relative">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:scale-110 transition-transform">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    {unseenCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-lg ring-2 ring-zinc-900">
                            {unseenCount}
                        </span>
                    )}
                </div>
            </button>
        </div>
    );
};


const AmbientBackground = ({ progress }) => {
    const backgroundHue = useTransform(progress, [0, 1], [0, 60]); 
    
    return (
        <motion.div 
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]"
            style={{ 
                filter: useTransform(backgroundHue, h => `hue-rotate(${h}deg)`) 
            }}
        >
            {/* Rotating Mesh Container - GPU Accelerated 
                We use a large container (200vw) centered and rotating.
                'will-change: transform' ensures it's promoted to a layer.
            */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-[150vmax] h-[150vmax] origin-center"
                style={{ 
                    x: "-50%", 
                    y: "-50%",
                    willChange: "transform" 
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }} // Very slow rotation
            >
                {/* Static Blobs (Cheaper than animating each one) */}
                <div className="absolute top-0 left-0 w-[80vmax] h-[80vmax] bg-blue-900/40 rounded-full blur-[120px] mix-blend-screen opacity-50" />
                <div className="absolute bottom-0 right-0 w-[80vmax] h-[80vmax] bg-indigo-900/40 rounded-full blur-[120px] mix-blend-screen opacity-50" />
                <div className="absolute top-[20%] right-[10%] w-[60vmax] h-[60vmax] bg-purple-900/30 rounded-full blur-[100px] mix-blend-screen opacity-50" />
            </motion.div>
        </motion.div>
    );
};

const InteractionOverlay = ({ containerRef, onLineDoubleTap, onDragChange }) => {
  const isDown = useRef(false);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const lastClickTime = useRef(0);
  const clickStartPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    e.preventDefault(); // Stop native text selection / drag behavior
    
    // Check for interactive elements below overlay
    e.target.style.pointerEvents = 'none';
    const targetUnderneath = document.elementFromPoint(e.clientX, e.clientY);
    e.target.style.pointerEvents = '';
    
    // Jump Menu / Buttons check
    if (targetUnderneath && (targetUnderneath.closest('button') || targetUnderneath.closest('a'))) {
        targetUnderneath.click();
        return; 
    }

    isDown.current = true;
    isDragging.current = false;
    startY.current = e.clientY;
    startScrollTop.current = containerRef.current ? containerRef.current.scrollTop : 0;
    clickStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    // Safety Valve: If no button is pressed, stop everything.
    if (e.buttons === 0) {
        if (isDown.current || isDragging.current) {
            isDown.current = false;
            isDragging.current = false;
            onDragChange(false);
            document.body.style.cursor = '';
        }
        return;
    }

    if (!isDown.current || !containerRef.current) return;
    
    e.preventDefault();
    const currentY = e.clientY;
    const moveDistTotal = Math.hypot(e.clientX - clickStartPos.current.x, e.clientY - clickStartPos.current.y);

    // Threshold Check: Only start dragging if moved > 5px
    if (!isDragging.current) {
        if (moveDistTotal > 5) {
            isDragging.current = true;
            onDragChange(true);
            document.body.style.cursor = 'grabbing';
        }
    }

    if (isDragging.current) {
        const deltaY = currentY - startY.current;
        containerRef.current.scrollTop = startScrollTop.current - deltaY;
    }
  };

  const handlePointerUp = (e) => {
    isDown.current = false;

    if (isDragging.current) {
        isDragging.current = false;
        onDragChange(false);
        document.body.style.cursor = '';
        return;
    }

    // If we are here, it was a TAP (Clean Release without Drag)
    
    const now = Date.now();
    if (now - lastClickTime.current < 300) {
        // Double Tap Logic
        e.target.style.pointerEvents = 'none'; // Temporarily disable overlay pointer events
        const targetUnderneath = document.elementFromPoint(e.clientX, e.clientY); // Find what's underneath
        e.target.style.pointerEvents = ''; // Restore overlay
        
        const lineWrapper = targetUnderneath?.closest('[data-line-id]');
        if (lineWrapper) {
            onLineDoubleTap(lineWrapper.dataset.lineId, e.clientX, e.clientY);
        }
    }
    lastClickTime.current = now;
  };

  const handleWheel = (e) => {
      if (containerRef.current) {
          containerRef.current.scrollTop += e.deltaY;
      }
  };

  const handleKeyDown = (e) => {
      if (!containerRef.current) return;
      const step = 300; // Step size for arrow keys
      if (e.key === 'ArrowDown') {
          e.preventDefault();
          containerRef.current.scrollBy({ top: step, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          containerRef.current.scrollBy({ top: -step, behavior: 'smooth' });
      }
  };

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
        className="fixed inset-0 z-40 cursor-grab touch-none"
        onPointerDown={handlePointerDown}
        onWheel={handleWheel}
    />
  );
};



export default ReaderView;
