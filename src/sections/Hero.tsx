import React, { useState, useEffect } from 'react';
import { Terminal, Shield, ArrowDown, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedText } from '../components/AnimatedText';

const TERMINAL_LOGS = [
  'CONNECTING TO SYSTEM_NODE_01... OK',
  'DECRYPTING PORTFOLIO_MANIFEST... SECURE',
  'MOUNTING SYSTEM_DRIVES (HTML, CSS, JS, REACT, NODE, FLUTTER, MONGO)... DONE',
  'INITIALIZING SECURE SOCKETS & ANALYTICS... STABLE',
  'USER: ABDERRAHMANE (SENIOR CORE SYSTEM DEVELOPER).',
  'LOGS STATUS: ALL ARCHITECTURES OPERATIONAL.'
];

export const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'COMPLEX_SYSTEMS_ENGINEER // FULL-STACK_DEVELOPER';
  
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Parallax Scroll Transforms
  const { scrollY } = useScroll();
  const cyanY = useTransform(scrollY, [0, 1000], [0, 200]);
  const magentaY = useTransform(scrollY, [0, 1000], [0, -150]);

  // Typing effect for subtitle

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Cascading terminal logs
  useEffect(() => {
    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < TERMINAL_LOGS.length) {
        setTerminalLogs((prev) => [...prev, TERMINAL_LOGS[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 450);

    return () => clearInterval(logInterval);
  }, []);


  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden grid-bg"
    >
      {/* Visual Ambient Overlay */}
      {/* Visual Parallax Ambient Overlays */}
      <motion.div style={{ y: cyanY }} className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-neon-cyan/5 rounded-full filter blur-[100px] pointer-events-none"></motion.div>
      <motion.div style={{ y: magentaY }} className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-neon-magenta/5 rounded-full filter blur-[100px] pointer-events-none"></motion.div>

      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-12 items-center z-10">
        
        {/* Text Area */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded font-mono text-[10px] text-neon-cyan tracking-widest uppercase">
            <Shield className="w-3.5 h-3.5" /> SECURE_ENV_LOADED
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            DECODE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-magenta text-glow-cyan">
              <AnimatedText text="COMPLEXITY" delay={0.2} />
            </span>
          </h1>

          <div className="font-mono text-xs sm:text-sm tracking-wider text-neon-cyan h-6 cursor-blink font-semibold">
            {typedText}
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-cyber-text text-base sm:text-lg max-w-lg leading-relaxed font-sans"
          >
            Architecting robust, scalable backends and fluid frontend applications. 
            Bridging the gap between complex enterprise microservices, real-time sync systems, 
            and pixel-perfect, highly-responsive user interfaces.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={() => handleScrollTo('#case-study')}
              className="px-6 py-3 font-mono text-xs font-bold tracking-wider text-white bg-neon-magenta border border-neon-magenta rounded-sm shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:shadow-[0_0_25px_rgba(255,0,85,0.7)] hover:bg-transparent hover:text-neon-magenta transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              EXPLORE CASE STUDY
            </button>
            <button
              onClick={() => handleScrollTo('#projects')}
              className="px-6 py-3 font-mono text-xs font-bold tracking-wider text-neon-cyan bg-transparent border border-neon-cyan/40 rounded-sm hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:bg-neon-cyan/5 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              PROJECT SHOWCASE
            </button>
          </motion.div>
        </motion.div>

        {/* Terminal/Log Window Mock */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex-1 w-full max-w-md bg-cyber-card/90 border border-cyber-border rounded-lg shadow-2xl relative overflow-hidden scanlines"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-cyber-bg border-b border-cyber-border">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyber-text">
              <Terminal className="w-3.5 h-3.5 text-neon-cyan" />
              <span>bash - abderrahmane@complex-system</span>
            </div>
            <div className="w-6" /> {/* spacer */}
          </div>

          {/* Body */}
          <div className="p-5 font-mono text-[11px] text-slate-300 space-y-2 h-[220px] overflow-y-auto text-left select-none">
            <div className="text-cyber-text">$ initialize --portfolio</div>
            {terminalLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-1.5 transition-opacity duration-300">
                <ChevronRight className="w-3.5 h-3.5 text-neon-cyan flex-shrink-0 mt-0.5" />
                <span className={log && (log.includes('OK') || log.includes('DONE') || log.includes('STABLE')) ? 'text-neon-cyan' : log && log.includes('SECURE') ? 'text-neon-green' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
            {terminalLogs.length < TERMINAL_LOGS.length && (
              <div className="w-2.5 h-4 bg-neon-cyan animate-pulse mt-1"></div>
            )}
          </div>
        </motion.div>

      </div>

      {/* Down Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={() => handleScrollTo('#about')}
        className="absolute bottom-8 cursor-pointer group flex flex-col items-center gap-1.5 z-10"
      >
        <span className="font-mono text-[9px] tracking-widest text-cyber-text group-hover:text-neon-cyan transition-colors">
          SCROLL TO COMMENCE
        </span>
        <ArrowDown className="w-4 h-4 text-cyber-text group-hover:text-neon-cyan group-hover:translate-y-1 transition-all duration-300" />
      </motion.div>
    </section>
  );
};
export default Hero;
