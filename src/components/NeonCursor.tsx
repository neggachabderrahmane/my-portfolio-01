import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const NeonCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Position motion values for center dot (instant)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics for outer ring (dampened delay)
  const springConfig = { damping: 28, stiffness: 320, mass: 0.6 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable custom cursor on mobile/touchscreens
    const checkMobile = () => {
      const mobileQuery = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobileQuery);
      if (mobileQuery) {
        document.body.classList.remove('cursor-none');
      } else {
        document.body.classList.add('cursor-none');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Global clickables hover tracking using event delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        target.closest('[data-cursor="pointer"]');

      setIsHovered(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('cursor-none');
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* 1. Inner Neon Cyan Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-neon-cyan rounded-full pointer-events-none z-[999] mix-blend-screen shadow-[0_0_8px_#00f0ff]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* 2. Outer Delayed Glowing Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-[999] mix-blend-screen"
        animate={{
          width: isHovered ? 40 : 20,
          height: isHovered ? 40 : 20,
          borderColor: isHovered ? '#ff0055' : '#00f0ff',
          boxShadow: isHovered 
            ? '0 0 15px rgba(255, 0, 85, 0.6), inset 0 0 8px rgba(255, 0, 85, 0.4)' 
            : '0 0 10px rgba(0, 240, 255, 0.4), inset 0 0 4px rgba(0, 240, 255, 0.2)',
          backgroundColor: isHovered ? 'rgba(255, 0, 85, 0.05)' : 'rgba(0, 240, 255, 0)'
        }}
        transition={{
          type: 'tween',
          ease: 'backOut',
          duration: 0.2
        }}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};

export default NeonCursor;
