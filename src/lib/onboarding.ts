import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const ONBOARDING_STEPS = [
  {
    id: "connect_phone",
    title: "Connect phone number",
    description: "Bring your primary business line into allconvos.",
  },
  {
    id: "set_business_details",
    title: "Set business details",
    description: "Add hours, locations, and service areas.",
  },
  {
    id: "configure_call_handling",
    title: "Configure call handling",
    description: "Define lead qualification and escalation rules.",
  },
  {
    id: "configure_sms_follow_up",
    title: "Configure SMS follow-up",
    description: "Set the default SMS flows for missed calls and leads.",
  },
  {
    id: "run_test_call",
    title: "Run a test call",
    description: "Validate conversation quality and handoff behavior.",
  },
  {
    id: "go_live",
    title: "Go live",
    description: "Publish your receptionist and start handling real traffic.",
  },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];

export interface OnboardingProgress {
  currentStep: number;
  stepsCompleted: Record<OnboardingStepId, boolean>;
  completedAt: string | null;
}

function buildDefaultStepsCompleted(): Record<OnboardingStepId, boolean> {
  const defaultState = {} as Record<OnboardingStepId, boolean>;

  for (const step of ONBOARDING_STEPS) {
    defaultState[step.id] = false;
  }

  return defaultState;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeStepsCompleted(rawSteps: unknown): Record<OnboardingStepId, boolean> {
  const normalized = buildDefaultStepsCompleted();

  if (!isRecord(rawSteps)) {
    return normalized;
  }

  for (const step of ONBOARDING_STEPS) {
    normalized[step.id] = rawSteps[step.id] === true;
  }

  return normalized;
}

function computeCurrentStep(stepsCompleted: Record<OnboardingStepId, boolean>): number {
  const firstIncompleteIndex = ONBOARDING_STEPS.findIndex((step) => !stepsCompleted[step.id]);

  if (firstIncompleteIndex === -1) {
    return ONBOARDING_STEPS.length;
  }

  return firstIncompleteIndex + 1;
}

function areAllStepsComplete(stepsCompleted: Record<OnboardingStepId, boolean>): boolean {
  return ONBOARDING_STEPS.every((step) => stepsCompleted[step.id]);
}

export function isOnboardingStepId(rawStepId: unknown): rawStepId is OnboardingStepId {
  if (typeof rawStepId !== "string") {
    return false;
  }

  return ONBOARDING_STEPS.some((step) => step.id === rawStepId);
}

export async function getOrCreateOnboardingProgress(userId: string): Promise<OnboardingProgress> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("onboarding_progress")
    .select("current_step, steps_completed, completed_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    const defaultSteps = buildDefaultStepsCompleted();

    const { error: insertError } = await supabase.from("onboarding_progress").insert({
      user_id: userId,
      current_step: 1,
      steps_completed: defaultSteps,
      completed_at: null,
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      throw insertError;
    }

    return {
      currentStep: 1,
      stepsCompleted: defaultSteps,
      completedAt: null,
    };
  }

  return {
    currentStep: data.current_step ?? 1,
    stepsCompleted: normalizeStepsCompleted(data.steps_completed),
    completedAt: data.completed_at,
  };
}

export async function ensureOnboardingProgressRow(userId: string): Promise<void> {
  await getOrCreateOnboardingProgress(userId);
}

export async function setOnboardingStepCompletion(userId: string, stepId: OnboardingStepId, completed: boolean): Promise<OnboardingProgress> {
  const current = await getOrCreateOnboardingProgress(userId);
  const nextSteps = {
    ...current.stepsCompleted,
    [stepId]: completed,
  };

  const nextCurrentStep = computeCurrentStep(nextSteps);
  const completedAt = areAllStepsComplete(nextSteps) ? new Date().toISOString() : null;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("onboarding_progress")
    .update({
      steps_completed: nextSteps,
      current_step: nextCurrentStep,
      completed_at: completedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return {
    currentStep: nextCurrentStep,
    stepsCompleted: nextSteps,
    completedAt,
  };
}
