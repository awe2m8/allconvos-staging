"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Terminal, MessageSquare, ShieldCheck, Play, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";

export function MessagingDemo() {
    const [isDemoStarted, setIsDemoStarted] = useState(false);
    const [isPermissionsLoading, setIsPermissionsLoading] = useState(false);
    const [micPermissionGranted, setMicPermissionGranted] = useState(false);
    const frameRef = useRef<HTMLIFrameElement>(null);

    const handleStartDemo = async () => {
        setIsPermissionsLoading(true);
        try {
            // Explicitly request microphone access via user gesture
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop tracks immediately - we just need the permission grant
            stream.getTracks().forEach(track => track.stop());

            setMicPermissionGranted(true);
            setIsDemoStarted(true);
        } catch (err) {
            console.error('Microphone access denied or error:', err);
            // Even if denied, we'll try to show the widget so the user can see it fails gracefully
            setIsDemoStarted(true);
        } finally {
            setIsPermissionsLoading(false);
        }
    };

    useEffect(() => {
        if (!isDemoStarted) return;

        const checkPermissions = () => {
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({ name: 'microphone' as PermissionName })
                    .then(result => {
                        console.log('Mic Permission Status:', result.state);
                        setMicPermissionGranted(result.state === 'granted');
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
    }, [isDemoStarted]);

    return (
        <section id="messaging-demo" className="py-24 bg-ocean-950 relative overflow-hidden">
            {/* Subtle Glow Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-neon/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-[10px] font-mono uppercase tracking-widest">
                                <Terminal className="w-3 h-3" />
                                Interactive_Environment_v4.5
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Experience the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-400">Future of Sales.</span>
                            </h2>

                            <p className="text-lg text-gray-400 leading-relaxed max-w-md">
                                Modern browsers require explicit permission to use your microphone. Click the button to grant access and start your live conversation with our AI receptionist.
                            </p>

                            <div className="flex flex-col gap-4 text-sm font-mono uppercase tracking-widest">
                                <div className="flex items-center gap-3 text-neon/60">
                                    <div className="w-2 h-2 rounded-full bg-neon shadow-[0_0_8px_rgba(163,230,53,1)]" />
                                    Live_Voice_Processing
                                </div>
                                <div className="flex items-center gap-3 text-white/40">
                                    <div className="w-2 h-2 rounded-full bg-white/20" />
                                    User-Gesture_Privacy_Safe
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-neon/10 rounded-3xl blur-2xl" />

                        <div className="relative bg-ocean-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[440px] flex flex-col">
                            {/* Window Header */}
                            <div className="bg-ocean-950 border-b border-white/10 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-neon" />
                                    <span className="text-sm font-bold text-white uppercase tracking-tighter">AI_Receptionist_Live</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isDemoStarted ? 'bg-neon animate-pulse' : 'bg-gray-600'}`} />
                                        <span className={`text-[10px] font-mono uppercase tracking-widest ${isDemoStarted ? 'text-neon' : 'text-gray-500'}`}>
                                            {isDemoStarted ? 'Online' : 'Standby'}
                                        </span>
                                    </div>
                                    <ShieldCheck className="w-4 h-4 text-white/20" />
                                </div>
                            </div>

                            {/* Assistant Container */}
                            <div className="flex-1 bg-black/20 p-6 flex flex-col items-center justify-center min-h-[340px] relative">
                                <AnimatePresence mode="wait">
                                    {!isDemoStarted ? (
                                        <motion.div
                                            key="overlay"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-ocean-900/60 backdrop-blur-sm p-8 text-center"
                                        >
                                            <div className="p-4 rounded-full bg-neon/10 border border-neon/20 mb-6 drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                                                <Mic className="w-8 h-8 text-neon" />
                                            </div>
                                            <h4 className="text-white font-bold mb-2">Microphone Access Required</h4>
                                            <p className="text-gray-400 text-sm mb-8 max-w-xs">
                                                To talk with the AI, please click below to grant microphone permission.
                                            </p>
                                            <Button
                                                onClick={handleStartDemo}
                                                disabled={isPermissionsLoading}
                                                className="group min-w-[200px]"
                                            >
                                                {isPermissionsLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        Start Voice Demo <Play className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="widget"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-full max-w-md bg-ocean-800/50 border border-white/5 rounded-2xl overflow-hidden shadow-inner p-4"
                                        >
                                            <iframe
                                                ref={frameRef}
                                                src="https://iframes.ai/o/1760442563274x523950783927418900?color=ffffff&icon="
                                                allow="microphone *; camera *; autoplay *; encrypted-media *; fullscreen *; display-capture *; picture-in-picture *; clipboard-read *; clipboard-write *;"
                                                className="w-full h-[200px] border-none"
                                                id="assistantFrame"
                                                title="Voice AI Demo"
                                            />
                                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-6">
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
                                                    <Mic className={`w-3 h-3 ${micPermissionGranted ? 'text-neon' : 'text-red-500'}`} />
                                                    {micPermissionGranted ? 'Mic Active' : 'Mic Blocked'}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
                                                    <ShieldCheck className="w-3 h-3 text-neon/40" />
                                                    Secure_Link
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
