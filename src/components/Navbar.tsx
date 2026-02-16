"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
    return (
        <nav className="fixed w-full z-50 top-0 left-0 bg-ocean-950/80 backdrop-blur-lg border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="font-mono text-2xl font-bold tracking-tighter text-white">
                    allconvos<span className="text-neon">_</span>
                </Link>

                <div className="hidden md:flex space-x-8 text-sm font-mono text-gray-400">
                    <Link href="#problem" className="hover:text-neon transition-colors">The Problem</Link>
                    <Link href="#how" className="hover:text-neon transition-colors">How It Works</Link>
                    <Link href="#pricing" className="hover:text-neon transition-colors">Pricing</Link>
                    <Link href="/build" className="text-neon hover:text-white transition-colors">Build My Agent</Link>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <SignedOut>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-5 py-2 text-sm border-2 border-neon/30 text-neon rounded-sm font-bold uppercase tracking-wide font-mono hover:border-neon hover:bg-neon/10 transition-all"
                        >
                            Member Login
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link
                            href="/app/onboarding"
                            className="inline-flex items-center justify-center px-5 py-2 text-sm border-2 border-neon/30 text-neon rounded-sm font-bold uppercase tracking-wide font-mono hover:border-neon hover:bg-neon/10 transition-all"
                        >
                            Open App
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
