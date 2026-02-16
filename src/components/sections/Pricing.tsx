"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        id: "lite",
        name: "FRONT_DESK_CORE",
        price: "$399",
        duration: "/mo",
        onboardingNote: "+ One-time onboarding fee (tailored)",
        description: "One receptionist. Fully autonomous. Always on.",
        features: ["24/7 AI Receptionist", "Calendar Integration", "CRM Lite", "Limited voices and accents", "SMS Notifications", "+ One-time onboarding fee (tailored)"],
        color: "text-blue-400",
        bg: "bg-blue-400/5",
        border: "border-blue-400/20"
    },
    {
        id: "pro",
        name: "LEAD_ENGINE",
        price: "$599",
        duration: "/mo",
        onboardingNote: "+ One-time onboarding fee (tailored)",
        description: "Handles leads from calls, SMS and web forms — end to end. (Includes Voice AI Receptionist)",
        features: [
            "Multi agents",
            "Calls + SMS + web forms included",
            "Lead capture + instant responses",
            "Automatic qualification + tagging",
            "Ongoing follow-up & nurturing",
            "CRM sync (HighLevel, etc.)",
            "Priority support",
            "Everything in Front Desk",
            "+ One-time onboarding fee (tailored)"
        ],
        color: "text-neon",
        bg: "bg-neon/10",
        border: "border-neon/40",
        popular: true
    },
    {
        id: "elite",
        name: "ELITE_OVERSEER",
        price: "CUSTOM",
        duration: "",
        description: "multi-location enterprise operations.",
        features: ["Multi-Agent Orchestration", "Predictive Analytics", "Dedicated Mission Support", "Custom API Integrations", "Full System Overseer", "+ One-time onboarding fee (tailored)"],
        color: "text-purple-400",
        bg: "bg-purple-400/5",
        border: "border-purple-400/20"
    }
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-ocean-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 italic uppercase tracking-tight">
                        INVESTMENT <span className="text-white/20">/</span> SCALE
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm uppercase tracking-widest">
                        Choose your level of operational perfection
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-8 rounded-2xl border ${plan.border} ${plan.bg} backdrop-blur-sm flex flex-col relative group overflow-hidden`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-neon text-ocean-950 font-mono text-[10px] font-bold px-4 py-1.5 uppercase italic rounded-bl-xl tracking-widest animate-pulse">
                                    RECOMMENDED
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-sm font-mono font-bold uppercase tracking-[0.3em] ${plan.color} mb-4`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-5xl font-bold text-white tracking-tighter">{plan.price}</span>
                                    <span className="text-gray-500 font-mono text-xs">{plan.duration}</span>
                                    {"onboardingNote" in plan && (
                                        <span className="ml-2 relative -top-[15px] text-[10px] font-mono uppercase tracking-wide text-gray-400">
                                            {plan.onboardingNote}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 font-mono text-[10px] uppercase leading-relaxed tracking-wider">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-3">
                                        <div className={`mt-1 h-1.5 w-1.5 rounded-full ${plan.color} shrink-0`} />
                                        <span className="text-xs font-mono text-gray-400 uppercase tracking-wide">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={plan.price === 'CUSTOM' ? '/contact' : `/start?plan=${plan.id}`}
                                className={`block w-full text-center py-4 rounded-xl font-mono uppercase italic tracking-widest text-xs transition-all duration-300 ${plan.popular
                                    ? 'bg-neon text-ocean-950 hover:bg-white'
                                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {plan.price === 'CUSTOM' ? 'Request Intel' : (plan.id === 'lite' ? 'Start Receptionist Setup' : (plan.id === 'pro' ? 'Start Pro' : 'Initialize Plan'))}
                            </Link>

                            {/* Decorative background badge */}
                            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                                <ShieldCheck className={`w-40 h-40 ${plan.color}`} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
