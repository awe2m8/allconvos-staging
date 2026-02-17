import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { DEFAULT_PLAN_ID, PLAN_DETAILS } from "@/lib/billing";
import { appUrl, marketingUrl } from "@/lib/siteUrls";
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
  const rawPlan = readSingleParam(params.plan);
  const hasExplicitPlan = rawPlan === "lite";
  const selectedPlanId = DEFAULT_PLAN_ID;
  const selectedPlan = PLAN_DETAILS[selectedPlanId];

  const { userId } = await auth();
  if (!userId) {
    if (hasExplicitPlan || rawPlan === "pro") {
      redirect(appUrl(`/signup?plan=${selectedPlanId}`));
    }
    redirect(appUrl("/signup"));
  }

  const subscription = await getLatestSubscriptionForUser(userId);
  if (subscription && isActiveSubscriptionStatus(subscription.status)) {
    redirect(appUrl("/app/onboarding"));
  }

  return (
    <main className="min-h-screen bg-ocean-950 py-28 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href={marketingUrl("/#pricing")} className="text-gray-400 hover:text-white text-sm font-mono">
          Back to pricing
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-8">
          <div>
            <p className="text-neon text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Billing Checkout</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {hasExplicitPlan ? "Confirm your selected plan" : "Choose your allconvos plan"}
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Front Desk Core is the live Stripe plan. Custom setup is available by request.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <section className="rounded-xl border border-neon/50 p-5 space-y-4 bg-black/30">
              <div className="space-y-1">
                <p className="text-white font-semibold">{selectedPlan.name}</p>
                <p className="text-gray-400 text-xs">{selectedPlan.description}</p>
              </div>
              <p className="text-neon font-bold text-2xl">{selectedPlan.monthlyPriceLabel}</p>
              <CheckoutButton planId={selectedPlanId} label="Choose Front Desk Core" />
            </section>

            <section className="rounded-xl border border-white/10 p-5 space-y-4 bg-black/30">
              <div className="space-y-1">
                <p className="text-white font-semibold">ELITE_OVERSEER (CUSTOM)</p>
                <p className="text-gray-400 text-xs">Custom multi-location and orchestration setup.</p>
              </div>
              <p className="text-white font-bold text-2xl">Custom</p>
              <Link
                href={marketingUrl("/contact")}
                className="w-full inline-flex items-center justify-center rounded-xl px-5 py-4 font-mono uppercase tracking-widest text-xs border border-white/15 text-white hover:bg-white/10 transition-colors"
              >
                Request Intel
              </Link>
            </section>
          </div>

          <p className="text-[11px] text-gray-500 font-mono">
            By continuing, you will complete payment in Stripe. Your onboarding access is granted after successful payment.
          </p>
        </div>
      </div>
    </main>
  );
}
