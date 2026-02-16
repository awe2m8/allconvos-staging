import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { normalizePlanId, PLAN_DETAILS } from "@/lib/billing";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";

interface BillingCheckoutPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readSingleParam(raw: string | string[] | undefined): string | undefined {
  if (typeof raw === "string") {
    return raw;
  }

  if (Array.isArray(raw)) {
    return raw[0];
  }

  return undefined;
}

export default async function BillingCheckoutPage({ searchParams }: BillingCheckoutPageProps) {
  const params = await searchParams;
  const requestedPlan = normalizePlanId(readSingleParam(params.plan));

  const { userId } = await auth();
  if (!userId) {
    redirect(`/signup?plan=${requestedPlan}`);
  }

  const subscription = await getLatestSubscriptionForUser(userId);
  if (subscription && isActiveSubscriptionStatus(subscription.status)) {
    redirect("/app/onboarding");
  }

  const selectedPlan = PLAN_DETAILS[requestedPlan];

  return (
    <main className="min-h-screen bg-ocean-950 py-28 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link href="/#pricing" className="text-gray-400 hover:text-white text-sm font-mono">
          Back to pricing
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6">
          <div>
            <p className="text-neon text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Billing Checkout</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">{selectedPlan.name}</h1>
            <p className="text-gray-400 mt-2 text-sm">{selectedPlan.description}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-5 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Plan price</p>
              <p className="text-gray-400 text-xs">Tax and onboarding fee are calculated in Stripe Checkout.</p>
            </div>
            <p className="text-neon font-bold text-xl">{selectedPlan.monthlyPriceLabel}</p>
          </div>

          <CheckoutButton planId={requestedPlan} />

          <p className="text-[11px] text-gray-500 font-mono">
            By continuing, you will complete payment in Stripe. Your onboarding access is granted after successful payment.
          </p>
        </div>
      </div>
    </main>
  );
}
