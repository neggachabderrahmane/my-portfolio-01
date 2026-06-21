import React from 'react';
import { Cpu, Shield, Brain, Layers, Database, Code, Smartphone, Globe, Palette } from 'lucide-react';
import { RevealWrapper } from '../components/RevealWrapper';

interface Skill {
  name: string;
  level: string;
  icon: React.ReactNode;
  colorClass: string;
  details: string[];
}

export const AboutSkills: React.FC = () => {
  const skills: Skill[] = [
    {
      name: 'HTML5',
      level: 'Expert',
      icon: <Globe className="w-5 h-5" />,
      colorClass: 'text-orange-500 border-orange-500/20 hover:border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.05)] hover:shadow-[0_0_12px_rgba(249,115,22,0.2)]',
      details: ['Semantic Document Structure', 'SEO Best Practices', 'A11y (WCAG) Compliance', 'Web Components API']
    },
    {
      name: 'CSS3',
      level: 'Expert',
      icon: <Palette className="w-5 h-5" />,
      colorClass: 'text-blue-500 border-blue-500/20 hover:border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.05)] hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]',
      details: ['Flexbox / CSS Grid', 'Custom Layout Architectures', 'Tailwind / Tailwind v4', 'Animations & Transitions']
    },
    {
      name: 'JavaScript',
      level: 'Expert',
      icon: <Code className="w-5 h-5" />,
      colorClass: 'text-yellow-500 border-yellow-500/20 hover:border-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.05)] hover:shadow-[0_0_12px_rgba(234,179,8,0.2)]',
      details: ['ES6+ Syntax Standards', 'Asynchronous Promises & Event Loops', 'DOM & BOM Manipulations', 'Canvas API Graphics']
    },
    {
      name: 'React.js',
      level: 'Advanced',
      icon: <Code className="w-5 h-5" />,
      colorClass: 'text-neon-cyan border-neon-cyan/20 hover:border-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.05)] hover:shadow-[0_0_12px_rgba(0,240,255,0.2)]',
      details: ['Redux / Context API', 'Vite / Next.js', 'Custom Performance Hooks', 'State Reconciliation']
    },
    {
      name: 'Node.js',
      level: 'Advanced',
      icon: <Cpu className="w-5 h-5" />,
      colorClass: 'text-neon-magenta border-neon-magenta/20 hover:border-neon-magenta shadow-[0_0_8px_rgba(255,0,85,0.05)] hover:shadow-[0_0_12px_rgba(255,0,85,0.2)]',
      details: ['Express / NestJS frameworks', 'Real-time WebSockets Server', 'Microservices Engineering', 'Asynchronous Router Middlewares']
    },
    {
      name: 'Flutter',
      level: 'Intermediate',
      icon: <Smartphone className="w-5 h-5" />,
      colorClass: 'text-neon-yellow border-neon-yellow/20 hover:border-neon-yellow shadow-[0_0_8px_rgba(255,234,0,0.05)] hover:shadow-[0_0_12px_rgba(255,234,0,0.2)]',
      details: ['Cross-platform Engine', 'Bloc / Provider State', 'Offline Sync Transactions', 'Hardware Native Integrations']
    },
    {
      name: 'MongoDB',
      level: 'Advanced',
      icon: <Database className="w-5 h-5" />,
      colorClass: 'text-neon-green border-neon-green/20 hover:border-neon-green shadow-[0_0_8px_rgba(57,255,20,0.05)] hover:shadow-[0_0_12px_rgba(57,255,20,0.2)]',
      details: ['Geospatial indexing (2dsphere)', 'Aggregation Queries', 'Index Allocations', 'Scalable Replica Set Clusters']
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden border-t border-cyber-border">
      {/* Background grids */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyber-bg grid-bg opacity-40 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <RevealWrapper direction="up" delay={0.1}>
          <div className="mb-16 text-left">
            <span className="font-mono text-xs text-neon-cyan tracking-widest block mb-2 uppercase">
              [SECTION_01] // DETAILED_SPECIFICATION
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              ABOUT & TECHNICAL SPECIFICATION
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-magenta mt-3 rounded-full"></div>
          </div>
        </RevealWrapper>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Bio & Specialties (Left Side) */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <RevealWrapper direction="left" delay={0.2}>
              <div className="space-y-4">
                <h3 className="font-mono text-sm text-white tracking-widest font-bold uppercase">
                  &gt;_ OPERATOR_PROFILE
                </h3>
                <p className="text-cyber-text text-sm sm:text-base leading-relaxed font-sans">
                  My name is **Abderrahmane**. I specialize in analyzing, structuring, and engineering software for **complex systems**. 
                  My background spans designing highly-secure database schemas, query optimizations for real-time geolocation matching, and constructing synchronization protocols.
                </p>
                <p className="text-cyber-text text-sm sm:text-base leading-relaxed font-sans">
                  I combine standard core frontend languages (HTML, CSS, JavaScript) with powerful frameworks (React, Flutter, Node.js) to deliver responsive, visual, and highly functional technical interfaces.
                </p>
              </div>
            </RevealWrapper>

            {/* Interest Areas cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Cybersecurity Card */}
              <RevealWrapper direction="up" delay={0.3}>
                <div className="bg-cyber-card/65 border border-cyber-border p-5 rounded-md hover:border-neon-cyan/40 transition-colors group h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-neon-cyan/10 rounded text-neon-cyan group-hover:bg-neon-cyan group-hover:text-cyber-bg transition-all duration-300">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h4 className="font-mono text-xs font-bold tracking-wider text-white">
                      CYBERSECURITY
                    </h4>
                  </div>
                  <p className="text-cyber-text text-[11px] leading-relaxed font-sans">
                    Defensive secure coding practices: input filtering, session validation, encryption algorithms, and secure channel communication.
                  </p>
                </div>
              </RevealWrapper>

              {/* AI assisted Dev Card */}
              <RevealWrapper direction="up" delay={0.4}>
                <div className="bg-cyber-card/65 border border-cyber-border p-5 rounded-md hover:border-neon-magenta/40 transition-colors group h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-neon-magenta/10 rounded text-neon-magenta group-hover:bg-neon-magenta group-hover:text-cyber-bg transition-all duration-300">
                      <Brain className="w-4 h-4" />
                    </div>
                    <h4 className="font-mono text-xs font-bold tracking-wider text-white">
                      AI_ASSISTED_DEV
                    </h4>
                  </div>
                  <p className="text-cyber-text text-[11px] leading-relaxed font-sans">
                    Accelerating lifecycle velocity with autonomous pipelines, code splitting heuristics, and optimized compilation cycles.
                  </p>
                </div>
              </RevealWrapper>

            </div>
          </div>

          {/* Stack Specification (Right Side) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <RevealWrapper direction="right" delay={0.2}>
              <h3 className="font-mono text-sm text-white tracking-widest font-bold uppercase">
                &gt;_ CORE_CAPABILITIES_GRID
              </h3>
            </RevealWrapper>

            {/* Grid layout containing all 7 skill cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <RevealWrapper 
                  key={skill.name} 
                  direction="up" 
                  delay={0.1 + index * 0.05}
                  threshold={0.05}
                >
                  <div 
                    className={`bg-cyber-card border rounded-md p-5 transition-all duration-300 ${skill.colorClass} group h-full`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-cyber-bg rounded border border-cyber-border group-hover:border-current transition-colors">
                          {skill.icon}
                        </div>
                        <span className="font-bold text-white text-sm">{skill.name}</span>
                      </div>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border uppercase text-cyber-text">
                        {skill.level}
                      </span>
                    </div>

                    <ul className="space-y-1.5 font-mono text-[10px] text-cyber-text">
                      {skill.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-current rounded-full" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealWrapper>
              ))}
            </div>

            {/* Micro details panel */}
            <RevealWrapper direction="up" delay={0.5}>
              <div className="p-4 bg-cyber-card/30 border border-cyber-border/50 rounded font-mono text-[10px] text-cyber-text flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neon-cyan" />
                  <span>INTEGRATION ARCHITECTURE: MODULAR CORE V4</span>
                </div>
                <span className="text-neon-cyan text-glow-cyan font-bold">STABLE</span>
              </div>
            </RevealWrapper>

          </div>

        </div>

      </div>
    </section>
  );
};
export default AboutSkills;
