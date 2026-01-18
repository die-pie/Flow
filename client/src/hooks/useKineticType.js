import { useRef } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

export const useKineticType = (ref) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth out the scroll value
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 200
  });

  // Calculate distortion values based on scroll position -0.5 to 0.5 range (center is 0)
  const distortion = useTransform(smoothProgress, [0, 0.5, 1], [-50, 0, 50]);
  const skew = useTransform(smoothProgress, [0, 0.5, 1], [-15, 0, 15]);
  const stretch = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  
  // Calculate text split staggering
  // We want the text to "assemble" as it enters from bottom and "disassemble" as it leaves to top
  
  return { distortion, skew, stretch };
};
