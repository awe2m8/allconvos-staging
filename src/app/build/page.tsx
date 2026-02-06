"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ShieldCheck, ArrowLeft, Bot, Sparkles, X } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { Button } from "../../components/ui/Button";
import { BuildNextSteps } from "../../components/sections/BuildNextSteps";
import { Pricing } from "../../components/sections/Pricing";

export default function BuildPage() {
    const [micPermissionGranted, setMicPermissionGranted] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const frameRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const checkPermissions = () => {
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({ name: 'microphone' as PermissionName })
                    .then(result => {
                        if (result.state === 'granted') {
                            setMicPermissionGranted(true);
                        } else {
                            setMicPermissionGranted(false);
                        }
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
        <main className="min-h-screen bg-ocean-950 text-white selection:bg-white/20">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-white/5 blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <nav className="flex items-center justify-between mb-16">
                    <Link href="/" className="font-mono text-2xl font-bold tracking-tighter text-white">
                        allconvos<span className="text-neon">_</span>
                    </Link>
                    <Link href="/" className="group flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Mission Control
                    </Link>
                </nav>
                <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
                    {/* Left Side: Copy & Instructions */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-mono uppercase tracking-widest">
                                <Sparkles className="w-3 h-3" />
                                Constructor_Mode_v1.5
                            </div>

                            <h1 className="text-5xl font-bold leading-tight uppercase">
                                Create Your AI <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 italic">Receptionist</span>
                                <span className="block text-2xl mt-4 text-neon font-mono tracking-[0.2em] italic">- Test It Free</span>
                            </h1>

                            <p className="text-lg text-gray-400 leading-relaxed">
                                Use the voice interface to tell us about your business, pricing, and how you handle customers. We'll build your AI agent and call you so you can test it.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 font-mono text-xs">01</div>
                                    <div>
                                        <p className="font-bold text-sm text-white">Define Personality</p>
                                        <p className="text-xs text-gray-500">"You are a friendly receptionist for a plumbing business in Ballina..."</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 font-mono text-xs">02</div>
                                    <div>
                                        <p className="font-bold text-sm text-white">Set Guardrails</p>
                                        <p className="text-xs text-gray-500">"Never give quotes over the phone. Always book a site visit."</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 font-mono text-xs">03</div>
                                    <div>
                                        <p className="font-bold text-sm text-white">Deploy</p>
                                        <p className="text-xs text-gray-500">Sync with your calendar and start intercepting calls.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: White AI Builder Widget */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl" />

                        <div className="relative bg-ocean-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[480px] flex flex-col">
                            {/* Window Header */}
                            <div className="bg-ocean-950 border-b border-white/10 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Bot className="w-4 h-4 text-white/40" />
                                        <span className="text-sm font-bold text-white uppercase tracking-tighter">Agent_Builder</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest hidden sm:block">Real-Time Configuration</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        <span className="text-[10px] font-mono text-white uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                            </div>

                            {/* Builder Container */}
                            <div className="flex-1 bg-black/20 p-8 flex flex-col items-center justify-center min-h-[360px]">
                                <div
                                    className="w-full max-w-md bg-ocean-800/50 border border-white/5 rounded-2xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] p-6 cursor-pointer hover:border-neon/30 transition-colors"
                                    onClick={() => setShowPopup(true)}
                                >
                                    <iframe
                                        ref={frameRef}
                                        src="https://iframes.ai/o/1769747339624x746533060485054500?color=d6fa12&icon="
                                        allow="microphone"
                                        className="w-full h-[200px] border-none pointer-events-none"
                                        id="assistantFrame"
                                        title="Agent Builder"
                                    />

                                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-tight">
                                            <Mic className={`w-3 h-3 ${micPermissionGranted ? 'text-white' : 'text-white/20'}`} />
                                            {micPermissionGranted ? 'Mic Linked' : 'Mic Disconnected'}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-tight">
                                            <ShieldCheck className="w-3 h-3 text-white/20" />
                                            Sync_V1.8
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest animate-pulse">
                                        Waiting for training voice input...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Console Tags */}
                        <div className="absolute -bottom-6 -right-6 hidden lg:block">
                            <div className="bg-ocean-800 border border-white/10 p-4 rounded-lg shadow-xl font-mono text-[10px] space-y-1">
                                <div className="text-white/80">{'>'} sys_init_complete</div>
                                <div className="text-gray-500">{'>'} neural_sync_ready</div>
                                <div className="text-gray-500">{'>'} waiting_for_vocal_id</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Additional Sections */}
                <BuildNextSteps />
                <Pricing />

                {/* Final Call to Action */}
                <div className="py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto p-12 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-md"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6 uppercase italic tracking-tight">
                            Ready to go live?
                        </h2>
                        <p className="text-gray-400 mb-10 font-mono text-sm uppercase tracking-widest leading-relaxed">
                            Initialize your professional mission control today.
                        </p>
                        <Button
                            variant="primary"
                            className="w-full sm:w-auto px-12 py-6 text-sm font-mono uppercase italic tracking-[0.2em]"
                        >
                            Initialize Mission_Now
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Popup Modal */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowPopup(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-ocean-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setShowPopup(false)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            {/* Form iframe */}
                            <iframe
                                src="https://api.leadconnectorhq.com/widget/form/kTciuwAyNYWItRrsMHEN"
                                style={{ width: "100%", height: "523px", border: "none", borderRadius: "10px" }}
                                id="inline-kTciuwAyNYWItRrsMHEN"
                                title="Free Agent Build & Test"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lead Connector Script */}
            <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
        </main>
    );
}
