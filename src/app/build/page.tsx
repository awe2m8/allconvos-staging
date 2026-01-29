"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, ShieldCheck, ArrowLeft, Bot, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/Button";

export default function BuildPage() {
    const [micPermissionGranted, setMicPermissionGranted] = useState(false);
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
        <main className="min-h-screen bg-ocean-950 text-white selection:bg-red-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-red-500/5 blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <nav className="flex items-center justify-between mb-16">
                    <Link href="/" className="group flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Mission Control
                    </Link>
                    <div className="font-mono text-xl font-bold tracking-tighter text-white">
                        allconvos<span className="text-red-500">_build</span>
                    </div>
                </nav>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Side: Copy & Instructions */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-mono uppercase tracking-widest">
                                <Sparkles className="w-3 h-3" />
                                Constructor_Mode_v1.0
                            </div>

                            <h1 className="text-5xl font-bold leading-tight">
                                Construct Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Digital twin.</span>
                            </h1>

                            <p className="text-lg text-gray-400 leading-relaxed">
                                Use the voice interface on the right to train your AI agent. Tell it about your business, your pricing, and how you want it to handle customers.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">1</div>
                                    <div>
                                        <p className="font-bold text-sm text-white">Define Personality</p>
                                        <p className="text-xs text-gray-500">"You are a friendly receptionist for a plumbing business in Ballina..."</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">2</div>
                                    <div>
                                        <p className="font-bold text-sm text-white">Set Guardrails</p>
                                        <p className="text-xs text-gray-500">"Never give quotes over the phone. Always book a site visit."</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">3</div>
                                    <div>
                                        <p className="font-bold text-sm text-white">Deploy</p>
                                        <p className="text-xs text-gray-500">Sync with your calendar and start intercepting calls.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Red AI Builder Widget */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-red-500/10 rounded-3xl blur-2xl" />

                        <div className="relative bg-ocean-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[480px] flex flex-col">
                            {/* Window Header */}
                            <div className="bg-ocean-950 border-b border-white/10 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Bot className="w-4 h-4 text-red-500" />
                                        <span className="text-sm font-bold text-white uppercase tracking-tighter">Agent_Constructor</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest hidden sm:block">Real-Time Configuration</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                            </div>

                            {/* Builder Container */}
                            <div className="flex-1 bg-black/20 p-8 flex flex-col items-center justify-center min-h-[360px]">
                                <div className="w-full max-w-md bg-ocean-800/50 border border-white/5 rounded-2xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] p-6">
                                    <iframe
                                        ref={frameRef}
                                        src="https://iframes.ai/o/1769679258407x567728720327999500?color=ed0f14&icon="
                                        allow="microphone"
                                        className="w-full h-[220px] border-none"
                                        id="assistantFrame"
                                        title="Agent Builder"
                                    />

                                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-tight">
                                            <Mic className={`w-3 h-3 ${micPermissionGranted ? 'text-red-500' : 'text-red-500/30'}`} />
                                            {micPermissionGranted ? 'Mic Linked' : 'Mic Disconnected'}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-tight">
                                            <ShieldCheck className="w-3 h-3 text-red-500/40" />
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
                                <div className="text-red-500">{'>'} sys_init_complete</div>
                                <div className="text-gray-500">{'>'} neural_sync_ready</div>
                                <div className="text-gray-500">{'>'} waiting_for_vocal_id</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
