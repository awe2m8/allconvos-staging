"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { LoginModal } from "./ui/LoginModal";

export function Navbar() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
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

                    <div className="hidden md:block">
                        <Button
                            variant="secondary"
                            className="px-5 py-2 text-sm border-neon/30 h-auto"
                            onClick={() => setIsLoginOpen(true)}
                        >
                            Member Login
                        </Button>
                    </div>
                </div>
            </nav>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}
