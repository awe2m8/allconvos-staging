import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PLAN_DETAILS, normalizePlanId } from "@/lib/billing";
import { createVoiceAgent, normalizePromptDraftInput } from "@/lib/voiceAgents";
import { appUrl } from "@/lib/siteUrls";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";

interface CreateLiveAgentBody {
  name?: unknown;
  draft?: unknown;
}

function normalizeAgentName(rawName: unknown): string {
  if (typeof rawName !== "string") {
    return "Front Desk Core Agent";
  }

  const trimmed = rawName.trim();
  if (!trimmed) {
    return "Front Desk Core Agent";
  }

  return trimmed.slice(0, 80);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscription = await getLatestSubscriptionForUser(userId);
    if (!subscription || !isActiveSubscriptionStatus(subscription.status)) {
      return NextResponse.json({ error: "An active subscription is required." }, { status: 403 });
    }

    const body = (await request.json()) as CreateLiveAgentBody;
    const draft = normalizePromptDraftInput(body.draft);

    if (!draft) {
      return NextResponse.json({ error: "Invalid agent draft payload." }, { status: 400 });
    }

    const normalizedPlan = normalizePlanId(subscription.plan);
    const plan = PLAN_DETAILS[normalizedPlan];
    const agent = await createVoiceAgent({
      userId,
      name: normalizeAgentName(body.name),
      plan: plan.name,
      draft,
    });

    return NextResponse.json({
      agent: {
        agentId: agent.id,
        name: agent.name,
        plan: agent.plan,
        twilioWebhookUrl: appUrl(`/api/twilio/voice/incoming?agentId=${agent.id}`),
      },
    });
  } catch (error) {
    console.error("Failed to create live voice agent", error);
    return NextResponse.json({ error: "Could not create live voice agent right now." }, { status: 500 });
  }
}
