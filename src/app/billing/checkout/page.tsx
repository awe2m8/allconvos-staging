import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckoutPlanOptions } from "@/components/billing/CheckoutPlanOptions";
import { DEFAULT_PLAN_ID, PlanId } from "@/lib/billing";
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
  const hasExplicitPlan = rawPlan === "lite" || rawPlan === "pro";
  const requestedPlan: PlanId = hasExplicitPlan ? rawPlan : DEFAULT_PLAN_ID;

  const { userId } = await auth();
  if (!userId) {
    if (hasExplicitPlan) {
      redirect(appUrl(`/signup?plan=${requestedPlan}`));
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
              Pick Front Desk Core or Lead Engine. You can upgrade later from billing.
            </p>
          </div>

          <CheckoutPlanOptions requestedPlan={requestedPlan} showOnlyRequested={hasExplicitPlan} />

          <p className="text-[11px] text-gray-500 font-mono">
            By continuing, you will complete payment in Stripe. Your onboarding access is granted after successful payment.
          </p>
        </div>
      </div>
    </main>
  );
}
