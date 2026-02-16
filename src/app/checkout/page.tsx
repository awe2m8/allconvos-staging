"use client";

import React, { useState, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Shield, ArrowLeft, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe";

type ConfirmationType = "payment_intent" | "setup_intent" | null;

interface CreateSubscriptionResponse {
    subscriptionId: string;
    clientSecret: string | null;
    confirmationType: ConfirmationType;
    status: string;
    error?: string;
}

const plans = [
    {
        id: "lite",
        name: "FRONT_DESK_CORE",
        price: 399,
        priceDisplay: "$399",
        duration: "/mo",
        description: "One receptionist. Fully autonomous. Always on.",
        features: ["24/7 AI Receptionist", "Calendar Integration", "CRM Lite", "Limited voices and accents", "SMS Notifications", "+ One-time onboarding fee (tailored)"],
        color: "border-blue-400",
        accent: "text-blue-400",
    },
    {
        id: "pro",
        name: "LEAD_ENGINE",
        price: 599,
        priceDisplay: "$599",
        duration: "/mo",
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
        color: "border-neon",
        accent: "text-neon",
        popular: true,
    },
];

const cardElementOptions = {
    style: {
        base: {
            fontSize: "16px",
            color: "#ffffff",
            fontFamily: "ui-monospace, monospace",
            "::placeholder": {
                color: "#9ca3af", // gray-400
            },
            iconColor: "#ffffff",
        },
        invalid: {
            color: "#ef4444",
            iconColor: "#ef4444",
        },
    },
    hidePostalCode: true, // cleaner interface
};

function CheckoutForm() {
    const searchParams = useSearchParams();
    const initialPlan = searchParams.get("plan") || "pro";

    const stripe = useStripe();
    const elements = useElements();

    const [selectedPlan, setSelectedPlan] = useState(initialPlan);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        company: "",
    });

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
            setError("Configuration Error: Stripe Publishable Key is missing. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to Vercel environment variables.");
        }
    }, []);

    const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        // Basic validation
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError("Card element not found");
            return;
        }

        // Show confirmation modal instead of submitting immediately
        setShowConfirmation(true);
    };

    const processPayment = async () => {
        if (!stripe || !elements) return;

        setIsLoading(true);
        setError(null);
        setShowConfirmation(false);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError("Card element not found");
            setIsLoading(false);
            return;
        }

        try {
            // Create a payment method
            const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: {
                    name: formData.fullName,
                    email: formData.email,
                },
            });

            if (pmError) {
                setError(pmError.message || "Payment failed");
                setIsLoading(false);
                return;
            }

            // Call our API to create the subscription
            const response = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    planId: currentPlan.id,
                    email: formData.email,
                    name: formData.fullName,
                    company: formData.company,
                }),
            });

            const data: CreateSubscriptionResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create subscription");
            }

            // If subscription requires confirmation (SCA or incomplete status)
            if (data.status === 'incomplete') {
                if (!data.clientSecret || !data.confirmationType) {
                    // Debug: Show detailed info to diagnose why secret is missing
                    throw new Error(`Payment setup failed. Server Ref: ${data.subscriptionId} Status: ${data.status}. Secrets: ${data.clientSecret ? 'YES' : 'NO'}. Data: ${JSON.stringify(data)}`);
                }

                if (data.confirmationType === "setup_intent") {
                    const { error: confirmError, setupIntent } = await stripe.confirmCardSetup(data.clientSecret, {
                        payment_method: paymentMethod.id,
                    });

                    if (confirmError) {
                        throw new Error(confirmError.message || "Payment method confirmation failed");
                    }

                    if (setupIntent?.status === "succeeded" || setupIntent?.status === "processing") {
                        window.location.href = `/checkout/success?plan=${currentPlan.id}`;
                        return;
                    }

                    throw new Error(`Payment method status: ${setupIntent?.status}`);
                }

                const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
                    payment_method: paymentMethod.id,
                });

                if (confirmError) {
                    throw new Error(confirmError.message || "Payment confirmation failed");
                }

                // If confirmation succeeded
                if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
                    window.location.href = `/checkout/success?plan=${currentPlan.id}`;
                    return;
                } else {
                    throw new Error(`Payment status: ${paymentIntent?.status}`);
                }
            } else if (data.status === 'active') {
                // Immediate success
                window.location.href = `/checkout/success?plan=${currentPlan.id}`;
                return;
            } else {
                // Unknown state - treat as error to be safe
                throw new Error("Subscription created but payment status is unknown. Please check your email.");
            }

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
            setError(message);
            console.error(err);
        }

        setIsLoading(false);
    };

    return (
        <main className="min-h-screen bg-ocean-950 relative">
            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-ocean-900 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-neon/5 rounded-full blur-[80px] pointer-events-none" />

                        <h3 className="text-2xl font-bold text-white mb-6 relative z-10">Confirm Subscription</h3>

                        <div className="space-y-4 mb-8 relative z-10">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white">{currentPlan.priceDisplay}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-gray-400">GST (10%)</span>
                                <span className="text-white">${(currentPlan.price * 0.10).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-gray-400">Total Due Today</span>
                                <span className="text-neon text-xl font-bold">${(currentPlan.price * 1.10).toFixed(2)}</span>
                            </div>
                            <div className="pt-2">
                                <p className="text-xs text-gray-500">
                                    By clicking confirm, you agree to be charged ${(currentPlan.price * 1.10).toFixed(2)} immediately and then monthly until cancelled.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-bold text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processPayment}
                                className="flex-1 px-4 py-3 rounded-xl bg-neon text-ocean-950 font-bold text-sm hover:bg-white transition-colors"
                            >
                                Confirm & Pay ${(currentPlan.price * 1.10).toFixed(2)}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
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
                        <form onSubmit={handleFormSubmit} className="space-y-6">
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

                            {/* Payment Method - Stripe Card Element */}
                            <div>
                                <h2 className="text-white font-bold text-lg mb-4">
                                    Add a payment method
                                </h2>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-400 text-sm">Card details</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
                                            <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-[8px] font-bold">MC</div>
                                            <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-[8px] font-bold">AMEX</div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-ocean-900 border border-white/10">
                                        <CardElement options={cardElementOptions} />
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Terms */}
                            <p className="text-gray-500 text-xs">
                                By subscribing, you authorize allconvos_ to charge you according to the terms until you cancel.
                            </p>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={isLoading || !stripe}
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
                                                {currentPlan.features[0]}
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
                                <button type="button" className="text-neon text-sm font-medium hover:underline">
                                    Add promo code
                                </button>

                                {/* Totals */}
                                <div className="pt-6 border-t border-white/10 space-y-3">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Subtotal</span>
                                        <span>{currentPlan.priceDisplay}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>GST (10%)</span>
                                        <span>${(currentPlan.price * 0.10).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/10">
                                        <span>Total</span>
                                        <span>${(currentPlan.price * 1.10).toFixed(2)}</span>
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

export default function CheckoutPage() {
    return (
        <Elements stripe={stripePromise}>
            <Suspense fallback={
                <div className="min-h-screen bg-ocean-950 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-neon animate-spin" />
                </div>
            }>
                <CheckoutForm />
            </Suspense>
        </Elements>
    );
}
