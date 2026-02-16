import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingChecklist } from "@/components/app/OnboardingChecklist";
import { getOrCreateOnboardingProgress } from "@/lib/onboarding";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";
import { DEFAULT_PLAN_ID, PLAN_DETAILS, normalizePlanId } from "@/lib/billing";
import { appUrl } from "@/lib/siteUrls";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect(appUrl("/login"));
  }

  const subscription = await getLatestSubscriptionForUser(userId);
  if (!subscription || !isActiveSubscriptionStatus(subscription.status)) {
    redirect(appUrl(`/billing/checkout?plan=${DEFAULT_PLAN_ID}`));
  }

  const onboardingProgress = await getOrCreateOnboardingProgress(userId);
  const plan = PLAN_DETAILS[normalizePlanId(subscription.plan)];

  return (
    <main className="min-h-screen bg-ocean-950 py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-3">
          <p className="text-neon text-[10px] font-mono uppercase tracking-[0.2em]">Authenticated Workspace</p>
          <h1 className="text-3xl font-bold text-white">Receptionist Setup</h1>
          <p className="text-gray-300 text-sm">
            Active plan: <span className="text-neon font-semibold">{plan.name}</span>. Complete each step to move from setup to live operations.
          </p>
        </div>

        <OnboardingChecklist
          initialCurrentStep={onboardingProgress.currentStep}
          initialStepsCompleted={onboardingProgress.stepsCompleted}
        />
      </div>
    </main>
  );
}
