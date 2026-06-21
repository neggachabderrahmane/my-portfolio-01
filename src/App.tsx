import React from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { AboutSkills } from './sections/AboutSkills';
import { Projects } from './sections/Projects';
import { CaseStudy } from './sections/CaseStudy';
import { Contact } from './sections/Contact';
import { NeonCursor } from './components/NeonCursor';
import { SystemLog } from './components/SystemLog';
import { TerminalOverlay } from './components/TerminalOverlay';

export const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-cyber-bg text-cyber-text overflow-hidden select-none">
      {/* Custom User Interactions */}
      <NeonCursor />
      <SystemLog />
      <TerminalOverlay />

      {/* Background Interactive Animation */}
      <ParticleBackground />

      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Structural Layout */}
      <main className="relative z-10 max-w-7xl mx-auto">
        <Hero />
        <AboutSkills />
        <Projects />
        <CaseStudy />
        <Contact />
      </main>

      {/* Global Footer */}
      <footer className="relative z-10 border-t border-cyber-border/80 bg-cyber-bg/90 py-8 font-mono text-[10px] text-cyber-text text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            &copy; {new Date().getFullYear()} ABDERRAHMANE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neon-cyan hover:underline cursor-pointer">SECURITY_COMPLIANCE</span>
            <span>|</span>
            <span className="text-neon-magenta hover:underline cursor-pointer">LATENCY: 12ms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
