import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number; // Delay in seconds before the animation starts
  scrambleSpeed?: number; // Speed of scrambles in ms
}

const GLYPHS = '01XYZ$#@[]<>_-+=*%!';

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  scrambleSpeed = 30,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let scrambleInterval: any;
    let resolveTimeout: any;

    const startAnimation = () => {
      setIsAnimating(true);
      let iterations = 0;
      const totalLength = text.length;

      scrambleInterval = setInterval(() => {
        setDisplayText(() => {
          return text
            .split('')
            .map((char, index) => {
              // If the character is space, keep it
              if (char === ' ') return ' ';
              
              // If we have resolved up to this index, show correct character
              if (index < iterations) {
                return text[index];
              }
              
              // Scramble character
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join('');
        });

        // Resolve one character per scramble cycle
        iterations += 1 / 3; // Solves 1 char every 3 cycles for smooth transition

        if (iterations >= totalLength) {
          setDisplayText(text);
          clearInterval(scrambleInterval);
          setIsAnimating(false);
        }
      }, scrambleSpeed);
    };

    // Apply startup delay
    resolveTimeout = setTimeout(() => {
      startAnimation();
    }, delay * 1000);

    return () => {
      clearInterval(scrambleInterval);
      clearTimeout(resolveTimeout);
    };
  }, [text, delay, scrambleSpeed]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay }}
      className={`${className} font-mono`}
    >
      {displayText || (isAnimating ? '' : ' ')}
    </motion.span>
  );
};

export default AnimatedText;
