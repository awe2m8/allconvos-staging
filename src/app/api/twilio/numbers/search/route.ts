import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";
import { getVoiceAgentForUser } from "@/lib/voiceAgents";
import { searchAvailableTwilioNumbers, TwilioApiError } from "@/lib/twilioProvisioning";

interface SearchTwilioNumbersBody {
  agentId?: unknown;
  countryCode?: unknown;
  areaCode?: unknown;
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

    const body = (await request.json()) as SearchTwilioNumbersBody;
    const agentId = typeof body.agentId === "string" ? body.agentId.trim() : "";
    const countryCode = typeof body.countryCode === "string" ? body.countryCode.trim().toUpperCase() : "US";
    const areaCode = typeof body.areaCode === "string" ? body.areaCode.trim() : "";

    if (!agentId) {
      return NextResponse.json({ error: "agentId is required." }, { status: 400 });
    }

    const agent = await getVoiceAgentForUser(userId, agentId);
    if (!agent || agent.status !== "active") {
      return NextResponse.json({ error: "Agent not found or inactive." }, { status: 404 });
    }

    const availableNumbers = await searchAvailableTwilioNumbers({
      countryCode,
      areaCode: areaCode || null,
      limit: 8,
    });

    return NextResponse.json({
      numbers: availableNumbers,
    });
  } catch (error) {
    console.error("Failed to search Twilio numbers", error);
    if (error instanceof TwilioApiError) {
      return NextResponse.json(
        {
          error: error.message,
          twilioCode: error.code,
          twilioMoreInfo: error.moreInfo,
        },
        {
          status: error.status >= 400 && error.status < 600 ? error.status : 502,
        }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Could not search Twilio numbers right now." }, { status: 500 });
  }
}
