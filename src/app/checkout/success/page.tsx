"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const planNames: Record<string, string> = {
    lite: "FRONT_DESK_CORE",
};

function SuccessContent() {
    const searchParams = useSearchParams();
    const planId = searchParams.get("plan") || "lite";
    const planName = planNames[planId] || "Your Plan";

    return (
        <main className="min-h-screen bg-ocean-950 relative flex items-center justify-center">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-12 h-12 text-green-400" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                        Welcome to <span className="text-neon">allconvos_</span>
                    </h1>

                    <p className="text-gray-400 text-lg mb-2">
                        Your subscription to <span className="text-white font-bold">{planName.replaceAll("_", " ")}</span> is now active.
                    </p>

                    <p className="text-gray-500 text-sm">
                        Check your email for confirmation and next steps.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
                        <h3 className="text-white font-bold mb-4">What&apos;s Next?</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-neon/20 rounded-full flex items-center justify-center text-neon text-xs font-bold shrink-0">1</span>
                                <span>Our team will reach out within 24 hours to begin your AI setup</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-neon/20 rounded-full flex items-center justify-center text-neon text-xs font-bold shrink-0">2</span>
                                <span>We&apos;ll configure your AI receptionist based on your business needs</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-neon/20 rounded-full flex items-center justify-center text-neon text-xs font-bold shrink-0">3</span>
                                <span>Go live and start capturing leads 24/7!</span>
                            </li>
                        </ul>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-neon text-ocean-950 px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors"
                    >
                        Return to Homepage
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-ocean-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-neon animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
