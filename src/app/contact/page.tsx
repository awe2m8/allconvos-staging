"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="bg-ocean-950 min-h-screen relative overflow-x-hidden flex flex-col">
            <Navbar />

            <div className="flex-grow pt-32 pb-24 relative">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse" />

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start relative z-10 w-full">

                    {/* Left Column: Contact Info */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 uppercase italic tracking-tighter">
                                INITIALIZE <span className="text-neon">CONTACT</span>
                            </h1>
                            <p className="text-gray-400 max-w-lg font-mono text-sm leading-relaxed">
                                Ready to deploy your AI workforce? Our mission control is standing by to configure your custom solution.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-ocean-900/50 border border-white/5 hover:border-neon/30 transition-colors group">
                                <div className="p-3 rounded-lg bg-neon/10 text-neon group-hover:bg-neon group-hover:text-ocean-950 transition-colors">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold uppercase tracking-wide mb-1">Direct Line</h3>
                                    <p className="text-gray-400 font-mono text-sm">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-ocean-900/50 border border-white/5 hover:border-neon/30 transition-colors group">
                                <div className="p-3 rounded-lg bg-neon/10 text-neon group-hover:bg-neon group-hover:text-ocean-950 transition-colors">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold uppercase tracking-wide mb-1">Encrypted Comms</h3>
                                    <p className="text-gray-400 font-mono text-sm">mission@allconvos.ai</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-ocean-900/50 border border-white/5 hover:border-neon/30 transition-colors group">
                                <div className="p-3 rounded-lg bg-neon/10 text-neon group-hover:bg-neon group-hover:text-ocean-950 transition-colors">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold uppercase tracking-wide mb-1">Base Of Operations</h3>
                                    <p className="text-gray-400 font-mono text-sm">
                                        Level 42, Cyber Tower One<br />
                                        San Francisco, CA 94105
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-ocean-900 border border-white/10 rounded-2xl p-8 lg:p-10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <div className="w-32 h-32 border-r-2 border-t-2 border-neon rounded-tr-3xl" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-neon rounded-full" />
                            Transmission Form
                        </h2>

                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-neon uppercase tracking-wider pl-1">Name</label>
                                    <input
                                        type="text"
                                        placeholder="T. Stark"
                                        className="w-full bg-ocean-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-neon uppercase tracking-wider pl-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="tony@stark.com"
                                        className="w-full bg-ocean-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-neon uppercase tracking-wider pl-1">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full bg-ocean-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-neon uppercase tracking-wider pl-1">Mission Parameters</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your custom build requirements..."
                                    className="w-full bg-ocean-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all font-mono text-sm resize-none"
                                />
                            </div>

                            <Button className="w-full py-6 text-sm font-mono uppercase tracking-widest group bg-neon text-ocean-950 hover:bg-white transition-colors border-none">
                                Send Transmission <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <p className="text-center text-[10px] text-gray-500 font-mono pt-2">
                                * Secure channel established. 256-bit encryption active.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
