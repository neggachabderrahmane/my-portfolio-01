import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, AlertTriangle } from 'lucide-react';

interface LogMessage {
  id: string;
  time: string;
  type: 'SYS' | 'NAV' | 'DATA' | 'SEC';
  text: string;
}

export type HUDStatus = 'ONLINE' | 'DIAGNOSTICS' | 'ALERT';

export const SystemLog: React.FC = () => {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [status, setStatus] = useState<HUDStatus>('ONLINE');
  const [activeSection, setActiveSection] = useState('HOME');
  const listRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, type: LogMessage['type'] = 'SYS') => {
    const now = new Date();
    const pad = (n: number, z = 2) => ('00' + n).slice(-z);
    const timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}`;
    
    const newLog: LogMessage = {
      id: Math.random().toString(36).substring(2, 9),
      time: timestamp,
      type,
      text
    };

    setLogs((prev) => {
      const updated = [...prev, newLog];
      if (updated.length > 5) {
        return updated.slice(updated.length - 5); // Keep last 5 logs
      }
      return updated;
    });
  };

  // 1. Listen for status changes and general events
  useEffect(() => {
    const bootLogs: { text: string; type: LogMessage['type'] }[] = [
      { text: 'Dashboard systems initialized.', type: 'SYS' },
      { text: 'TLS 1.3 tunnels established.', type: 'SEC' },
      { text: 'Listening on port localhost:5173...', type: 'SYS' }
    ];

    bootLogs.forEach((log, index) => {
      setTimeout(() => {
        addLog(log.text, log.type);
      }, 500 * (index + 1));
    });

    const handleCustomLog = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string; type: LogMessage['type'] }>;
      if (customEvent.detail) {
        addLog(customEvent.detail.text, customEvent.detail.type || 'SYS');
      }
    };

    const handleStatusChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ status: HUDStatus }>;
      if (customEvent.detail && customEvent.detail.status) {
        setStatus(customEvent.detail.status);
      }
    };

    window.addEventListener('syslog-event', handleCustomLog);
    window.addEventListener('sys-status-change', handleStatusChange);

    return () => {
      window.removeEventListener('syslog-event', handleCustomLog);
      window.removeEventListener('sys-status-change', handleStatusChange);
    };
  }, []);

  // 2. IntersectionObserver to detect scroll-driven status messages
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1
    };

    const sectionMessages: Record<string, { text: string; type: LogMessage['type'] }> = {
      'home': { text: 'Entering Core Grid Interface (#home)...', type: 'NAV' },
      'about': { text: 'Retrieving specs: Operator profile (#about)...', type: 'NAV' },
      'projects': { text: 'Caching database indexes: Projects list (#projects)...', type: 'NAV' },
      'case-study': { text: 'Querying Relizane Fellah deployment data... OK (#case-study)', type: 'DATA' },
      'contact': { text: 'Establishing handshake: Secure contact node (#contact)...', type: 'NAV' }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveSection(id.toUpperCase());
          if (sectionMessages[id]) {
            addLog(sectionMessages[id].text, sectionMessages[id].type);
            
            // Special trigger inside projects section scroll
            if (id === 'projects') {
              setTimeout(() => {
                addLog('Connecting to replica set: AtlasCluster...', 'DATA');
              }, 600);
              setTimeout(() => {
                addLog('Sync speed: 24.5MB/s. Index retrieval success.', 'DATA');
              }, 1200);
            }
          }
        }
      });
    }, observerOptions);

    const sections = ['home', 'about', 'projects', 'case-study', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Auto-scroll list to bottom
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block w-76 bg-cyber-bg/90 border border-cyber-border rounded-lg p-3.5 select-none pointer-events-auto backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] border-neon-cyan/20 hover:border-neon-cyan/40 transition-colors duration-300 scanlines">
      {/* HUD System Status Bar */}
      <div className="flex flex-col gap-2 border-b border-cyber-border/60 pb-3 mb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full relative flex`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status === 'ONLINE' ? 'bg-neon-green' :
                status === 'DIAGNOSTICS' ? 'bg-neon-yellow' :
                'bg-neon-magenta'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                status === 'ONLINE' ? 'bg-neon-green' :
                status === 'DIAGNOSTICS' ? 'bg-neon-yellow' :
                'bg-neon-magenta'
              }`} />
            </span>
            <span className="font-mono text-[10px] font-bold tracking-widest text-white">
              SYS_STATUS:{' '}
              <span className={
                status === 'ONLINE' ? 'text-neon-green text-glow-green' :
                status === 'DIAGNOSTICS' ? 'text-neon-yellow text-glow-yellow' :
                'text-neon-magenta text-glow-magenta animate-pulse'
              }>
                {status}
              </span>
            </span>
          </div>
          
          <div className="font-mono text-[9px] text-cyber-text flex items-center gap-1">
            {status === 'ONLINE' && <Shield className="w-3 h-3 text-neon-green" />}
            {status === 'DIAGNOSTICS' && <Terminal className="w-3 h-3 text-neon-yellow animate-spin" />}
            {status === 'ALERT' && <AlertTriangle className="w-3 h-3 text-neon-magenta animate-bounce" />}
            <span>RTT: 14ms</span>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[9.5px]">
          <span className="text-cyber-text">NODE_LOC:</span>
          <span className="text-neon-cyan font-bold tracking-wider text-glow-cyan animate-pulse">
            #{activeSection}
          </span>
        </div>
      </div>

      {/* Log list container */}
      <div 
        ref={listRef} 
        className="h-24 overflow-y-auto font-mono text-[9px] text-left space-y-1.5 scrollbar-thin pr-1"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-1"
            >
              <span className="text-cyber-text/80 flex-shrink-0">[{log.time}]</span>
              <span className={`flex-shrink-0 font-bold ${
                log.type === 'NAV' ? 'text-neon-cyan' : 
                log.type === 'DATA' ? 'text-neon-magenta' : 
                log.type === 'SEC' ? 'text-neon-green' : 'text-neon-yellow'
              }`}>
                [{log.type}]
              </span>
              <span className="text-slate-300 break-words">{log.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SystemLog;
