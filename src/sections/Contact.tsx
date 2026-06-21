import React, { useState } from 'react';
import { Mail, Send, ShieldAlert, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { RevealWrapper } from '../components/RevealWrapper';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export type TransmissionState = 'idle' | 'encrypting' | 'transmitting' | 'verified';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [transmissionState, setTransmissionState] = useState<TransmissionState>('idle');

  // Verify form variables using specific regex pattern to control Secure Connection Badge
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email);
  const isValid =
    formState.name.trim() !== '' &&
    formState.email.trim() !== '' &&
    isEmailValid &&
    formState.message.trim() !== '';

  const dispatchStatus = (status: 'ONLINE' | 'DIAGNOSTICS' | 'ALERT') => {
    window.dispatchEvent(
      new CustomEvent('sys-status-change', {
        detail: { status }
      })
    );
  };

  const triggerValidationError = (errorMsg: string) => {
    dispatchStatus('ALERT');
    setTimeout(() => dispatchStatus('ONLINE'), 2000);

    // Print error to terminal console
    window.dispatchEvent(
      new CustomEvent('cli-console-event', {
        detail: {
          text: errorMsg,
          type: 'error',
          animate: true
        }
      })
    );
    window.dispatchEvent(
      new CustomEvent('cli-console-event', {
        detail: {
          text: 'Error: Transmission handshake failed. Terminal aborting transmission...',
          type: 'error',
          animate: true
        }
      })
    );
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Inputs validation
    if (formState.name.trim() === '') {
      triggerValidationError('Error: Invalid data field [sender_name] detected in transmission_buffer. Field cannot be null.');
      return;
    }
    if (formState.email.trim() === '') {
      triggerValidationError('Error: Invalid data field [email_address] detected in transmission_buffer. Field cannot be null.');
      return;
    }
    if (!isEmailValid) {
      alert('Error: Data parity failed on email_address. Invalid cryptographic format.');
      triggerValidationError('Error: Data parity failed on [email_address]. Invalid cryptographic format.');
      return;
    }
    if (formState.message.trim() === '') {
      triggerValidationError('Error: Invalid data field [message_transmission] detected in transmission_buffer. Field cannot be null.');
      return;
    }

    // Retrieve environment variables
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

    // 2. Encryption handshake sequence
    setTransmissionState('encrypting');
    dispatchStatus('DIAGNOSTICS');

    // 1.2s delay for "ENCRYPTING..." visual feedback
    setTimeout(() => {
      setTransmissionState('transmitting');

      // Send via EmailJS browser SDK (using send, passing parameters as direct object mapping)
      emailjs
        .send(
          serviceId,
          templateId,
          {
            name: formState.name,
            email: formState.email,
            message: formState.message
          },
          publicKey
        )
        .then(
          () => {
            // SUCCESS STATE: Clear form, verify delivery, and set to idle
            setTransmissionState('verified');
            dispatchStatus('ONLINE');

            // Log delivery to telemetry Live Log stream
            window.dispatchEvent(
              new CustomEvent('syslog-event', {
                detail: {
                  text: '[SECURE_TRANSMISSION]: Data packets successfully reached remote node.',
                  type: 'SEC'
                }
              })
            );

            // Print success logs to Terminal console history
            window.dispatchEvent(
              new CustomEvent('cli-console-event', {
                detail: {
                  text: 'Success: [SECURE_TRANSMISSION]: Data packets successfully reached remote node.',
                  type: 'success',
                  animate: true
                }
              })
            );

            // Reset form fields
            setFormState({ name: '', email: '', message: '' });

            // Revert state back to idle after success duration
            setTimeout(() => {
              setTransmissionState('idle');
            }, 3000);
          },
          (err) => {
            // ERROR STATE
            setTransmissionState('idle');
            dispatchStatus('ALERT');
            setTimeout(() => dispatchStatus('ONLINE'), 2000);

            // Log error to telemetry Live Log stream
            window.dispatchEvent(
              new CustomEvent('syslog-event', {
                detail: {
                  text: '[ERROR]: Transmission intercepted or handshake failed.',
                  type: 'SYS'
                }
              })
            );

            // Print error to Terminal console history
            window.dispatchEvent(
              new CustomEvent('cli-console-event', {
                detail: {
                  text: '[ERROR]: Transmission intercepted or handshake failed.',
                  type: 'error',
                  animate: true
                }
              })
            );
            console.error('EmailJS Error:', err);
          }
        );
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden border-t border-cyber-border">
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyber-bg grid-bg opacity-40 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <RevealWrapper direction="up" delay={0.1}>
          <div className="mb-16 text-left">
            <span className="font-mono text-xs text-neon-cyan tracking-widest block mb-2 uppercase">
              [SECTION_04] // ESTABLISH_COMMUNICATION
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              GET IN TOUCH
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-magenta mt-3 rounded-full"></div>
          </div>
        </RevealWrapper>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-left">

          {/* Information & Socials */}
          <div className="md:col-span-5 space-y-6">
            <RevealWrapper direction="left" delay={0.2}>
              <div className="space-y-6">
                <h3 className="font-mono text-sm text-white tracking-widest font-bold uppercase">
                  &gt;_ COMMUNICATION_CHANNELS
                </h3>
                <p className="text-cyber-text text-sm leading-relaxed font-sans">
                  If you have a complex system project that requires scalable backend engineering, clean React/Flutter application development, or security reviews, feel free to establish connection.
                </p>

                <div className="space-y-4 pt-4">
                  <a
                    href="mailto:neggachabderrahmane@gmail.com"
                    className="flex items-center gap-4 p-3.5 bg-cyber-card border border-cyber-border rounded hover:border-neon-cyan transition-colors group cursor-pointer"
                  >
                    <div className="p-2.5 bg-cyber-bg rounded border border-cyber-border text-neon-cyan group-hover:shadow-[0_0_8px_rgba(0,240,255,0.4)] transition-all">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-cyber-text">SECURE_EMAIL</div>
                      <div className="text-white text-xs font-semibold">neggachabderrahmane@gmail.com</div>
                    </div>
                  </a>

                  <a
                    href="https://github.com/neggachabderrahmane"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3.5 bg-cyber-card border border-cyber-border rounded hover:border-neon-magenta transition-colors group cursor-pointer"
                  >
                    <div className="p-2.5 bg-cyber-bg rounded border border-cyber-border text-neon-magenta group-hover:shadow-[0_0_8px_rgba(255,0,85,0.4)] transition-all">
                      <GithubIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-cyber-text">REPOSITORIES</div>
                      <div className="text-white text-xs font-semibold">github.com/neggachabderrahmane</div>
                    </div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/abderrahmane-neggach-087ba53b3?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3.5 bg-cyber-card border border-cyber-border rounded hover:border-neon-cyan transition-colors group cursor-pointer"
                  >
                    <div className="p-2.5 bg-cyber-bg rounded border border-cyber-border text-neon-cyan group-hover:shadow-[0_0_8px_rgba(0,240,255,0.4)] transition-all">
                      <LinkedinIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-cyber-text">NETWORKING</div>
                      <div className="text-white text-xs font-semibold">linkedin.com/in/abderrahmane-neggach</div>
                    </div>
                  </a>
                </div>

                <div className="p-4 bg-cyber-card/40 border border-cyber-border rounded font-mono text-[10px] text-cyber-text flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-neon-yellow animate-pulse" />
                  <span>TLS 1.3 END-TO-END TRANSMISSION ENCRYPTED.</span>
                </div>
              </div>
            </RevealWrapper>
          </div>

          {/* Form Fields */}
          <div className="md:col-span-7">
            <RevealWrapper direction="right" delay={0.25}>
              <form
                onSubmit={sendEmail}
                noValidate
                className="bg-cyber-card border border-cyber-border rounded-lg p-6 sm:p-8 space-y-6 select-text"
              >
                {/* Handshake Badge & Cryptographic Info */}
                <div className="flex items-center justify-between border-b border-cyber-border/60 pb-4 mb-4 select-none">
                  <div className="flex items-center gap-2 font-mono text-[9px] text-cyber-text">
                    <Key className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>CIPHER_AES_4096</span>
                  </div>

                  {/* Secure Connection Badge */}
                  <div className={`flex items-center gap-1.5 font-mono text-[9px] px-2.5 py-1 rounded border transition-all duration-300 ${isValid
                    ? 'border-neon-green/30 text-neon-green bg-neon-green/5 shadow-[0_0_8px_rgba(57,255,20,0.15)]'
                    : 'border-cyber-border text-cyber-text bg-cyber-bg/40'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isValid ? 'bg-neon-green animate-pulse' : 'bg-neon-magenta/50'
                      }`} />
                    <span>{isValid ? 'SECURE CONNECTION: READY' : 'HANDSHAKE: STANDBY'}</span>
                  </div>
                </div>

                <div className="space-y-4">

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-neon-cyan block">
                      string sender_name;
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Enter name"
                      className="w-full bg-cyber-bg border border-cyber-border px-4 py-3 rounded text-white text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all font-mono"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-neon-cyan block">
                      string email_address;
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="Enter email"
                      className="w-full bg-cyber-bg border border-cyber-border px-4 py-3 rounded text-white text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all font-mono"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-neon-magenta block">
                      string message_transmission;
                    </label>
                    <textarea
                      rows={4}
                      name="message"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Enter message details..."
                      className="w-full bg-cyber-bg border border-cyber-border px-4 py-3 rounded text-white text-sm focus:outline-none focus:border-neon-magenta focus:ring-1 focus:ring-neon-magenta/30 transition-all font-mono resize-none"
                    />
                  </div>

                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={transmissionState !== 'idle'}
                    className="w-full h-11 font-mono text-xs font-bold tracking-wider text-white bg-neon-magenta border border-neon-magenta rounded-sm shadow-[0_0_12px_rgba(255,0,85,0.3)] hover:shadow-[0_0_20px_rgba(255,0,85,0.6)] hover:bg-transparent hover:text-neon-magenta transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    <AnimatePresence mode="wait">
                      {transmissionState === 'idle' && (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          TRANSMIT MESSAGE <Send className="w-3.5 h-3.5" />
                        </motion.span>
                      )}
                      {transmissionState === 'encrypting' && (
                        <motion.span
                          key="encrypting"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-neon-yellow"
                        >
                          ENCRYPTING BUFFER PACKET... <span className="animate-spin font-sans text-sm">✦</span>
                        </motion.span>
                      )}
                      {transmissionState === 'transmitting' && (
                        <motion.span
                          key="transmitting"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-neon-cyan"
                        >
                          ROUTING SECURE TRANSMISSION... <span className="animate-pulse">⚡</span>
                        </motion.span>
                      )}
                      {transmissionState === 'verified' && (
                        <motion.span
                          key="verified"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-neon-green"
                        >
                          TRANSMISSION VERIFIED [OK] <span className="text-sm">✓</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

              </form>
            </RevealWrapper>
          </div>

        </div>

      </div>
    </section>
  );
};
export default Contact;
