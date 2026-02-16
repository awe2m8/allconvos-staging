import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { DEFAULT_PLAN_ID, PLAN_DETAILS, PlanId, normalizePlanId } from "@/lib/billing";
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
  const requestedPlan = normalizePlanId(readSingleParam(params.plan));
  const planOrder: PlanId[] = requestedPlan === "pro" ? ["pro", "lite"] : ["lite", "pro"];

  const { userId } = await auth();
  if (!userId) {
    redirect(appUrl(`/signup?plan=${requestedPlan}`));
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Choose your allconvos plan</h1>
            <p className="text-gray-400 mt-2 text-sm">
              Pick Front Desk Core or Lead Engine. You can upgrade later from billing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {planOrder.map((planId) => {
              const plan = PLAN_DETAILS[planId];
              const isPreferred = planId === requestedPlan;
              const isDefault = planId === DEFAULT_PLAN_ID;

              return (
                <section
                  key={planId}
                  className={`rounded-xl border p-5 space-y-4 bg-black/30 ${isPreferred ? "border-neon/50" : "border-white/10"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-white font-semibold">{plan.name}</p>
                      <p className="text-gray-400 text-xs">{plan.description}</p>
                    </div>
                    {(isPreferred || isDefault) && (
                      <span className="shrink-0 rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide text-gray-300">
                        {isPreferred ? "Selected" : "Default"}
                      </span>
                    )}
                  </div>

                  <p className="text-neon font-bold text-2xl">{plan.monthlyPriceLabel}</p>

                  <CheckoutButton
                    planId={planId}
                    label={planId === "lite" ? "Choose Front Desk Core" : "Choose Lead Engine"}
                  />
                </section>
              );
            })}
          </div>

          <p className="text-[11px] text-gray-500 font-mono">
            By continuing, you will complete payment in Stripe. Your onboarding access is granted after successful payment.
          </p>
        </div>
      </div>
    </main>
  );
}
