import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VoiceAgentBuilder } from "@/components/app/VoiceAgentBuilder";
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
        <VoiceAgentBuilder planName={plan.name} />
      </div>
    </main>
  );
}
