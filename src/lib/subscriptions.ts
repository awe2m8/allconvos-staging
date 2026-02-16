import { PlanId, normalizePlanId } from "@/lib/billing";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export interface SubscriptionRecord {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: PlanId;
  status: string;
  current_period_end: string | null;
  updated_at: string;
}

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);

export function isActiveSubscriptionStatus(status: string | null | undefined): boolean {
  if (!status) {
    return false;
  }

  return ACTIVE_SUBSCRIPTION_STATUSES.has(status);
}

export async function getLatestSubscriptionForUser(userId: string): Promise<SubscriptionRecord | null> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    user_id: data.user_id,
    stripe_customer_id: data.stripe_customer_id,
    stripe_subscription_id: data.stripe_subscription_id,
    plan: normalizePlanId(data.plan),
    status: data.status,
    current_period_end: data.current_period_end,
    updated_at: data.updated_at,
  };
}

export async function upsertSubscriptionRecord(input: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: PlanId;
  status: string;
  currentPeriodEnd: string | null;
}): Promise<void> {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: input.userId,
      stripe_customer_id: input.stripeCustomerId,
      stripe_subscription_id: input.stripeSubscriptionId,
      plan: input.plan,
      status: input.status,
      current_period_end: input.currentPeriodEnd,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "stripe_subscription_id",
    }
  );

  if (error) {
    throw error;
  }
}
