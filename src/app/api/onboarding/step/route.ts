import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isOnboardingStepId, setOnboardingStepCompletion } from "@/lib/onboarding";

interface StepUpdateBody {
  stepId?: unknown;
  completed?: unknown;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as StepUpdateBody;
  const { stepId, completed } = body;

  if (!isOnboardingStepId(stepId) || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Invalid onboarding payload" }, { status: 400 });
  }

  try {
    const progress = await setOnboardingStepCompletion(userId, stepId, completed);

    return NextResponse.json({
      currentStep: progress.currentStep,
      stepsCompleted: progress.stepsCompleted,
      completedAt: progress.completedAt,
    });
  } catch (error) {
    console.error("Failed onboarding step update", error);
    return NextResponse.json({ error: "Failed to update onboarding progress" }, { status: 500 });
  }
}
