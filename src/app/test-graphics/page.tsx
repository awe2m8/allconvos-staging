"use client";

import React from "react";
import Script from "next/script";
import { Bot, Phone, MessageSquare, Sparkles, Mic, Zap, Shield } from "lucide-react";

export default function TestGraphicsPage() {
    return (
        <main className="min-h-screen bg-ocean-950 text-white p-8">
            <Script
                src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // This widget bootstraps on DOMContentLoaded only.
                    // On Next.js client-rendered pages, re-fire so it can scan and mount.
                    document.dispatchEvent(new Event("DOMContentLoaded"));
                }}
            />
            <div className="max-w-4xl mx-auto space-y-16">
                <h1 className="text-2xl font-mono text-gray-500 mb-8">Test Graphics - Unlinked Page</h1>

                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Widget Demo Test</p>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <div data-widget-key="b22b183d-3336-4b9b-973d-12c1e47888c4" />
                    </div>
                </section>

                {/* ===== VARIATION 1: Original Style with Flourish ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 1 - Original Style + Flourish</p>
                    <div className="bg-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="p-8 md:p-12">
                            <div className="flex items-start justify-between gap-8">
                                <div className="flex-1">
                                    <p className="font-mono text-xl font-bold tracking-tighter text-white mb-6">
                                        allconvos<span className="text-neon">_</span>
                                    </p>
                                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-2">
                                        CREATE YOUR AI
                                    </h2>
                                    <h2 className="text-4xl md:text-5xl font-black text-neon uppercase italic tracking-tighter leading-tight mb-6">
                                        RECEPTIONIST
                                    </h2>
                                    <p className="text-xl font-black text-neon italic uppercase tracking-tight mb-8">
                                        — TEST IT FREE
                                    </p>
                                    <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                                        Use the voice interface to tell us about your business, pricing, and how you handle customers. We'll build your AI agent and send it to you to test.
                                    </p>
                                </div>
                                <div className="hidden md:block relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-neon flex items-center justify-center bg-ocean-900 shadow-[0_0_40px_rgba(217,255,65,0.3)]">
                                        <Bot className="w-12 h-12 text-neon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 2: Centered Layout with Flourish ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 2 - Centered Layout + Flourish</p>
                    <div className="bg-ocean-950 rounded-2xl border border-white/10 text-center overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="p-8 md:p-12">
                            <p className="font-mono text-xl font-bold tracking-tighter text-white mb-8">
                                allconvos<span className="text-neon">_</span>
                            </p>
                            <div className="w-24 h-24 rounded-full border-4 border-neon flex items-center justify-center bg-ocean-900 shadow-[0_0_40px_rgba(217,255,65,0.3)] mx-auto mb-8">
                                <Phone className="w-10 h-10 text-neon" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-2">
                                CREATE YOUR AI
                            </h2>
                            <h2 className="text-3xl md:text-5xl font-black text-neon uppercase italic tracking-tighter leading-tight mb-6">
                                RECEPTIONIST
                            </h2>
                            <p className="text-lg font-black text-neon italic uppercase tracking-tight mb-6">
                                — TEST IT FREE
                            </p>
                            <p className="text-gray-400 text-base leading-relaxed max-w-lg mx-auto">
                                Tell us about your business. We'll create your AI agent so you can test it.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 3: Compact Header with Flourish ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 3 - Compact + Flourish</p>
                    <div className="bg-ocean-950 rounded-2xl border border-white/10 max-w-md mx-auto overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="w-12 h-12 rounded-full border-2 border-neon flex items-center justify-center bg-ocean-900">
                                    <Mic className="w-5 h-5 text-neon" />
                                </div>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-1">
                                CREATE YOUR AI
                            </h2>
                            <h2 className="text-2xl md:text-3xl font-black text-neon uppercase italic tracking-tighter leading-tight mb-4">
                                RECEPTIONIST
                            </h2>
                            <p className="text-sm font-bold text-neon italic uppercase tracking-tight mb-4">
                                — TEST IT FREE
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Tell us about your business and we'll create your AI agent.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== BANNER VARIATIONS WITH FLOURISH ===== */}

                {/* ===== VARIATION 7: Wide Banner + Flourish ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 7 - Wide Banner + Flourish</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="p-6">
                            <div className="flex items-center justify-between gap-6">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                        <span className="text-white">CREATE YOUR AI </span>
                                        <span className="text-neon italic">RECEPTIONIST</span>
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-neon italic uppercase tracking-tight">
                                    TEST FREE
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 8: Banner + Tagline + Flourish ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 8 - Banner + Tagline + Flourish</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-8 px-6">
                            <div className="flex items-center justify-between gap-6 mb-4">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                        <span className="text-white">CREATE YOUR AI </span>
                                        <span className="text-neon italic">RECEPTIONIST</span>
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-neon italic uppercase tracking-tight">
                                    TEST FREE
                                </p>
                            </div>
                            <p className="text-center text-gray-500 text-sm">
                                Tell us about your business. We'll create your AI agent so you can test it.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 9: Banner + Subtitle + Flourish ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 9 - Banner + Workflow + Flourish</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-6 px-6">
                            <div className="flex items-center justify-between gap-6">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                        <span className="text-white">CREATE YOUR AI </span>
                                        <span className="text-neon italic">RECEPTIONIST</span>
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-neon italic uppercase tracking-tight">
                                    TEST FREE
                                </p>
                            </div>
                            <div className="h-px bg-white/10 my-4" />
                            <p className="text-center text-gray-400 text-sm font-medium">
                                Describe your business → We build your agent → We send it to you to test
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 10: Build Your Voice Agent + Flourish ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 10 - "Build Your Voice Agent" + Flourish</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="p-6">
                            <div className="flex items-center justify-between gap-6">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                        <span className="text-white">BUILD YOUR </span>
                                        <span className="text-neon italic">VOICE AGENT</span>
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-white/50 italic uppercase tracking-tight">
                                    IN MINUTES
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 11: AI Phone Answering + Flourish ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 11 - "AI Phone Answering" + Flourish</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="p-6">
                            <div className="flex items-center justify-between gap-6">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                        <span className="text-white">AI </span>
                                        <span className="text-neon italic">PHONE ANSWERING</span>
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-neon italic uppercase tracking-tight">
                                    TRY IT NOW
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 12: Taller with Description + Flourish ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 12 - Taller with Description + Flourish</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-10 px-8">
                            <div className="flex items-center justify-between gap-6 mb-6">
                                <p className="font-mono text-xl font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <p className="text-sm font-bold text-neon italic uppercase tracking-tight">
                                    FREE TRIAL
                                </p>
                            </div>
                            <div className="text-center">
                                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">
                                    <span className="text-white">CREATE YOUR AI </span>
                                    <span className="text-neon italic">RECEPTIONIST</span>
                                </h2>
                                <p className="text-gray-400 text-base max-w-lg mx-auto">
                                    Tell us about your business. We'll create your AI agent and give it to you to test.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 13: Centered Stack + Flourish ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 13 - Centered Stack + Flourish</p>
                    <div className="bg-gradient-to-b from-ocean-900 to-ocean-950 rounded-2xl border border-white/10 text-center overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-10 px-8">
                            <p className="font-mono text-lg font-bold tracking-tighter text-white mb-6">
                                allconvos<span className="text-neon">_</span>
                            </p>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
                                <span className="text-white">CREATE YOUR AI </span>
                                <span className="text-neon italic">RECEPTIONIST</span>
                            </h2>
                            <p className="text-neon font-bold italic uppercase text-sm tracking-widest">
                                — TEST IT FREE —
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== ADDITIONAL COPY VARIATIONS ===== */}

                {/* ===== VARIATION 14: "We'll send it to you" ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 14 - "We'll send it to you"</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-8 px-6">
                            <div className="flex items-center justify-between gap-6 mb-4">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                        <span className="text-white">CREATE YOUR AI </span>
                                        <span className="text-neon italic">RECEPTIONIST</span>
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-neon italic uppercase tracking-tight">
                                    TEST FREE
                                </p>
                            </div>
                            <p className="text-center text-gray-500 text-sm">
                                Tell us about your business. We'll build it and send it to you to try.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 15: "Get yours to test" ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 15 - "Get yours to test"</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-8 px-6">
                            <div className="flex items-center justify-between gap-6 mb-4">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                        <span className="text-white">CREATE YOUR AI </span>
                                        <span className="text-neon italic">RECEPTIONIST</span>
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-neon italic uppercase tracking-tight">
                                    TEST FREE
                                </p>
                            </div>
                            <p className="text-center text-gray-500 text-sm">
                                Describe your business. We'll create your agent and give you access to try it.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 16: Workflow with "give it to you" ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 16 - Workflow "Give it to you"</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-6 px-6">
                            <div className="flex items-center justify-between gap-6">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                        <span className="text-white">CREATE YOUR AI </span>
                                        <span className="text-neon italic">RECEPTIONIST</span>
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-neon italic uppercase tracking-tight">
                                    TEST FREE
                                </p>
                            </div>
                            <div className="h-px bg-white/10 my-4" />
                            <p className="text-center text-gray-400 text-sm font-medium">
                                Describe your business → We create your agent → We give it to you to try
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 17: Short + Simple ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 17 - Short + Simple</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-8 px-6">
                            <div className="flex items-center justify-between gap-6 mb-4">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                        <span className="text-white">CREATE YOUR AI </span>
                                        <span className="text-neon italic">RECEPTIONIST</span>
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-neon italic uppercase tracking-tight">
                                    TEST FREE
                                </p>
                            </div>
                            <p className="text-center text-gray-500 text-sm">
                                We'll build it. You'll test it. Simple.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 18: "Try your agent" ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 18 - "Try your agent"</p>
                    <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-8 px-6">
                            <div className="flex items-center justify-between gap-6 mb-4">
                                <p className="font-mono text-lg font-bold tracking-tighter text-white">
                                    allconvos<span className="text-neon">_</span>
                                </p>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                        <span className="text-white">CREATE YOUR AI </span>
                                        <span className="text-neon italic">RECEPTIONIST</span>
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-neon italic uppercase tracking-tight">
                                    TEST FREE
                                </p>
                            </div>
                            <p className="text-center text-gray-500 text-sm">
                                Tell us about your business and we'll let you try your own AI agent.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== VARIATION 19: User's Preferred Layout + Workflow Text ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Variation 19 - Your Layout + Workflow Text</p>
                    <div className="bg-gradient-to-b from-ocean-900 to-ocean-950 rounded-2xl border border-white/10 text-center overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-8 px-8">
                            <p className="font-mono text-lg font-bold tracking-tighter text-white mb-6">
                                allconvos<span className="text-neon">_</span>
                            </p>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
                                <span className="text-white">CREATE YOUR AI </span>
                                <span className="text-neon italic">RECEPTIONIST</span>
                            </h2>
                            <p className="text-neon font-bold italic uppercase text-sm tracking-widest mb-6">
                                — TEST IT FREE —
                            </p>
                            <p className="text-gray-400 text-base font-medium tracking-wide">
                                Describe your business → We build your agent → We send it to you to test
                            </p>
                        </div>
                    </div>
                </section>

                {/* ========================================= */}
                {/* POST-FORM SUBMISSION POPUP GRAPHICS */}
                {/* ========================================= */}
                <div className="pt-8 border-t border-white/10">
                    <h2 className="text-xl font-bold text-white mb-2">Post-Form Submission Popups</h2>
                    <p className="text-gray-500 text-sm mb-8">Square-shaped messages for after form submission</p>
                </div>

                {/* ===== POST-FORM 1: Basic with Orb ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Post-Form 1 - Basic with Orb</p>
                    <div className="bg-gradient-to-b from-ocean-900 to-ocean-950 rounded-2xl border border-white/10 text-center overflow-hidden max-w-md mx-auto">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-10 px-8">
                            <p className="font-mono text-base font-bold tracking-tighter text-white mb-6">
                                allconvos<span className="text-neon">_</span>
                            </p>

                            {/* Orb visual */}
                            <div className="w-20 h-20 rounded-full border-4 border-neon flex items-center justify-center bg-ocean-900 shadow-[0_0_40px_rgba(217,255,65,0.3)] mx-auto mb-6">
                                <Mic className="w-8 h-8 text-neon" />
                            </div>

                            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                                You're Ready to Build Your Agent
                            </h2>
                            <p className="text-neon font-bold italic uppercase text-sm tracking-widest mb-4">
                                Click the Floating Orb
                            </p>
                            <p className="text-gray-400 text-sm font-medium tracking-wide">
                                Describe your business → We build your agent → We send it to you to test
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== POST-FORM 2: Larger Orb ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Post-Form 2 - Larger Orb</p>
                    <div className="bg-gradient-to-b from-ocean-900 to-ocean-950 rounded-2xl border border-white/10 text-center overflow-hidden max-w-md mx-auto">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-10 px-8">
                            {/* Large Orb visual */}
                            <div className="relative mx-auto mb-6 w-28 h-28">
                                <div className="absolute inset-0 bg-neon/20 rounded-full blur-xl animate-pulse" />
                                <div className="relative w-28 h-28 rounded-full border-4 border-neon flex items-center justify-center bg-ocean-900 shadow-[0_0_50px_rgba(217,255,65,0.4)]">
                                    <Mic className="w-10 h-10 text-neon" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                                You're Ready!
                            </h2>
                            <p className="text-neon font-bold italic uppercase text-sm tracking-widest mb-4">
                                Click the Floating Orb to Start
                            </p>
                            <p className="text-gray-400 text-sm font-medium tracking-wide">
                                Describe your business → We build your agent → We send it to you to test
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== POST-FORM 3: Compact ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Post-Form 3 - Compact</p>
                    <div className="bg-gradient-to-b from-ocean-900 to-ocean-950 rounded-2xl border border-white/10 text-center overflow-hidden max-w-sm mx-auto">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-8 px-6">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full border-3 border-neon flex items-center justify-center bg-ocean-900 shadow-[0_0_30px_rgba(217,255,65,0.3)]">
                                    <Mic className="w-6 h-6 text-neon" />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-lg font-black text-white uppercase tracking-tight">
                                        You're Ready!
                                    </h2>
                                    <p className="text-neon font-bold italic text-xs uppercase tracking-wide">
                                        Click the Orb →
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-500 text-xs font-medium">
                                Describe your business → We build → We send it to you
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===== POST-FORM 4: Full Instructions ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Post-Form 4 - Full Instructions</p>
                    <div className="bg-gradient-to-b from-ocean-900 to-ocean-950 rounded-2xl border border-white/10 text-center overflow-hidden max-w-md mx-auto">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-10 px-8">
                            <p className="font-mono text-base font-bold tracking-tighter text-white mb-4">
                                allconvos<span className="text-neon">_</span>
                            </p>

                            <h2 className="text-2xl font-black text-neon uppercase tracking-tight mb-6">
                                ✓ Details Saved!
                            </h2>

                            {/* Orb with arrow */}
                            <div className="relative mx-auto mb-6">
                                <div className="w-24 h-24 rounded-full border-4 border-neon flex items-center justify-center bg-ocean-900 shadow-[0_0_40px_rgba(217,255,65,0.3)] mx-auto">
                                    <Mic className="w-10 h-10 text-neon" />
                                </div>
                                <p className="text-white font-black text-lg mt-4">Click the Floating Orb</p>
                            </div>

                            <div className="space-y-2 text-left max-w-xs mx-auto">
                                <p className="text-gray-400 text-sm">
                                    <span className="text-neon font-bold">1.</span> Describe your business
                                </p>
                                <p className="text-gray-400 text-sm">
                                    <span className="text-neon font-bold">2.</span> We build your agent
                                </p>
                                <p className="text-gray-400 text-sm">
                                    <span className="text-neon font-bold">3.</span> We send it to you to test
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== POST-FORM 5: Minimal with Glow ===== */}
                <section className="space-y-4">
                    <p className="text-xs font-mono text-neon uppercase tracking-widest">Post-Form 5 - Minimal with Glow</p>
                    <div className="bg-gradient-to-b from-ocean-900 to-ocean-950 rounded-2xl border border-white/10 text-center overflow-hidden max-w-sm mx-auto">
                        <div className="h-2 bg-gradient-to-r from-neon via-cyan-400 to-neon" />
                        <div className="py-10 px-6">
                            {/* Glowing Orb */}
                            <div className="relative mx-auto mb-6 w-24 h-24">
                                <div className="absolute inset-0 bg-neon/30 rounded-full blur-2xl" />
                                <div className="absolute inset-2 bg-neon/20 rounded-full blur-lg animate-pulse" />
                                <div className="relative w-24 h-24 rounded-full border-4 border-neon flex items-center justify-center bg-ocean-950">
                                    <Mic className="w-10 h-10 text-neon" />
                                </div>
                            </div>

                            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                Now Click the Orb
                            </h2>
                            <p className="text-gray-500 text-sm">
                                to build your AI voice agent
                            </p>
                        </div>
                    </div>
                </section>

                {/* Instructions */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400">
                    <p className="font-bold text-white mb-2">📸 How to use:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Screenshot any variation above</li>
                        <li>Upload to GoHighLevel form as header image</li>
                        <li>Let me know which style you prefer and I can adjust the copy/colors</li>
                    </ol>
                </div>
            </div>
        </main>
    );
}
