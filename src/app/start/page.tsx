import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { normalizePlanId } from "@/lib/billing";
import { appUrl } from "@/lib/siteUrls";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";

interface StartPageProps {
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

export default async function StartPage({ searchParams }: StartPageProps) {
  const params = await searchParams;
  const planId = normalizePlanId(readSingleParam(params.plan));

  const { userId } = await auth();
  if (!userId) {
    redirect(appUrl(`/signup?plan=${planId}`));
  }

  const subscription = await getLatestSubscriptionForUser(userId);
  if (subscription && isActiveSubscriptionStatus(subscription.status)) {
    redirect(appUrl("/app/onboarding"));
  }

  redirect(appUrl(`/billing/checkout?plan=${planId}`));
}
