"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, PhoneForwarded, Terminal, Cpu } from "lucide-react";

const steps = [
    {
        title: "Free Build & Test",
        description: "Prototype your agent's core logic here for free. Experience the latency and response style instantly.",
        icon: <Terminal className="w-6 h-6" />,
        color: "text-blue-400",
        bg: "bg-blue-400/5",
        status: "Available Now"
    },
    {
        title: "Technical Refinement",
        description: "Once you're ready, we take over. Our engineers refine the prompt engineering, voice modulation, and AI guardrails.",
        icon: <Cpu className="w-6 h-6" />,
        color: "text-neon",
        bg: "bg-neon/5",
        status: "Expert Phase"
    },
    {
        title: "Full-Scale Deployment",
        description: "We attach a dedicated Australian business number, sync with your CRM (HighLevel, etc.), and link your calendar.",
        icon: <PhoneForwarded className="w-6 h-6" />,
        color: "text-purple-400",
        bg: "bg-purple-400/5",
        status: "Production Ready"
    }
];

export function BuildNextSteps() {
    return (
        <section className="py-24 relative">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-mono uppercase tracking-[0.3em] mb-6"
                    >
                        Succession_Plan
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4 italic uppercase">
                        Prototype to <span className="text-neon">Production.</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-mono text-xs uppercase tracking-widest leading-relaxed">
                        // From free testing to professional grade deployment
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-8 rounded-2xl border border-white/5 ${step.bg} backdrop-blur-sm relative group`}
                        >
                            <div className={`${step.color} mb-6`}>
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight italic uppercase">
                                {step.title}
                            </h3>

                            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                                {step.description}
                            </p>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                    Status
                                </span>
                                <span className={`text-[10px] font-mono ${step.color} uppercase tracking-widest font-bold`}>
                                    {step.status}
                                </span>
                            </div>

                            {/* Decorative line */}
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-${step.color.split('-')[1]}-400/40 to-transparent`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
