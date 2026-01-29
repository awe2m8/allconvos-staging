"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import Link from "next/link";
import { ArrowRight, Bot, User, CheckCircle } from "lucide-react";

export function Hero() {

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 bg-ocean-800/50 border border-white/10 px-3 py-1 rounded-full"
                    >
                        <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                        <span className="text-xs font-mono text-neon uppercase tracking-wider">Operational 24/7/365</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-bold leading-[0.9] text-white"
                    >
                        STOP MISSING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-400">CALLS.</span> <br />
                        START MAKING <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-400">MONEY.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-lg leading-relaxed"
                    >
                        The AI receptionist that answers every call, qualifies every lead, and books jobs 24/7—so you can get back on the tools.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <Link href="#pricing">
                            <Button>Build My AI Agent</Button>
                        </Link>
                        <Button
                            variant="secondary"
                            className="group"
                            onClick={() => document.getElementById('messaging-demo')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Voice Demo Active <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-xs font-mono text-neon/60 uppercase tracking-widest pt-4"
                    >
                        No complex setup. No "tech bro" jargon. Just results.
                    </motion.p>
                </div>

                {/* Hero Visual: Mission Control Interface */}
                <motion.div
                    id="mission-control"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon to-blue-600 rounded-lg blur opacity-20" />
                    <div className="relative bg-ocean-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                        <div className="bg-ocean-950 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest hidden sm:block">For Illustration Only</span>
                            </div>
                            <div className="font-mono text-xs text-gray-500">live_agent_v2.0.exe</div>
                        </div>

                        <div className="p-6 space-y-4 font-mono text-sm">
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"><User className="w-4 h-4" /></div>
                                <div className="bg-ocean-800 p-3 rounded-lg rounded-tl-none border border-white/5 text-gray-300">
                                    <p>Hey, do you guys do emergency plumbing in Ballina?</p>
                                </div>
                            </div>

                            {/* Chat Message 2 */}
                            <div className="flex items-start space-x-4 justify-end">
                                <div className="bg-neon/10 p-3 rounded-lg rounded-tr-none border border-neon/20 text-neon">
                                    <p>We sure do! We have a tech available in Ballina this afternoon. Is it urgent?</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center shrink-0 text-ocean-950 font-bold"><Bot className="w-4 h-4" /></div>
                            </div>

                            {/* Chat Message 3 */}
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"><User className="w-4 h-4" /></div>
                                <div className="bg-ocean-800 p-3 rounded-lg rounded-tl-none border border-white/5 text-gray-300">
                                    <p>Yeah, hot water system just burst. Water everywhere.</p>
                                </div>
                            </div>

                            {/* Notification Overlay */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="absolute bottom-6 right-6 left-6 bg-ocean-800 border-l-4 border-neon p-4 shadow-2xl"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status Update</p>
                                        <p className="text-white font-bold">New Job Booked: $450+</p>
                                        <p className="text-xs text-gray-400 mt-1">Calendar Updated • SMS Sent to Dave</p>
                                    </div>
                                    <div className="bg-neon/20 p-2 rounded text-neon">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
