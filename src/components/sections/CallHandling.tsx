"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Users, Hammer, Dumbbell, Play, Pause, Volume2 } from "lucide-react";

export function CallHandling() {
    const [playing, setPlaying] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = (type: string) => {
        if (playing === type) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setPlaying(null);
        } else {
            if (audioRef.current) {
                // Stop any current playback
                audioRef.current.pause();
                audioRef.current.currentTime = 0;

                // Use explicit file mapping so each industry can point to its latest demo asset.
                const audioFileByType: Record<string, string> = {
                    Tradies: "tradies.mp3",
                    Gyms: "gymdemoV1.mp3",
                };
                audioRef.current.src = `/audio/${audioFileByType[type] ?? "tradies.mp3"}`;
                audioRef.current.load();
                audioRef.current.volume = 1.0;

                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.error("Audio playback interrupted or failed:", err);
                        setPlaying(null);
                    });
                }
                setPlaying(type);
            }
        }
    };

    const categories = [
        {
            id: "Tradies",
            icon: <Hammer className="w-6 h-6" />,
            title: "Tradies",
            description: "Dispatch teams and capture job details while you're on tools.",
            color: "from-blue-500/20 to-cyan-500/20",
            accent: "text-blue-400",
        },
        {
            id: "Gyms",
            icon: <Dumbbell className="w-6 h-6" />,
            title: "Gyms",
            description: "Book trial classes and handle membership enquiries 24/7.",
            color: "from-purple-500/20 to-pink-500/20",
            accent: "text-purple-400",
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-ocean-950">
            <audio
                ref={audioRef}
                onEnded={() => setPlaying(null)}
                className="hidden"
            />

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <div className="h-px w-8 bg-neon/30" />
                        <span className="text-neon text-sm font-black uppercase tracking-[0.3em]">
                            Industry Specific
                        </span>
                        <div className="h-px w-8 bg-neon/30" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter"
                    >
                        Versatile <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-white">Call Handling</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium"
                    >
                        AI answering customized for your industry. serve new leads and existing clients on the same line with your own customized call playbooks.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className={`relative group p-8 rounded-3xl bg-gradient-to-br ${cat.color} border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-500`}
                        >
                            <div className="flex flex-col h-full">
                                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${cat.accent}`}>
                                    {cat.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                                    {cat.title}
                                </h3>

                                <p className="text-gray-400 mb-8 font-medium leading-relaxed">
                                    {cat.description}
                                </p>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => handlePlay(cat.id)}
                                        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${playing === cat.id
                                            ? "bg-white text-black scale-95"
                                            : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                                            }`}
                                    >
                                        <AnimatePresence mode="wait">
                                            {playing === cat.id ? (
                                                <motion.div
                                                    key="pause"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <Pause className="w-5 h-5 fill-current" />
                                                    Stop Demo
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="play"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <Play className="w-5 h-5 fill-current" />
                                                    Listen to {cat.title} Demo
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </div>
                            </div>

                            {/* Decorative Pulse when playing */}
                            {playing === cat.id && (
                                <div className="absolute -inset-1 rounded-[32px] border-2 border-neon/30 animate-pulse pointer-events-none" />
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Industry Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 flex flex-wrap justify-center gap-4 filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                >
                    {["Real Estate", "Medical", "Automotive", "Home Services", "Tradies", "Gyms", "Med Spas", "Fitness Studios"].map((industry) => (
                        <span key={industry} className="px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                            {industry}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
