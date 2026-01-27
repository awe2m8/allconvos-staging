"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState, useRef } from "react";

export function VSL() {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlay = () => {
        setIsPlaying(true);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    return (
        <section className="py-24 bg-ocean-950 relative overflow-hidden text-center">
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 italic">
                        DEMO: TURNING CALLS INTO REVENUE
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm">
                        // Real-time automation. No fluff.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-ocean-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] group cursor-pointer ring-1 ring-white/5"
                    onClick={handlePlay}
                >
                    {/* Video Element */}
                    <video
                        ref={videoRef}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                        src="/vsl-demo.mp4"
                        controls={isPlaying}
                        playsInline
                    />

                    {/* Placeholder Thumbnail UI */}
                    {!isPlaying && (
                        <div className="absolute inset-0 bg-gradient-to-br from-ocean-900 via-ocean-950 to-black flex items-center justify-center z-10">
                            <div className="absolute inset-0 opacity-10 bg-[url('/tech-grid.svg')] bg-grid" />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl group-hover:bg-neon/20 group-hover:border-neon group-hover:shadow-[0_0_40px_rgba(7,222,20,0.3)] transition-all duration-500">
                                    <Play className="w-8 h-8 text-white group-hover:text-neon fill-white/20 group-hover:fill-neon/20 ml-1 transition-colors" />
                                </div>
                                <span className="mt-8 text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] font-bold group-hover:text-neon transition-colors">
                                    INIT_PLAYBACK_SYSTEM
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Frame Decoration (Always Visible) */}
                    <div className="absolute top-4 left-6 flex space-x-2 z-20 pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                    </div>

                    {!isPlaying && (
                        <div className="absolute bottom-6 right-6 flex items-center gap-3 z-20 pointer-events-none">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-none">REC</span>
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-none">
                                HQ_STREAM_01
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
