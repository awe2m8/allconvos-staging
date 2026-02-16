import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";

export default async function BillingSuccessPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const subscription = await getLatestSubscriptionForUser(userId);
  const isActive = subscription ? isActiveSubscriptionStatus(subscription.status) : false;

  return (
    <main className="min-h-screen bg-ocean-950 py-28 px-6">
      <div className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-8 text-center space-y-5">
        <h1 className="text-3xl font-bold text-white">Billing Updated</h1>

        {isActive ? (
          <>
            <p className="text-gray-300">Your subscription is active and onboarding is unlocked.</p>
            <Link
              href="/app/onboarding"
              className="inline-flex items-center justify-center rounded-xl bg-neon text-ocean-950 px-6 py-3 text-xs font-mono uppercase tracking-widest hover:bg-white transition-colors"
            >
              Continue to onboarding
            </Link>
          </>
        ) : (
          <>
            <p className="text-gray-400">
              We&apos;re still waiting on Stripe confirmation. This can take a moment in some payment flows.
            </p>
            <Link
              href="/billing/checkout"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 text-white px-6 py-3 text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Refresh billing status
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
