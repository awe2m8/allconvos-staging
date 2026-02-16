import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";
import { PLAN_DETAILS, normalizePlanId } from "@/lib/billing";
import { appUrl } from "@/lib/siteUrls";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect(appUrl("/login"));
  }

  const subscription = await getLatestSubscriptionForUser(userId);
  if (!subscription || !isActiveSubscriptionStatus(subscription.status)) {
    redirect(appUrl("/billing/checkout"));
  }

  const plan = PLAN_DETAILS[normalizePlanId(subscription.plan)];

  return (
    <main className="min-h-screen bg-ocean-950 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-16 text-center">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(16,248,194,0.15),transparent_50%)]" />

          <div className="relative space-y-8">
            <div className="space-y-3">
              <p className="text-neon text-[10px] font-mono uppercase tracking-[0.24em]">Allconvos App Placeholder</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Agent Workspace</h1>
              <p className="text-sm text-gray-300 max-w-2xl mx-auto">
                Active plan: <span className="text-neon font-semibold">{plan.name}</span>. This is a placeholder while we design the full
                onboarding and build flow.
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                className="h-56 w-56 rounded-full border border-neon/50 bg-neon/10 text-neon font-mono text-sm uppercase tracking-[0.16em] shadow-[0_0_80px_rgba(16,248,194,0.2)] hover:bg-neon/15 transition-colors"
              >
                Create your agent
              </button>
            </div>

            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-500">Wireframe mode. Build actions coming next.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
