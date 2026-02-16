"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Phone, Target, Cpu, TrendingUp, Search, Calendar, Filter, ChevronDown, MoreHorizontal } from "lucide-react";

export function DashboardPreview() {
    const chartBars = useMemo(
        () =>
            Array.from({ length: 24 }, (_, i) => {
                const noise = (offset: number) => {
                    const seed = Math.sin((i + 1) * 12.9898 + offset) * 43758.5453;
                    return seed - Math.floor(seed);
                };

                const h1 = 20 + noise(0.31) * 150;
                const h2 = 10 + noise(1.73) * 80;
                const h3 = 5 + noise(2.47) * 40;

                return { h1, h2, h3 };
            }),
        []
    );

    return (
        <section className="py-24 bg-ocean-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 mb-6"
                    >
                        <Activity className="w-3 h-3 text-neon" />
                        <span className="text-[10px] font-mono text-neon uppercase tracking-widest font-bold">SYSTEM_PREVIEW_v4.2</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 italic tracking-tight uppercase">
                        MISSION CONTROL <span className="text-white/20">/</span> DASHBOARD
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm leading-relaxed">
                        // Total visibility over every conversation. Simple. Lethal. Effective.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-ocean-900/50 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.4)]"
                >
                    {/* Browser-like Header */}
                    <div className="h-14 border-b border-white/10 bg-black/40 flex items-center px-6 justify-between">
                        <div className="flex items-center gap-6">
                            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                                <Activity className="w-4 h-4 text-neon" />
                                Call History
                            </h3>
                            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/40">
                                    <Calendar className="w-3 h-3" />
                                    Currently viewing: <span className="text-white/80">This month</span>
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Search className="w-3.5 h-3.5 text-white/40" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Top Metrics Cards - Competitor Inspired */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            {[
                                {
                                    label: 'Total Calls',
                                    value: '1,284',
                                    icon: Phone,
                                    color: 'text-white',
                                    bg: 'bg-white/5',
                                    accent: 'border-white/10'
                                },
                                {
                                    label: 'New Leads Found',
                                    value: '432',
                                    icon: Target,
                                    color: 'text-neon',
                                    bg: 'bg-neon/5',
                                    accent: 'border-neon/20'
                                },
                                {
                                    label: 'AI Handled',
                                    value: '1,211',
                                    icon: Cpu,
                                    color: 'text-blue-400',
                                    bg: 'bg-blue-400/5',
                                    accent: 'border-blue-400/20'
                                },
                                {
                                    label: 'ROI Generated',
                                    value: '$12.4k',
                                    icon: TrendingUp,
                                    color: 'text-green-400',
                                    bg: 'bg-green-400/5',
                                    accent: 'border-green-400/20'
                                },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-6 rounded-xl border ${stat.accent} ${stat.bg} relative group hover:bg-white/10 transition-colors duration-300`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg bg-black/40 border border-white/10 ${stat.color}`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <MoreHorizontal className="w-4 h-4 text-white/20" />
                                    </div>
                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <h4 className={`text-3xl font-bold ${stat.color} tracking-tight`}>{stat.value}</h4>

                                    {/* Bottom glow line */}
                                    <div className={`absolute bottom-0 left-6 right-6 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${stat.color} bg-current blur-[2px]`} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Middle Action/Filter Bar */}
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                                    <Filter className="w-3 h-3" />
                                    Quick Filters:
                                </div>
                                <div className="flex gap-3">
                                    {['All Calls', 'Qualified', 'Missed', 'Spam'].map((filter, i) => (
                                        <button key={i} className={`px-4 py-1.5 rounded-full text-[10px] font-mono border transition-all ${i === 0 ? 'bg-neon/10 border-neon/30 text-neon' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'}`}>
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Visualization Area */}
                        <div className="relative rounded-xl bg-black/40 border border-white/10 p-8 min-h-[400px]">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h4 className="text-xl font-bold text-white italic uppercase tracking-tight">Calls this month</h4>
                                    <p className="text-[10px] font-mono text-white/30">Jan 01, 2026 - Jan 30, 2026</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded bg-neon/80" />
                                        <span className="text-[10px] font-mono text-white/60">New Leads</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded bg-blue-400/80" />
                                        <span className="text-[10px] font-mono text-white/60">Existing Clients</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded bg-white/20" />
                                        <span className="text-[10px] font-mono text-white/60">Other</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[280px] w-full flex items-end justify-between gap-1 md:gap-4 px-4 overflow-hidden">
                                {chartBars.map(({ h1, h2, h3 }, i) => {
                                    return (
                                        <div key={i} className="flex-1 flex flex-col justify-end gap-[2px] group relative">
                                            {/* Stacked bar visualization */}
                                            <motion.div
                                                initial={{ height: 0 }}
                                                whileInView={{ height: h3 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.02 + 0.3 }}
                                                className="w-full bg-white/10 rounded-t-[2px]"
                                            />
                                            <motion.div
                                                initial={{ height: 0 }}
                                                whileInView={{ height: h2 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.02 + 0.2 }}
                                                className="w-full bg-blue-400/40"
                                            />
                                            <motion.div
                                                initial={{ height: 0 }}
                                                whileInView={{ height: h1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.02 + 0.1 }}
                                                className="w-full bg-gradient-to-t from-neon/20 to-neon/80 rounded-b-[2px] group-hover:from-neon/40 group-hover:to-neon transition-all"
                                            />

                                            {/* Tooltip on hover */}
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-ocean-950 px-2 py-1 rounded text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                                Day {i + 1}: {Math.round(h1 + h2 + h3)} Calls
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* X-Axis Labels */}
                            <div className="flex justify-between mt-4 px-4 border-t border-white/5 pt-4">
                                {[1, 7, 14, 21, 28].map(day => (
                                    <span key={day} className="text-[9px] font-mono text-white/20">JAN {day}</span>
                                ))}
                            </div>

                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-8 opacity-10">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="w-full h-px bg-white/10" />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-neon/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        </section>
    );
}
