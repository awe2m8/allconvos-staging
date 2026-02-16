"use client";

import { useMemo, useState } from "react";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { DEFAULT_PLAN_ID, PLAN_DETAILS, PlanId } from "@/lib/billing";

interface CheckoutPlanOptionsProps {
  requestedPlan: PlanId;
}

export function CheckoutPlanOptions({ requestedPlan }: CheckoutPlanOptionsProps) {
  const [activePlan, setActivePlan] = useState<PlanId | null>(null);

  const planOrder: PlanId[] = useMemo(() => {
    return requestedPlan === "pro" ? ["pro", "lite"] : ["lite", "pro"];
  }, [requestedPlan]);

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {planOrder.map((planId) => {
        const plan = PLAN_DETAILS[planId];
        const isPreferred = planId === requestedPlan;
        const isDefault = planId === DEFAULT_PLAN_ID;
        const isDisabled = activePlan !== null && activePlan !== planId;

        return (
          <section
            key={planId}
            className={`rounded-xl border p-5 space-y-4 bg-black/30 transition-opacity ${
              isPreferred ? "border-neon/50" : "border-white/10"
            } ${isDisabled ? "opacity-40 grayscale" : "opacity-100"}`}
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
              disabled={isDisabled}
              onCheckoutStart={() => setActivePlan(planId)}
              onCheckoutEnd={() => setActivePlan(null)}
            />
          </section>
        );
      })}
    </div>
  );
}
