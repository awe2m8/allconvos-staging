import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";
import { getLatestActiveVoiceAgentForUser } from "@/lib/voiceAgents";
import { appUrl } from "@/lib/siteUrls";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscription = await getLatestSubscriptionForUser(userId);
    if (!subscription || !isActiveSubscriptionStatus(subscription.status)) {
      return NextResponse.json({ error: "An active subscription is required." }, { status: 403 });
    }

    const agent = await getLatestActiveVoiceAgentForUser(userId);
    if (!agent) {
      return NextResponse.json({ agent: null });
    }

    return NextResponse.json({
      agent: {
        agentId: agent.id,
        name: agent.name,
        plan: agent.plan,
        twilioWebhookUrl: appUrl(`/api/twilio/voice/incoming?agentId=${agent.id}`),
        draft: {
          businessSummary: agent.business_summary,
          tasks: agent.tasks,
          personality: agent.personality,
          guardrails: agent.guardrails,
          openingScript: agent.opening_script,
          systemPrompt: agent.system_prompt,
        },
      },
    });
  } catch (error) {
    console.error("Failed to load latest live voice agent", error);
    return NextResponse.json({ error: "Could not load latest live agent right now." }, { status: 500 });
  }
}
