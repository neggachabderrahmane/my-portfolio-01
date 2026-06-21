import React from 'react';
import { Zap, Server, RefreshCw, Compass } from 'lucide-react';
import { RevealWrapper } from '../components/RevealWrapper';

export const CaseStudy: React.FC = () => {
  return (
    <section id="case-study" className="py-24 relative border-t border-cyber-border bg-cyber-card/20 grid-bg">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-neon-magenta/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <RevealWrapper direction="up" delay={0.1}>
          <div className="mb-16 text-left">
            <span className="font-mono text-xs text-neon-magenta tracking-widest block mb-2 uppercase">
              [SECTION_03] // SYSTEM_DEEP_DIVE
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              CASE STUDY: RELIZANE FELLAH
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-neon-magenta to-neon-cyan mt-3 rounded-full"></div>
          </div>
        </RevealWrapper>

        {/* Project Summary card */}
        <RevealWrapper direction="up" delay={0.15}>
          <div className="bg-cyber-card border border-cyber-border rounded-lg p-6 sm:p-8 mb-12 text-left space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-neon-magenta/10 border border-neon-magenta/30 text-neon-magenta uppercase tracking-wider">
                  Active System Deployment
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Relizane Fellah Platform
                </h3>
              </div>
              <a
                href="https://relizane-fellah.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 font-mono text-xs text-cyber-bg bg-neon-cyan border border-neon-cyan rounded hover:bg-transparent hover:text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all duration-300 cursor-pointer font-bold animate-pulse"
              >
                VISIT ACTIVE DEPLOYMENT <Zap className="w-4 h-4" />
              </a>
            </div>

            <p className="text-cyber-text text-sm sm:text-base leading-relaxed font-sans">
              **Relizane Fellah** is a custom digital ecosystem constructed for agricultural logistics, crop rate tracking, and resource dispatch in the Relizane region (Algeria). Farmers in rural zones face market isolation, unoptimized transit routes, and price exploitation. The platform provides direct market rates, geospatial transporter search, and offline-ready crop tracking dashboards.
            </p>

            {/* Tech Stack Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-cyber-border/40">
              <div className="bg-cyber-bg/70 border border-cyber-border p-3 rounded text-left">
                <div className="font-mono text-[10px] text-cyber-text">FRONTEND CORE</div>
                <div className="text-white font-bold text-sm">React &amp; Flutter</div>
              </div>
              <div className="bg-cyber-bg/70 border border-cyber-border p-3 rounded text-left">
                <div className="font-mono text-[10px] text-cyber-text">BACKEND ARCHITECTURE</div>
                <div className="text-white font-bold text-sm">Node.js &amp; Express</div>
              </div>
              <div className="bg-cyber-bg/70 border border-cyber-border p-3 rounded text-left">
                <div className="font-mono text-[10px] text-cyber-text">DATABASE STACK</div>
                <div className="text-white font-bold text-sm">MongoDB (Atlas)</div>
              </div>
              <div className="bg-cyber-bg/70 border border-cyber-border p-3 rounded text-left">
                <div className="font-mono text-[10px] text-cyber-text">QUERY latency</div>
                <div className="text-neon-green text-glow-green font-bold text-sm">&lt; 45ms (Geo)</div>
              </div>
            </div>
          </div>
        </RevealWrapper>

        {/* Challenge Breakdown Section */}
        <RevealWrapper direction="up" delay={0.2}>
          <h3 className="font-mono text-sm text-white tracking-widest font-bold uppercase text-left mb-6">
            &gt;_ ARCHITECTURAL_CHALLENGES_RESOLVED
          </h3>
        </RevealWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Solution column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Challenge 1: Offline Sync */}
            <RevealWrapper direction="left" delay={0.25}>
              <div className="bg-cyber-card/75 border border-cyber-border/95 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neon-magenta/10 rounded border border-neon-magenta/20 text-neon-magenta">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">
                    1. Offline-First Sync in Low-Bandwidth Zones
                  </h4>
                </div>
                <p className="text-cyber-text text-xs sm:text-sm leading-relaxed font-sans">
                  Rural areas in Relizane have spotty mobile connections. To prevent data loss when farmers record dispatch requests or logistics details offline, I designed a Flutter sync pipeline. 
                </p>
                <div className="p-3.5 bg-cyber-bg rounded border border-cyber-border font-mono text-[11px] text-slate-300">
                  <span className="text-neon-cyan">// Offline SQLite Queue Structure</span>
                  <br />
                  - Cache mutations locally in transactional blocks.
                  <br />
                  - Monitor connection states via Flutter connectivity listener.
                  <br />
                  - Reconnect logic executes idempotent batches on the Node.js server.
                </div>
              </div>
            </RevealWrapper>

            {/* Challenge 2: Geospatial Queries */}
            <RevealWrapper direction="left" delay={0.35}>
              <div className="bg-cyber-card/75 border border-cyber-border/95 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neon-cyan/10 rounded border border-neon-cyan/20 text-neon-cyan">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">
                    2. Dynamic Geospatial Transporter Matching
                  </h4>
                </div>
                <p className="text-cyber-text text-xs sm:text-sm leading-relaxed font-sans">
                  Connecting crops to active transporters requires matching GPS coordinates instantly. The challenge was indexing thousands of changing vehicle coordinates without memory thrashing.
                </p>
                <p className="text-cyber-text text-xs sm:text-sm leading-relaxed font-sans">
                  I structured MongoDB custom <code className="text-neon-cyan font-mono text-xs">2dsphere</code> indexing fields on vehicle collections. Spatial coordinate queries utilize MongoDB query aggregations:
                </p>
                <div className="p-3.5 bg-cyber-bg rounded border border-cyber-border font-mono text-[10px] text-slate-300">
                  <pre>{`$geoNear: {
  near: { type: "Point", coordinates: [ farmer_lng, farmer_lat ] },
  distanceField: "dist.calculated",
  maxDistance: 25000, // 25km radius
  spherical: true
}`}</pre>
                </div>
              </div>
            </RevealWrapper>

          </div>

          {/* Architecture Visual Diagram & Details (Right column) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual HTML Diagram */}
            <RevealWrapper direction="right" delay={0.25}>
              <div className="bg-cyber-card border border-cyber-border rounded-lg p-6 flex flex-col justify-center">
                <h4 className="font-mono text-xs text-white tracking-widest font-bold uppercase mb-6 text-center">
                  SYSTEM ARCHITECTURE FLOW
                </h4>

                <div className="space-y-4 font-mono text-[10px] text-center">
                  {/* Node 1 */}
                  <div className="py-2.5 px-4 bg-cyber-bg border border-neon-yellow/40 text-neon-yellow rounded-md max-w-[180px] mx-auto shadow-[0_0_8px_rgba(255,234,0,0.1)]">
                    Flutter App (Mobile Client)
                    <div className="text-[8px] text-cyber-text">SQLite / Cache Layer</div>
                  </div>

                  {/* Arrow */}
                  <div className="text-cyber-text animate-pulse">
                    │ <span className="text-neon-cyan">HTTPS / Sync Payload</span>
                    <br />
                    ▼
                  </div>

                  {/* Node 2 */}
                  <div className="py-2.5 px-4 bg-cyber-bg border border-neon-cyan/40 text-neon-cyan rounded-md max-w-[180px] mx-auto shadow-[0_0_8px_rgba(0,240,255,0.1)]">
                    Node.js / Express API
                    <div className="text-[8px] text-cyber-text">Express Middleware Security</div>
                  </div>

                  {/* Arrow */}
                  <div className="text-cyber-text animate-pulse">
                    │ <span className="text-neon-magenta">Optimized Geo Aggregation</span>
                    <br />
                    ▼
                  </div>

                  {/* Node 3 */}
                  <div className="py-2.5 px-4 bg-cyber-bg border border-neon-magenta/40 text-neon-magenta rounded-md max-w-[180px] mx-auto shadow-[0_0_8px_rgba(255,0,85,0.1)]">
                    MongoDB Cluster
                    <div className="text-[8px] text-cyber-text">2dsphere Spatial Indexes</div>
                  </div>
                </div>
              </div>
            </RevealWrapper>

            {/* Core Backend security spec */}
            <RevealWrapper direction="right" delay={0.35}>
              <div className="bg-cyber-card/75 border border-cyber-border/95 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neon-yellow/10 rounded border border-neon-yellow/20 text-neon-yellow">
                    <Server className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">
                    3. Scalable Node.js Router Stack
                  </h4>
                </div>
                <p className="text-cyber-text text-xs leading-relaxed font-sans">
                  The Express backend uses JWT session tokens, custom JSON validators, and rate limiters on sensitive routing. To prevent server stalls during harvesting seasons when traffic peaks, we implement clustering nodes and PM2 load balancers.
                </p>
              </div>
            </RevealWrapper>

          </div>

        </div>

      </div>
    </section>
  );
};
export default CaseStudy;
