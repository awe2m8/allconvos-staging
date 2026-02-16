"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PlanId } from "@/lib/billing";

interface CheckoutButtonProps {
  planId: PlanId;
}

interface CheckoutResponse {
  url?: string;
  error?: string;
}

export function CheckoutButton({ planId }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok) {
        throw new Error(data.error || "Could not start checkout");
      }

      if (!data.url) {
        throw new Error("Stripe did not return a checkout URL");
      }

      window.location.href = data.url;
    } catch (checkoutError: unknown) {
      const message = checkoutError instanceof Error ? checkoutError.message : "Could not start checkout";
      setError(message);
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-4 font-mono uppercase tracking-widest text-xs bg-neon text-ocean-950 hover:bg-white transition-colors disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting...
          </>
        ) : (
          "Continue to Secure Checkout"
        )}
      </button>

      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
    </div>
  );
}
