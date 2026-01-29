"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Terminal, MessageSquare, ShieldCheck } from "lucide-react";

export function MessagingDemo() {
    const frameRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        // Microphone permission priming for cross-origin iframes
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    stream.getTracks().forEach(track => track.stop());
                })
                .catch(err => console.warn('Mic priming failed:', err));
        }

        const checkPermissions = () => {
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({ name: 'microphone' as PermissionName })
                    .then(result => {
                        console.log('Mic Permission:', result.state);
                    });
            }
        };

        const currentFrame = frameRef.current;
        if (currentFrame) {
            currentFrame.addEventListener('load', checkPermissions);
        }
        return () => {
            if (currentFrame) currentFrame.removeEventListener('load', checkPermissions);
        };
    }, []);

    return (
        <section id="messaging-demo" className="py-24 bg-ocean-950 relative overflow-hidden">
            {/* Subtle Glow Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-neon/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-[10px] font-mono uppercase tracking-widest">
                                <Terminal className="w-3 h-3" />
                                Interactive_Environment_v4.0
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Experience the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-400">Future of Sales.</span>
                            </h2>

                            <p className="text-lg text-gray-400 leading-relaxed max-w-md">
                                Don't just take our word for it. Talk to our AI receptionist right now. It qualifies leads, books appointments, and sounds human—all in real-time.
                            </p>

                            <div className="flex flex-col gap-4 text-sm font-mono uppercase tracking-widest">
                                <div className="flex items-center gap-3 text-neon/60">
                                    <div className="w-2 h-2 rounded-full bg-neon shadow-[0_0_8px_rgba(163,230,53,1)]" />
                                    Live_Voice_Processing
                                </div>
                                <div className="flex items-center gap-3 text-white/40">
                                    <div className="w-2 h-2 rounded-full bg-white/20" />
                                    End-to-End_Encryption
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-neon/10 rounded-3xl blur-2xl" />

                        <div className="relative bg-ocean-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
                            {/* Window Header */}
                            <div className="bg-ocean-950 border-b border-white/10 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-neon" />
                                    <span className="text-sm font-bold text-white uppercase tracking-tighter">AI_Receptionist_Live</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                                        <span className="text-[10px] font-mono text-neon uppercase tracking-widest">Online</span>
                                    </div>
                                    <ShieldCheck className="w-4 h-4 text-white/20" />
                                </div>
                            </div>

                            {/* Assistant Iframe */}
                            <div className="flex-1 bg-black/20 p-6 flex flex-col items-center justify-center min-h-[300px]">
                                <div className="w-full max-w-md bg-ocean-800/50 border border-white/5 rounded-2xl overflow-hidden shadow-inner p-4">
                                    <iframe
                                        ref={frameRef}
                                        src="https://iframes.ai/o/1760442563274x523950783927418900?color=ffffff&icon="
                                        allow="microphone; camera; autoplay; encrypted-media; fullscreen; display-capture; picture-in-picture; clipboard-read; clipboard-write;"
                                        className="w-full h-[200px] border-none"
                                        id="assistantFrame"
                                        title="Voice AI Demo"
                                    />
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-4">
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
                                            <Mic className="w-3 h-3 text-neon" />
                                            Mic Access Active
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
