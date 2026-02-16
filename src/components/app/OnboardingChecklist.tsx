"use client";

import { useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { ONBOARDING_STEPS, OnboardingStepId } from "@/lib/onboarding";

interface OnboardingChecklistProps {
  initialCurrentStep: number;
  initialStepsCompleted: Record<OnboardingStepId, boolean>;
}

interface OnboardingUpdateResponse {
  currentStep: number;
  stepsCompleted: Record<OnboardingStepId, boolean>;
  completedAt: string | null;
  error?: string;
}

export function OnboardingChecklist({ initialCurrentStep, initialStepsCompleted }: OnboardingChecklistProps) {
  const [stepsCompleted, setStepsCompleted] = useState(initialStepsCompleted);
  const [currentStep, setCurrentStep] = useState(initialCurrentStep);
  const [busyStepId, setBusyStepId] = useState<OnboardingStepId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const completedCount = useMemo(() => {
    return ONBOARDING_STEPS.filter((step) => stepsCompleted[step.id]).length;
  }, [stepsCompleted]);

  const completionPercent = Math.round((completedCount / ONBOARDING_STEPS.length) * 100);

  async function setStep(stepId: OnboardingStepId, completed: boolean) {
    setError(null);
    setBusyStepId(stepId);

    try {
      const response = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stepId, completed }),
      });

      const data = (await response.json()) as OnboardingUpdateResponse;
      if (!response.ok) {
        throw new Error(data.error || "Could not update onboarding progress");
      }

      setStepsCompleted(data.stepsCompleted);
      setCurrentStep(data.currentStep);
    } catch (updateError: unknown) {
      const message = updateError instanceof Error ? updateError.message : "Could not update onboarding progress";
      setError(message);
    }

    setBusyStepId(null);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-semibold">Receptionist Setup Progress</p>
          <p className="text-neon font-mono text-xs">{completionPercent}%</p>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-neon transition-all" style={{ width: `${completionPercent}%` }} />
        </div>
        <p className="mt-3 text-xs text-gray-400 font-mono">Current stage: Step {Math.min(currentStep, ONBOARDING_STEPS.length)}</p>
      </div>

      <div className="space-y-3">
        {ONBOARDING_STEPS.map((step, index) => {
          const isCompleted = stepsCompleted[step.id];
          const isBusy = busyStepId === step.id;

          return (
            <div
              key={step.id}
              className={`rounded-xl border p-4 transition-colors ${
                isCompleted ? "border-neon/30 bg-neon/5" : "border-white/10 bg-black/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => setStep(step.id, !isCompleted)}
                  className={`mt-1 h-6 w-6 rounded-full border inline-flex items-center justify-center transition-colors ${
                    isCompleted ? "border-neon bg-neon text-ocean-950" : "border-white/30 text-transparent"
                  }`}
                  aria-label={`Mark ${step.title} as ${isCompleted ? "incomplete" : "complete"}`}
                >
                  {isBusy ? <Loader2 className="h-3 w-3 animate-spin text-white" /> : <Check className="h-3 w-3" />}
                </button>

                <div className="flex-1">
                  <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Step {index + 1}</p>
                  <h3 className="text-white font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
    </div>
  );
}
