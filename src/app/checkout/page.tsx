"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Shield, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const plans = [
    {
        id: "lite",
        name: "LITE_DEPLOYMENT",
        price: 199,
        priceDisplay: "$199",
        duration: "/mo",
        description: "Single-agent mission for small shops.",
        features: ["24/7 AI Receptionist", "Basic Lead Qualification", "SMS Notifications", "1,000 Actions/mo"],
        color: "border-blue-400",
        accent: "text-blue-400",
    },
    {
        id: "pro",
        name: "PRO_STRATEGY",
        price: 499,
        priceDisplay: "$499",
        duration: "/mo",
        description: "Full-scale mission control. Our most popular.",
        features: ["Unlimited AI Agents", "Deep Calendar Integration", "CRM Sync (HighLevel, etc)", "Priority System Support", "Everything in Lite"],
        color: "border-neon",
        accent: "text-neon",
        popular: true,
    },
];

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const initialPlan = searchParams.get("plan") || "pro";

    const [selectedPlan, setSelectedPlan] = useState(initialPlan);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        company: "",
    });

    const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // TODO: Integrate with Stripe when keys are provided
        // This will create a Stripe Checkout Session and redirect
        console.log("Creating subscription for:", currentPlan.name, formData);

        // Simulate loading for now
        setTimeout(() => {
            setIsLoading(false);
            alert("Stripe integration pending - provide your Stripe keys to activate payments!");
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-ocean-950 relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/#pricing"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        Launch your <span className="text-neon">AI Receptionist</span>
                    </h1>
                </div>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Left Column - Plan Selection & Payment */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Plan Selection */}
                        <div>
                            <h2 className="text-white font-bold text-lg mb-4">
                                Pick the best plan for your call volume
                            </h2>
                            <div className="space-y-4">
                                {plans.map((plan) => (
                                    <motion.div
                                        key={plan.id}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedPlan === plan.id
                                                ? `${plan.color} bg-white/5`
                                                : "border-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedPlan === plan.id ? plan.color : "border-white/30"
                                                }`}>
                                                {selectedPlan === plan.id && (
                                                    <div className={`w-2.5 h-2.5 rounded-full ${plan.accent === "text-neon" ? "bg-neon" : "bg-blue-400"}`} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={`font-mono font-black text-sm uppercase tracking-wider ${plan.accent}`}>
                                                        {plan.name.replace("_", " ")}
                                                    </span>
                                                    {plan.popular && (
                                                        <span className="px-2 py-0.5 bg-neon/20 text-neon text-[10px] font-black uppercase rounded-full">
                                                            Popular
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {plan.priceDisplay} per month. {plan.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Custom Plan */}
                                <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-mono font-black text-sm uppercase tracking-wider text-purple-400">
                                                ELITE_OVERSEER
                                            </span>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Need multi-location enterprise operations? <Link href="/build" className="text-purple-400 hover:text-purple-300 underline">Get in touch</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h2 className="text-white font-bold text-lg mb-4">
                                    Your Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon/50 transition-colors"
                                            placeholder="John Smith"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon/50 transition-colors"
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-2">Company Name</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon/50 transition-colors"
                                            placeholder="Acme Plumbing Co."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Placeholder */}
                            <div>
                                <h2 className="text-white font-bold text-lg mb-4">
                                    Add a payment method
                                </h2>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-400 text-sm">Card number</span>
                                        <div className="flex gap-2">
                                            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                                            <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-[8px] font-bold">MC</div>
                                            <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-[8px] font-bold">AMEX</div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-ocean-950 border border-white/10 text-gray-500 text-sm text-center">
                                        Stripe payment form will appear here once keys are configured
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="p-3 rounded-xl bg-ocean-950 border border-white/10 text-gray-500 text-sm">
                                            Expiration date
                                        </div>
                                        <div className="p-3 rounded-xl bg-ocean-950 border border-white/10 text-gray-500 text-sm">
                                            Security code
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            <p className="text-gray-500 text-xs">
                                By subscribing, you authorize allconvos_ to charge you according to the terms until you cancel.
                            </p>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full bg-neon text-ocean-950 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Subscribe to {currentPlan.name.replace("_", " ")}
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-8 space-y-6">
                            {/* Guarantee Badge */}
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                                <Shield className="w-5 h-5 text-green-400" />
                                <span className="text-green-400 text-sm font-bold">
                                    30-day money-back guarantee. <span className="font-normal text-green-400/70">Try risk-free</span>
                                </span>
                            </div>

                            {/* Order Summary Card */}
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                                <h3 className="text-white font-bold text-lg">Order Summary</h3>

                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-gray-500 text-[10px] font-mono uppercase tracking-wider">
                                                {currentPlan.name.replace("_", " ")} PLAN
                                            </p>
                                            <p className="text-white font-bold text-lg">
                                                {currentPlan.features[currentPlan.features.length - 1] === "Everything in Lite"
                                                    ? "Unlimited Agents"
                                                    : currentPlan.features[3]}
                                            </p>
                                        </div>
                                        <span className="text-white font-bold text-lg">
                                            {currentPlan.priceDisplay}/mo
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {currentPlan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                                                <Check className="w-4 h-4 text-neon shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Check className="w-4 h-4 text-neon shrink-0" />
                                            <span>No contract, cancel anytime</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Promo Code */}
                                <button className="text-neon text-sm font-medium hover:underline">
                                    Add promo code
                                </button>

                                {/* Totals */}
                                <div className="pt-6 border-t border-white/10 space-y-3">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Subtotal</span>
                                        <span>{currentPlan.priceDisplay}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Sales tax (0.00%)</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/10">
                                        <span>Total</span>
                                        <span>{currentPlan.priceDisplay}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
