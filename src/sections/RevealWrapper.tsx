import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface RevealWrapperProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
}

export const RevealWrapper: React.FC<RevealWrapperProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 30,
  threshold = 0.1,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const getDirectionOffset = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return {};
    }
  };

  const initialStyles = {
    opacity: 0,
    ...getDirectionOffset(),
  };

  const animateStyles = {
    opacity: 1,
    x: 0,
    y: 0,
  };

  return (
    <motion.div
      ref={ref}
      initial={initialStyles}
      animate={isInView ? animateStyles : initialStyles}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // Custom fast-responsive cubic bezier
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default RevealWrapper;
