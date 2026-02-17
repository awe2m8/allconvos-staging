export const PLAN_IDS = ["lite"] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export const DEFAULT_PLAN_ID: PlanId = "lite";

export const PLAN_DETAILS: Record<PlanId, {
  name: string;
  monthlyPriceLabel: string;
  description: string;
}> = {
  lite: {
    name: "FRONT_DESK_CORE",
    monthlyPriceLabel: "$399/mo",
    description: "One receptionist. Fully autonomous. Always on.",
  },
};

export const STRIPE_PRICE_IDS: Record<PlanId, string | undefined> = {
  lite: process.env.STRIPE_PRICE_LITE,
};

export function normalizePlanId(rawPlan: string | null | undefined): PlanId {
  if (rawPlan === "lite" || rawPlan === "pro") {
    // Legacy `pro` links now resolve to Front Desk Core.
    return "lite";
  }

  return DEFAULT_PLAN_ID;
}

export function resolvePlanIdFromPriceId(priceId: string | null | undefined): PlanId | null {
  if (!priceId) {
    return null;
  }

  for (const planId of PLAN_IDS) {
    if (STRIPE_PRICE_IDS[planId] === priceId) {
      return planId;
    }
  }

  return null;
}
