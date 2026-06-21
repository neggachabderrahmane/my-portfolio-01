import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, CornerDownLeft, Activity, Cpu, HardDrive } from 'lucide-react';

// Import sections for inner Viewport display
import { Hero } from '../sections/Hero';
import { AboutSkills } from '../sections/AboutSkills';
import { Projects } from '../sections/Projects';
import { CaseStudy } from '../sections/CaseStudy';
import { Contact } from '../sections/Contact';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'progress' | 'diagnostic';
  animate?: boolean;
}

interface LogItem {
  id: string;
  time: string;
  text: string;
}

// 1. Typewriter Sub-Component for output lines
const TypewriterLine: React.FC<{ text: string; delay?: number }> = ({ text, delay = 8 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay]);

  return <span>{displayed}</span>;
};

// 2. Animated Progress Bar Sub-Component for sudo run-diag
const ProgressLine: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300); // Trigger results
          return 100;
        }
        return next;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  const barWidth = Math.floor(percent / 5);
  const bar = '█'.repeat(barWidth) + '.'.repeat(20 - barWidth);

  return (
    <div className="text-neon-yellow font-mono py-1">
      DIAG_LOG: [{bar}] {percent}% COMPLETED
    </div>
  );
};

export const TerminalOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Dual-mode navigation states
  const [isViewportMode, setIsViewportMode] = useState(false);
  const [viewportSection, setViewportSection] = useState<string | null>(null);

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'ABDERRAHMANE.SYS [Version 4.9.2]', type: 'success', animate: false },
    { text: 'Type "help" or "?" to fetch the list of operational commands.', type: 'output', animate: false },
    { text: '', type: 'output', animate: false }
  ]);

  // Telemetry side-panel states
  const [cpu, setCpu] = useState('18.4%');
  const [ram, setRam] = useState('4.86 GB');
  const [ping, setPing] = useState('14ms');
  const [interactionLogs, setInteractionLogs] = useState<LogItem[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const tabCycleRef = useRef<{ matched: string[]; index: number }>({ matched: [], index: -1 });

  // Focus input on open/restore, blur on minimize/close
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      inputRef.current?.blur();
    }
  }, [isOpen, isMinimized]);

  // Auto-scroll terminal output (only if normal history panel is showing)
  useEffect(() => {
    if (!viewportSection) {
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, viewportSection]);

  // Telemetry ambient fluctuations
  useEffect(() => {
    const cpuInterval = setInterval(() => {
      const val = (Math.random() * (32.4 - 12.5) + 12.5).toFixed(1);
      setCpu(`${val}%`);
    }, 1500);

    const ramInterval = setInterval(() => {
      const val = (Math.random() * (4.95 - 4.81) + 4.81).toFixed(2);
      setRam(`${val} GB`);
    }, 2500);

    const pingInterval = setInterval(() => {
      const val = Math.floor(Math.random() * (17 - 11) + 11);
      setPing(`${val}ms`);
    }, 2000);

    return () => {
      clearInterval(cpuInterval);
      clearInterval(ramInterval);
      clearInterval(pingInterval);
    };
  }, []);

  // Listen to viewport interaction log dispatches
  useEffect(() => {
    const handleLogEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      if (customEvent.detail) {
        const now = new Date();
        const pad = (n: number) => ('00' + n).slice(-2);
        const timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        
        const logMsg: LogItem = {
          id: Math.random().toString(),
          time: timestamp,
          text: customEvent.detail.text.replace(/\s*\(#.*\)/g, '') // strip hash IDs
        };

        setInteractionLogs((prev) => {
          const updated = [...prev, logMsg];
          if (updated.length > 8) {
            return updated.slice(updated.length - 8);
          }
          return updated;
        });
      }
    };

    window.addEventListener('syslog-event', handleLogEvent);
    return () => window.removeEventListener('syslog-event', handleLogEvent);
  }, []);

  // Listen to external CLI printing dispatches
  useEffect(() => {
    const handleConsoleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string; type: 'input' | 'output' | 'error' | 'success' | 'progress' | 'diagnostic'; animate?: boolean }>;
      if (customEvent.detail) {
        setHistory((prev) => [
          ...prev,
          {
            text: customEvent.detail.text,
            type: customEvent.detail.type || 'output',
            animate: customEvent.detail.animate !== false
          }
        ]);
        setIsOpen(true);
        setIsMinimized(false);
      }
    };

    window.addEventListener('cli-console-event', handleConsoleEvent);
    return () => window.removeEventListener('cli-console-event', handleConsoleEvent);
  }, []);

  // Escape strategy global event listener
  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOpen && !isMinimized) {
          setIsMinimized(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, [isOpen, isMinimized]);

  // Click outside overlay backdrop handler
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsMinimized(true);
    }
  };

  // Toggle maximize / minimize / open state
  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsMinimized(true);
    }
  };

  // Dispatch HUD system status triggers
  const dispatchStatus = (status: 'ONLINE' | 'DIAGNOSTICS' | 'ALERT') => {
    window.dispatchEvent(
      new CustomEvent('sys-status-change', {
        detail: { status }
      })
    );
  };

  // Command Execution Parser
  const executeCommand = (commandStr: string) => {
    const trimmed = commandStr.trim();
    const args = trimmed.split(' ').filter(a => a !== '');
    if (args.length === 0) {
      setHistory((prev) => [...prev, { text: `abderrahmane@sys:~$ `, type: 'input' }]);
      return;
    }

    const cmd = args[0].toLowerCase();
    const newLines: TerminalLine[] = [{ text: `abderrahmane@sys:~$ ${commandStr}`, type: 'input' }];

    // Reset autocomplete state on command execution
    tabCycleRef.current = { matched: [], index: -1 };

    switch (cmd) {
      case 'help':
      case '?':
        newLines.push(
          { text: 'SYSTEM COMMAND LIST:', type: 'success', animate: true },
          { text: '  goto <section> [viewport]  Scroll to section or overlay content inside terminal', type: 'output', animate: true },
          { text: '  exit-viewport              Close active CLI viewport overlay', type: 'output', animate: true },
          { text: '  stats <project>            Fetch stack parameters (relizane, aegis, nexus)', type: 'output', animate: true },
          { text: '  system                     Query runtime core specifications', type: 'output', animate: true },
          { text: '  sudo run-diag              Execute diagnostics on active developer identity', type: 'output', animate: true },
          { text: '  clear                      Purge console stdout buffer', type: 'output', animate: true },
          { text: '  exit                       Shutdown active shell terminal', type: 'output', animate: true }
        );
        break;

      case 'clear':
        setHistory([]);
        setViewportSection(null); // Exit viewport on clear
        setInputVal('');
        return;

      case 'exit':
      case 'close':
        newLines.push({ text: 'Closing active shell connection...', type: 'output', animate: true });
        setHistory((prev) => [...prev, ...newLines]);
        setTimeout(() => {
          setIsOpen(false);
          setIsMinimized(false);
        }, 550);
        setInputVal('');
        return;

      case 'exit-viewport':
      case 'close-viewport':
        if (viewportSection) {
          setViewportSection(null);
          newLines.push({ text: 'Exiting CLI viewport overlay. Returning to console shell history.', type: 'output', animate: true });
        } else {
          newLines.push({ text: 'No active CLI viewport to close.', type: 'error', animate: true });
          dispatchStatus('ALERT');
          setTimeout(() => dispatchStatus('ONLINE'), 2000);
        }
        break;

      case 'system':
        newLines.push(
          { text: 'HOST CORE INTERFACE:', type: 'success', animate: true },
          { text: '  [OS] Negga Systems Port v4.9.2', type: 'output', animate: true },
          { text: '  [RUNTIME] React v19.2.7 & Vite Client Environment', type: 'output', animate: true },
          { text: '  [COMPILING] TS v6 / Tailwind CSS v4 / Framer Motion v12', type: 'output', animate: true },
          { text: '  [SECURE] SSL TLS 1.3 socket verified', type: 'output', animate: true }
        );
        break;

      case 'goto': {
        const targetSection = args[1] ? args[1].toLowerCase() : null;
        const forceViewport = args[2] && (args[2].toLowerCase() === 'viewport' || args[2].toLowerCase() === '--viewport' || args[2].toLowerCase() === '-v');
        const showInViewport = isViewportMode || forceViewport;
        const validSections = ['home', 'about', 'projects', 'case-study', 'contact'];

        if (!targetSection || !validSections.includes(targetSection)) {
          newLines.push({ text: 'Error: goto command requires parameter <home | about | projects | case-study | contact> [viewport]', type: 'error', animate: true });
          dispatchStatus('ALERT');
          setTimeout(() => dispatchStatus('ONLINE'), 2000);
        } else {
          if (showInViewport) {
            newLines.push({ text: `RENDERING INNER VIEWPORT: Overlaying #${targetSection}`, type: 'success', animate: true });
            setViewportSection(targetSection);
            window.dispatchEvent(
              new CustomEvent('syslog-event', {
                detail: { text: `Viewport loaded by CLI command: goto ${targetSection}`, type: 'NAV' }
              })
            );
          } else {
            newLines.push({ text: `INITIATING TRANSIT SEQUENCE: Scroll targeting element #${targetSection}`, type: 'success', animate: true });
            
            const element = document.getElementById(targetSection);
            if (element) {
              setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
                window.dispatchEvent(
                  new CustomEvent('syslog-event', {
                    detail: { text: `Scroll navigated by CLI command: goto ${targetSection}`, type: 'NAV' }
                  })
                );
              }, 300);
              setTimeout(() => {
                setIsMinimized(true); // Smoothly minimize window after scroll transit
              }, 1200);
            } else {
              newLines.push({ text: `Failed: Element target #${targetSection} not found.`, type: 'error', animate: true });
              dispatchStatus('ALERT');
              setTimeout(() => dispatchStatus('ONLINE'), 2000);
            }
          }
        }
        break;
      }

      case 'stats': {
        const project = args[1] ? args[1].toLowerCase() : null;
        if (project === 'relizane') {
          newLines.push(
            { text: 'PROJECT DATA SPECIFICATION: RELIZANE FELLAH', type: 'success', animate: true },
            { text: '  - Stack: Node.js, Express, MongoDB, Flutter mobile app', type: 'output', animate: true },
            { text: '  - Database config: 2dsphere indexing spatial match operations', type: 'output', animate: true },
            { text: '  - Challenges solved: Offline synchronization database caches', type: 'output', animate: true }
          );
        } else if (project === 'aegis') {
          newLines.push(
            { text: 'PROJECT DATA SPECIFICATION: AEGISNET DETECTOR', type: 'success', animate: true },
            { text: '  - Stack: React.js, Python, FastAPI, WebSockets integration', type: 'output', animate: true },
            { text: '  - Operations: Intrusion threat sorting via lightweight neural network maps', type: 'output', animate: true }
          );
        } else if (project === 'nexus') {
          newLines.push(
            { text: 'PROJECT DATA SPECIFICATION: NEXUSSTREAM TELEMETRY', type: 'success', animate: true },
            { text: '  - Stack: Go, Node.js stream workers, Redis pub/sub queue, MongoDB', type: 'output', animate: true },
            { text: '  - Ingestion velocity: Up to 1.2M logs per minute aggregate processing', type: 'output', animate: true }
          );
        } else {
          newLines.push({ text: 'Error: stats command requires parameter <relizane | aegis | nexus>', type: 'error', animate: true });
          dispatchStatus('ALERT');
          setTimeout(() => dispatchStatus('ONLINE'), 2000);
        }
        break;
      }

      case 'sudo': {
        const sub = args[1] ? args[1].toLowerCase() : null;
        if (sub === 'run-diag') {
          dispatchStatus('DIAGNOSTICS');
          newLines.push(
            { text: '[INIT] Initializing cryptographic diagnostic suite...', type: 'output', animate: true },
            { text: '[RUN] Booting diagnostics kernel modules...', type: 'output', animate: true },
            { text: '', type: 'progress', animate: false } // Trigger progress bar
          );
        } else {
          newLines.push({ text: 'bash: command not found: sudo ' + (sub || ''), type: 'error', animate: true });
          dispatchStatus('ALERT');
          setTimeout(() => dispatchStatus('ONLINE'), 2000);
        }
        break;
      }

      default:
        newLines.push({ text: `Command not found. Type "help" or "?" for a list of valid commands.`, type: 'error', animate: true });
        dispatchStatus('ALERT');
        setTimeout(() => dispatchStatus('ONLINE'), 2000);
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInputVal('');
  };

  // Diagnostic Results read-out when progress bar finishes
  const handleDiagnosticComplete = () => {
    dispatchStatus('ONLINE');
    setHistory((prev) => [
      ...prev,
      { text: '====================================================', type: 'success', animate: true },
      { text: 'ABDERRAHMANE CORE IDENTITY DIAGNOSTIC READOUT', type: 'success', animate: true },
      { text: '====================================================', type: 'success', animate: true },
      { text: '  [USER]        Abderrahmane', type: 'output', animate: true },
      { text: '  [ROLE]        Senior Core System Developer & UI/UX Expert', type: 'output', animate: true },
      { text: '  [COMPILER]    React 19, TypeScript, Express, MongoDB, Flutter', type: 'output', animate: true },
      { text: '  [LATENCY]     Operational parameters standard (RTT 14ms)', type: 'output', animate: true },
      { text: '  [SECURE]      Identity signature authenticated: PASS', type: 'output', animate: true },
      { text: '====================================================', type: 'success', animate: true }
    ]);
  };

  // Keyboard Handlers (Autocomplete & Execution)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Autocomplete on Tab
    if (e.key === 'Tab') {
      e.preventDefault();

      const candidates = ['help', 'goto', 'stats', 'system', 'clear', 'exit', 'exit-viewport', 'sudo run-diag'];
      const val = inputVal.trim();

      // If we haven't checked matching candidates yet, find them
      if (tabCycleRef.current.matched.length === 0) {
        const matched = candidates.filter((c) => c.startsWith(val.toLowerCase()));
        if (matched.length > 0) {
          tabCycleRef.current = { matched, index: 0 };
          const completed = matched[0];
          setInputVal(completed + (['goto', 'stats'].includes(completed) ? ' ' : ''));
        }
      } else {
        // Cycle matching candidates
        const { matched, index } = tabCycleRef.current;
        const nextIndex = (index + 1) % matched.length;
        tabCycleRef.current.index = nextIndex;
        const completed = matched[nextIndex];
        setInputVal(completed + (['goto', 'stats'].includes(completed) ? ' ' : ''));
      }
      return;
    }

    // Submit on Enter
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    }
  };

  // Renders the viewport content based on command
  const renderViewportComponent = (section: string) => {
    switch (section.toLowerCase()) {
      case 'home':
        return <Hero />;
      case 'about':
        return <AboutSkills />;
      case 'projects':
        return <Projects />;
      case 'case-study':
        return <CaseStudy />;
      case 'contact':
        return <Contact />;
      default:
        return <div className="text-neon-magenta font-mono">Error: Section component target undefined.</div>;
    }
  };

  // Framer Motion Animation Variants
  const backdropVariants: any = {
    maximized: {
      opacity: 1,
      pointerEvents: 'auto',
      transition: { duration: 0.35, ease: 'easeOut' }
    },
    minimized: {
      opacity: 0,
      pointerEvents: 'none',
      transition: { duration: 0.35, ease: 'easeInOut' }
    },
    closed: {
      opacity: 0,
      pointerEvents: 'none',
      transition: { duration: 0.25, ease: 'easeIn' }
    }
  };

  const windowVariants: any = {
    maximized: {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 220 }
    },
    minimized: {
      scale: 0.05,
      opacity: 0,
      x: '40vw',
      y: '45vh',
      transition: { type: 'spring', damping: 25, stiffness: 180 }
    },
    closed: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeIn' }
    }
  };

  const activeState = !isOpen ? 'closed' : isMinimized ? 'minimized' : 'maximized';

  return (
    <>
      {/* 1. Floating Terminal Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={handleToggle}
          className={`p-3.5 bg-cyber-card border rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center cursor-pointer ${
            isMinimized 
              ? 'border-neon-magenta text-neon-magenta shadow-[0_0_20px_rgba(255,0,85,0.5)] animate-pulse'
              : 'border-cyber-border text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.2)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:border-neon-cyan'
          }`}
          title={isMinimized ? "Restore System Terminal CLI" : "Open System Terminal CLI"}
        >
          <TerminalIcon className={`w-5 h-5 ${isMinimized ? 'animate-pulse text-neon-magenta' : 'animate-pulse'}`} />
          <span className="font-mono text-[9px] font-bold tracking-wider ml-1.5 hidden sm:inline">
            {isMinimized ? 'RESTORE' : 'CLI'}
          </span>
        </button>
      </div>

      {/* 2. Enhanced CRT Command-Line Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate={activeState}
            exit="closed"
            className="fixed inset-0 w-full h-full z-[100] bg-cyber-bg/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 scanlines pointer-events-auto"
            onClick={handleBackdropClick}
          >
            <motion.div 
              variants={windowVariants}
              className="max-w-6xl w-full h-[90vh] bg-cyber-card border border-cyber-border rounded-lg flex flex-col shadow-[0_0_40px_rgba(0,240,255,0.15)] relative overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()} // Prevent closing/minimizing on window clicks
            >
              
              {/* Terminal Window Header Bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-cyber-border/80 bg-cyber-bg/90 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                
                <div className="font-mono text-[10px] text-cyber-text flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>abderrahmane@sys: ~ shell - active CLI session</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Viewport / Scroll Mode Toggle */}
                  <button
                    onClick={() => {
                      setIsViewportMode(!isViewportMode);
                      if (viewportSection) {
                        setViewportSection(null);
                      }
                    }}
                    className={`font-mono text-[9px] px-2 py-0.5 border rounded transition-all cursor-pointer ${
                      isViewportMode
                        ? 'border-neon-magenta text-neon-magenta shadow-[0_0_8px_rgba(255,0,85,0.2)]'
                        : 'border-cyber-border text-cyber-text hover:border-neon-cyan hover:text-neon-cyan'
                    }`}
                  >
                    MODE: {isViewportMode ? 'CLI-VIEWPORT' : 'STANDARD-SCROLL'}
                  </button>

                  {/* Minimize Header Button */}
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-5 h-5 flex items-center justify-center rounded border border-cyber-border text-cyber-text hover:text-neon-yellow hover:border-neon-yellow/60 hover:shadow-[0_0_8px_rgba(255,234,0,0.3)] transition-all text-[11px] font-mono cursor-pointer"
                    title="Minimize window (Esc)"
                  >
                    —
                  </button>

                  {/* Close Header Button */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsMinimized(false);
                    }}
                    className="w-5 h-5 flex items-center justify-center rounded border border-cyber-border text-cyber-text hover:text-neon-magenta hover:border-neon-magenta/60 hover:shadow-[0_0_8px_rgba(255,0,85,0.3)] transition-all cursor-pointer"
                    title="Close Shell (exit)"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Split-Pane Content Container */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                
                {/* A. Left Pane: Shell Console / Inner Viewport Container */}
                <div className="flex-1 flex flex-col h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-cyber-border/60">
                  <div className="flex-1 overflow-y-auto p-5 relative select-text scrollbar-thin">
                    {viewportSection ? (
                      /* High-Contrast Interactive Viewport Container */
                      <div className="cli-viewport w-full h-full text-white text-left font-sans text-sm leading-relaxed p-4 bg-cyber-bg/95 border border-cyber-border/60 rounded-md relative overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-cyber-border/40 pb-2 mb-4">
                          <span className="font-mono text-neon-cyan font-bold text-xs uppercase tracking-widest animate-pulse">
                            [CLI_VIEWPORT: {viewportSection}]
                          </span>
                          <button
                            onClick={() => setViewportSection(null)}
                            className="font-mono text-[9px] text-neon-magenta border border-neon-magenta/30 hover:border-neon-magenta px-2 py-0.5 rounded cursor-pointer transition-colors"
                          >
                            [EXIT_VIEWPORT]
                          </button>
                        </div>
                        <div className="scale-95 origin-top relative z-10 text-white">
                          {renderViewportComponent(viewportSection)}
                        </div>
                      </div>
                    ) : (
                      /* Standard CLI Console History Buffer */
                      <div className="font-mono text-xs text-left space-y-2">
                        {history.map((line, idx) => (
                          <div 
                            key={idx} 
                            className={`${
                              line.type === 'input' ? 'text-white' : 
                              line.type === 'error' ? 'text-neon-magenta text-glow-magenta font-bold' : 
                              line.type === 'success' ? 'text-neon-cyan text-glow-cyan font-bold' : 'text-slate-300'
                            }`}
                          >
                            {line.type === 'progress' && (
                              <ProgressLine onComplete={handleDiagnosticComplete} />
                            )}
                            {line.type !== 'progress' && (
                              line.animate ? (
                                <TypewriterLine text={line.text} />
                              ) : (
                                <span>{line.text}</span>
                              )
                            )}
                          </div>
                        ))}
                        <div ref={outputEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Terminal Interactive Input Row */}
                  <div className="p-4 border-t border-cyber-border/60 bg-cyber-bg/50 flex items-center gap-2 select-none">
                    <span className="font-mono text-xs text-neon-cyan flex-shrink-0">
                      abderrahmane@sys:~$
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type commands..."
                      className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder-cyber-border focus:ring-0 focus:border-none focus:outline-none"
                    />
                    <span className="font-mono text-[8.5px] text-cyber-text hidden sm:flex items-center gap-1 uppercase">
                      [TAB] COMPLETES // [ENTER] RUNS <CornerDownLeft className="w-3 h-3 text-neon-cyan" />
                    </span>
                  </div>
                </div>

                {/* B. Right Pane: Telemetry & Log Stream Side-Panel */}
                <div className="w-full lg:w-72 bg-cyber-bg/40 flex flex-col h-full overflow-hidden select-none">
                  
                  {/* Pane Section 1: Telemetry stats */}
                  <div className="p-4 border-b border-cyber-border/50">
                    <div className="flex items-center gap-2 mb-4 font-mono text-[10px] text-white font-bold tracking-wider">
                      <Activity className="w-4 h-4 text-neon-cyan animate-pulse" />
                      <span>[HOST_TELEMETRY]</span>
                    </div>

                    <div className="space-y-3 font-mono text-[10px] text-left">
                      <div className="flex items-center justify-between p-2 bg-cyber-card border border-cyber-border rounded">
                        <span className="text-cyber-text flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-neon-cyan" /> CPU_LOAD
                        </span>
                        <span className="text-neon-cyan font-bold">{cpu}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-cyber-card border border-cyber-border rounded">
                        <span className="text-cyber-text flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-neon-yellow" /> MEM_ALLOC
                        </span>
                        <span className="text-neon-yellow font-bold">{ram} / 16.00G</span>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-cyber-card border border-cyber-border rounded">
                        <span className="text-cyber-text flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-neon-green" /> PING_LATENCY
                        </span>
                        <span className="text-neon-green text-glow-green font-bold">{ping}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pane Section 2: Real-time user logs list */}
                  <div className="flex-1 p-4 flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2 mb-3 font-mono text-[10px] text-white font-bold tracking-wider">
                      <TerminalIcon className="w-3.5 h-3.5 text-neon-magenta" />
                      <span>[LIVE_LOG_STREAM]</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[9px] text-left scrollbar-none">
                      {interactionLogs.length === 0 ? (
                        <div className="text-cyber-text text-center italic py-10">No interactions recorded.</div>
                      ) : (
                        interactionLogs.map((log) => (
                          <div key={log.id} className="p-1.5 bg-cyber-card/70 border border-cyber-border/40 rounded flex items-start gap-1">
                            <span className="text-cyber-text flex-shrink-0">[{log.time}]</span>
                            <span className="text-slate-300 break-all">{log.text}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TerminalOverlay;
