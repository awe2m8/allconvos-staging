"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StartBuildPage() {
    return (
        <main className="min-h-screen bg-ocean-950 text-white selection:bg-white/20 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-white/5 blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-lg"
            >
                {/* Main Card */}
                <div className="bg-gradient-to-b from-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
                    {/* Gradient flourish bar */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />

                    {/* AI Analyst Avatar - Top Center */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
                        <div className="w-24 h-24 rounded-full border-2 border-neon bg-black p-1 shadow-[0_0_25px_rgba(0,255,255,0.4)]">
                            <img
                                src="/images/ai-avatar.png"
                                alt="AI Analyst"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="px-8 pb-8 pt-36 text-center">
                        {/* Logo */}
                        <p className="font-mono text-lg font-bold tracking-tighter text-white mb-6">
                            allconvos<span className="text-neon">_</span>
                        </p>

                        {/* Headline */}
                        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2">
                            You're Ready!
                        </h1>
                        <p className="text-neon font-bold italic uppercase text-sm tracking-widest mb-8">
                            Click the Floating Orb to Start
                        </p>

                        {/* Interactive Orb iFrame */}
                        <div className="bg-ocean-950 rounded-2xl p-6 mb-6 border border-white/5">
                            <iframe
                                src="https://iframes.ai/o/1769747339624x746533060485054500?color=d6fa12&icon="
                                allow="microphone"
                                className="w-full h-[220px] border-none"
                                title="Voice Agent Orb"
                            />
                        </div>

                        {/* Instructions */}
                        <p className="text-gray-400 text-sm font-medium tracking-wide mb-6">
                            Describe your business → We build your agent → We send it to you to test
                        </p>

                        {/* Back link */}
                        <Link
                            href="/build"
                            className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back to Build Page
                        </Link>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
