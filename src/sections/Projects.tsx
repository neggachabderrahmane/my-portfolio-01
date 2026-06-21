import React from 'react';
import { Info, ArrowUpRight, Code, Database, ShieldAlert } from 'lucide-react';
import { RevealWrapper } from '../components/RevealWrapper';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveLink: string;
  detailsId: string; // id to scroll to or open
  highlight: boolean;
  glowClass: string;
  icon: React.ReactNode;
}

export const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      id: 'relizane-fellah',
      title: 'Relizane Fellah',
      description: 'A comprehensive agricultural logistics, resource planning, and distribution platform designed to connect farmers in the Relizane region with local transporters and direct markets.',
      techStack: ['Node.js', 'Express', 'MongoDB', 'Flutter', 'Geospatial Indexing'],
      liveLink: 'https://relizane-fellah.web.app/',
      detailsId: '#case-study',
      highlight: true,
      glowClass: 'glow-magenta-hover border-neon-magenta/25 border-glow-magenta',
      icon: <Database className="w-6 h-6 text-neon-magenta" />
    },
    {
      id: 'aegisnet-detector',
      title: 'AegisNet Anomaly Detector',
      description: 'An intrusion detection system that logs live network traffic and processes packets against lightweight neural networks to classify cybersecurity anomalies and trigger auto-mitigation.',
      techStack: ['React.js', 'Python', 'FastAPI', 'WebSockets', 'Tailwind CSS'],
      liveLink: '#',
      detailsId: '#aegis-details', // Open a mock alert or detail
      highlight: false,
      glowClass: 'glow-cyan-hover border-neon-cyan/20',
      icon: <ShieldAlert className="w-6 h-6 text-neon-cyan" />
    },
    {
      id: 'nexusstream-aggregator',
      title: 'NexusStream Log Engine',
      description: 'A high-throughput telemetry aggregator built for streaming enterprise telemetry. Handles millions of logs per minute with instant text indexes and live analytics dashboards.',
      techStack: ['Go', 'Node.js', 'Redis', 'MongoDB', 'ChartJS'],
      liveLink: '#',
      detailsId: '#nexus-details',
      highlight: false,
      glowClass: 'glow-cyan-hover border-neon-cyan/20',
      icon: <Code className="w-6 h-6 text-neon-cyan" />
    }
  ];

  const handleAction = (e: React.MouseEvent, targetId: string) => {
    if (targetId.startsWith('#')) {
      e.preventDefault();
      
      if (targetId === '#aegis-details') {
        alert('AegisNet Anomaly Detector: Core system includes real-time WebSockets packet monitoring, integrated Python threat classification modules, and React event stream graphs.');
        return;
      }
      if (targetId === '#nexus-details') {
        alert('NexusStream Log Engine: Built to solve high-frequency event ingestion using Redis pub/sub queues and Node.js stream workers. Features custom MongoDB collection partitioning.');
        return;
      }

      const el = document.querySelector(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="projects" className="py-24 relative border-t border-cyber-border">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyber-bg grid-bg opacity-30 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <RevealWrapper direction="up" delay={0.1}>
          <div className="mb-16 text-left">
            <span className="font-mono text-xs text-neon-magenta tracking-widest block mb-2 uppercase">
              [SECTION_02] // SYSTEM_APPLICATIONS
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              PROJECT SHOWCASE
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-neon-magenta to-neon-cyan mt-3 rounded-full"></div>
          </div>
        </RevealWrapper>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <RevealWrapper 
              key={project.id} 
              direction="up" 
              delay={0.15 + index * 0.08}
              threshold={0.1}
            >
              <div
                className={`bg-cyber-card/80 border rounded-lg p-6 flex flex-col justify-between transition-all duration-300 relative h-full ${
                  project.highlight ? 'ring-1 ring-neon-magenta/30 scale-[1.02]' : ''
                } ${project.glowClass}`}
              >
                {/* Highlight Tag */}
                {project.highlight && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 bg-neon-magenta text-white font-mono text-[9px] font-bold tracking-wider rounded uppercase shadow-[0_0_8px_#ff0055]">
                    PRIMARY_SYSTEM_FEATURE
                  </div>
                )}

                {/* Card Upper Section */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-cyber-bg rounded border border-cyber-border">
                      {project.icon}
                    </div>
                    <span className="font-mono text-[9px] tracking-wider text-cyber-text">
                      STATUS: ACTIVE
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {project.title}
                  </h3>

                  <p className="text-cyber-text text-xs leading-relaxed font-sans">
                    {project.description}
                  </p>
                </div>

                {/* Card Lower Section */}
                <div className="mt-6 pt-6 border-t border-cyber-border/60 text-left space-y-4">
                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span 
                        key={tech}
                        className="font-mono text-[9px] px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border/70 text-cyber-text"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={project.liveLink}
                      target={project.liveLink.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 font-mono text-[10px] font-bold text-white bg-cyber-bg border border-cyber-border hover:border-neon-cyan hover:bg-neon-cyan/5 transition-all duration-200 rounded cursor-pointer"
                    >
                      LIVE DEMO <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <a
                      href={project.detailsId}
                      onClick={(e) => handleAction(e, project.detailsId)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 font-mono text-[10px] font-bold text-white rounded cursor-pointer transition-all duration-200 ${
                        project.highlight 
                          ? 'bg-neon-magenta hover:bg-neon-magenta/90 text-shadow shadow-[0_0_8px_rgba(255,0,85,0.3)]' 
                          : 'bg-cyber-bg border border-cyber-border hover:border-neon-magenta hover:bg-neon-magenta/5'
                      }`}
                    >
                      CASE STUDY <Info className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>

      </div>
    </section>
  );
};
export default Projects;
