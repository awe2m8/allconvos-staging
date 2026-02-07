"use client";

import { motion } from "framer-motion";
import { TrendingDown, RefreshCcw, BellOff, XCircle, AlertTriangle, Terminal, Activity } from "lucide-react";

export function Problem() {
    const painPoints = [
        {
            title: "LEAKING REVENUE",
            description: "A ringing phone you can't answer is a lead going straight to the next guy on Google. You're paying for marketing just to lose the job to the first person who picks up.",
            icon: TrendingDown,
            accent: "text-red-500",
            bg: "bg-red-500/5",
            border: "border-red-500/20"
        },
        {
            title: "ADMIN OVERLOAD",
            description: "Spending your nights returning voicemails and playing phone tag isn't 'growing'—it's drowning. You're a business owner, not a secretary.",
            icon: BellOff,
            accent: "text-yellow-500",
            bg: "bg-yellow-500/5",
            border: "border-yellow-500/20"
        },
        {
            title: "TECH BRO FATIGUE",
            description: "You don't need another 'platform', 'AI chatbot', or complex dashboard. You need an employee that answers the phone and books the work. Period.",
            icon: AlertTriangle,
            accent: "text-blue-500",
            bg: "bg-blue-500/5",
            border: "border-blue-500/20"
        }
    ];

    return (
        <section id="problem" className="py-32 bg-ocean-950 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <div className="h-px w-8 bg-red-500/30" />
                        <span className="text-red-500 text-sm font-black uppercase tracking-[0.3em]">
                            The Hard Truth
                        </span>
                        <div className="h-px w-8 bg-red-500/30" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter uppercase italic"
                    >
                        YOUR VOICEMAIL IS WHERE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">MONEY GOES TO DIE.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-mono uppercase tracking-widest leading-relaxed"
                    >
                        // EVERY COMPLETED LEAD IS A $500+ LOSS. STOP PAYING THE "SILENCE TAX".
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {painPoints.map((point, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className={`p-8 rounded-2xl ${point.bg} border ${point.border} backdrop-blur-sm group hover:border-white/20 transition-all duration-500`}
                        >
                            <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-8 ${point.accent} group-hover:scale-110 transition-transform duration-500`}>
                                <point.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase">
                                {point.title}
                            </h3>
                            <p className="text-gray-400 font-mono text-sm leading-relaxed uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                                {point.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10 text-center max-w-4xl mx-auto"
                >
                    <p className="text-white text-lg font-bold italic tracking-tight">
                        "I WAS MISSING 3-4 CALLS A DAY WHILE ON SITE. SINCE STARTING WITH ALLCONVOS, EVERY SINGLE ONE OF THOSE IS NOW A PITCH OR A BOOKING."
                    </p>
                </motion.div>

                {/* PROTOTYPE TO PRODUCTION SECTION */}
                <div className="mt-32 border-t border-white/5 pt-32">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-6"
                        >
                            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Succession_Plan</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tighter uppercase italic"
                        >
                            PROTOTYPE TO <span className="text-neon">PRODUCTION.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 font-mono text-sm uppercase tracking-widest"
                        >
                            // From free testing to professional grade deployment
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {/* Card 1: Free Build & Test */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-ocean-900/50 border border-white/5 rounded-2xl p-8 hover:border-blue-500/30 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50" />
                            <div className="mb-6">
                                <Terminal className="w-8 h-8 text-blue-400 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Free Build & Test</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Prototype your agent's core logic here for free. Experience the latency and response style instantly.
                                </p>
                            </div>
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status</span>
                                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Available Now</span>
                            </div>
                        </motion.div>

                        {/* Card 2: Technical Refinement */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-ocean-900/50 border border-white/5 rounded-2xl p-8 hover:border-neon/30 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon to-transparent opacity-50" />
                            <div className="mb-6">
                                <div className="w-8 h-8 text-neon mb-6">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Technical Refinement</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Once you're ready, we take over. Our engineers refine the prompt engineering, voice modulation, and AI guardrails.
                                </p>
                            </div>
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status</span>
                                <span className="text-[10px] font-mono text-neon uppercase tracking-widest font-bold">Expert Phase</span>
                            </div>
                        </motion.div>

                        {/* Card 3: Full-Scale Deployment */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="bg-ocean-900/50 border border-white/5 rounded-2xl p-8 hover:border-purple-500/30 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent opacity-50" />
                            <div className="mb-6">
                                <Activity className="w-8 h-8 text-purple-400 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Full-Scale Deployment</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    We attach a dedicated Australian business number, sync with your CRM (HighLevel, etc.), and link your calendar.
                                </p>
                            </div>
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status</span>
                                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Production Ready</span>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="text-center"
                    >
                        <a href="/build" className="inline-flex items-center gap-2 bg-neon text-ocean-950 px-8 py-4 rounded-xl font-mono uppercase font-bold tracking-wider hover:bg-white transition-colors group">
                            Build your agent now
                            <TrendingDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
