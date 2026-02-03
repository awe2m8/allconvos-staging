"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowRight, Star, ShieldCheck, Zap, RefreshCcw } from "lucide-react";

export function DIYDemo() {
    const [showVoice, setShowVoice] = useState(false);

    return (
        <section className="py-24 relative overflow-hidden bg-ocean-950">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-[10px] font-black uppercase tracking-widest">
                                    Live Interaction
                                </span>
                                <div className="h-px w-12 bg-neon/20" />
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
                                DIY <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-white">Demo</span>
                            </h2>

                            <p className="text-2xl font-bold text-white/90 mb-4 tracking-tight">
                                Experience AI Receptionist
                            </p>

                            <p className="text-gray-400 text-lg mb-8 font-medium leading-relaxed max-w-xl">
                                Be the caller: Ring our demo line or use our browser-based AI to interact with AI Receptionist live and hear samples of how calls can be handled.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center shrink-0">
                                        <Star className="w-6 h-6 text-neon" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-tight">Call our plumbing services demo</h4>
                                        <p className="text-gray-400 text-sm font-medium">
                                            Inquire about their services, emergency callout, or fees.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-neon/60 text-xs font-black uppercase tracking-[0.2em] px-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Real-time response</span>
                                    <Zap className="w-4 h-4 ml-4" />
                                    <span>No Latency</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Content - Phone Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            {/* Card Glow */}
                            <div className="absolute -inset-4 bg-neon/10 rounded-[2.5rem] blur-2xl" />

                            <div className="relative bg-[#0a0c10] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center">
                                {/* Background Pattern */}
                                <div
                                    className="absolute inset-0 opacity-[0.03]"
                                    style={{
                                        backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
                                        backgroundAttachment: "local"
                                    }}
                                />

                                <AnimatePresence mode="wait">
                                    {!showVoice ? (
                                        <motion.div
                                            key="phone-ui"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="relative z-10 flex flex-col items-center text-center"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-neon flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(217,255,65,0.3)] animate-pulse">
                                                <Phone className="w-10 h-10 text-black fill-current" />
                                            </div>

                                            <h3 className="text-white text-sm font-black uppercase tracking-[0.3em] mb-4 opacity-50">
                                                DIAL DIRECTLY
                                            </h3>

                                            <a
                                                href="tel:0485009296"
                                                className="text-4xl md:text-5xl font-black text-white hover:text-neon transition-colors duration-300 tracking-tighter"
                                            >
                                                0485 009 296
                                            </a>
                                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 mb-8">
                                                Just call this number
                                            </p>

                                            <div className="w-full h-px bg-white/10 mb-8" />

                                            <div className="grid grid-cols-2 gap-4 w-full">
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                    <p className="text-neon text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                                                    <p className="text-white text-xs font-bold uppercase tracking-tight">System Online</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                    <p className="text-neon text-[10px] font-black uppercase tracking-widest mb-1">Type</p>
                                                    <p className="text-white text-xs font-bold uppercase tracking-tight">Active Voice</p>
                                                </div>
                                            </div>

                                            <motion.button
                                                onClick={() => setShowVoice(true)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="mt-10 w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-neon transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                            >
                                                Start Live Demo
                                                <ArrowRight className="w-5 h-5" />
                                            </motion.button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="voice-ui"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="relative z-10 flex flex-col items-center w-full"
                                        >
                                            <div className="w-full bg-ocean-900 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] rounded-2xl border border-white/5 p-4 mb-6">
                                                <iframe
                                                    src="https://iframes.ai/o/1770094548049x895768558885666800?color=26d0d1&icon="
                                                    allow="microphone"
                                                    style={{ width: "100%", height: "200px", border: "none" }}
                                                    id="assistantFrame"
                                                    title="AI Voice Assistant"
                                                />
                                            </div>

                                            <div className="text-center space-y-4">
                                                <p className="text-[10px] font-mono text-neon uppercase tracking-[0.2em] animate-pulse">
                                                    Neural_Link_Established
                                                </p>
                                                <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-[280px]">
                                                    Browser microphone access required. Click "Start Call" inside the widget to begin.
                                                </p>

                                                <button
                                                    onClick={() => setShowVoice(false)}
                                                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors pt-4"
                                                >
                                                    <RefreshCcw className="w-3 h-3" />
                                                    Back to Phone Dial
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
