import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedText } from './AnimatedText';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section tracking for active state
      const sections = ['home', 'about', 'projects', 'case-study', 'contact'];
      const scrollPos = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#home', id: 'home' },
    { label: 'ABOUT & SKILLS', href: '#about', id: 'about' },
    { label: 'PROJECTS', href: '#projects', id: 'projects' },
    { label: 'CASE STUDY', href: '#case-study', id: 'case-study' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-cyber-bg/85 backdrop-blur-md border-b border-cyber-border/80 py-3 shadow-md' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand/Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleLinkClick(e, '#home')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-md opacity-30 group-hover:opacity-75 blur transition duration-300"></div>
            <div className="relative bg-cyber-bg border border-cyber-border px-2 py-1 rounded flex items-center justify-center">
              <Terminal className="w-5 h-5 text-neon-cyan group-hover:text-neon-magenta transition-colors" />
            </div>
          </div>
          <span className="font-mono font-bold tracking-widest text-white text-sm sm:text-base">
            <AnimatedText text="ABDERRAHMANE" />
            <span className="text-neon-cyan group-hover:text-neon-magenta transition-colors">.SYS</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * index + 0.1 }}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`font-mono text-xs tracking-wider transition-all duration-200 relative py-1 hover:text-white ${
                activeSection === link.id ? 'text-neon-cyan text-glow-cyan' : 'text-cyber-text'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neon-cyan shadow-[0_0_8px_#00f0ff]" />
              )}
            </motion.a>
          ))}
        </div>


        {/* Systems Status (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-3 bg-cyber-card border border-cyber-border px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wide text-cyber-text">
          <Cpu className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
          <span>SYS_STATUS:</span>
          <span className="flex items-center gap-1.5 text-neon-green text-glow-green">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-ping absolute opacity-75"></span>
            <span className="relative w-2 h-2 rounded-full bg-neon-green"></span>
            ONLINE
          </span>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-cyber-text hover:text-white p-1.5 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-cyber-bg/95 backdrop-blur-lg border-b border-cyber-border/80 transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-80 opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
      }`}>
        <div className="flex flex-col items-center gap-6 px-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`font-mono text-sm tracking-wider transition-all duration-200 ${
                activeSection === link.id ? 'text-neon-cyan text-glow-cyan' : 'text-cyber-text hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-2 bg-cyber-card border border-cyber-border px-4 py-2 rounded font-mono text-xs tracking-wide text-cyber-text w-full justify-center">
            <Cpu className="w-4 h-4 text-neon-cyan" />
            <span>SYS_STATUS:</span>
            <span className="flex items-center gap-1.5 text-neon-green text-glow-green">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green"></span>
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
