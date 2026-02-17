import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";
import { getVoiceAgentForUser } from "@/lib/voiceAgents";
import { listTwilioPhoneNumbersForAgent } from "@/lib/twilioPhoneNumbers";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscription = await getLatestSubscriptionForUser(userId);
    if (!subscription || !isActiveSubscriptionStatus(subscription.status)) {
      return NextResponse.json({ error: "An active subscription is required." }, { status: 403 });
    }

    const agentId = request.nextUrl.searchParams.get("agentId")?.trim() ?? "";
    if (!agentId) {
      return NextResponse.json({ error: "agentId is required." }, { status: 400 });
    }

    const agent = await getVoiceAgentForUser(userId, agentId);
    if (!agent || agent.status !== "active") {
      return NextResponse.json({ error: "Agent not found or inactive." }, { status: 404 });
    }

    const numbers = await listTwilioPhoneNumbersForAgent(userId, agentId);

    return NextResponse.json({
      numbers: numbers.map((number) => ({
        id: number.id,
        sid: number.incoming_phone_number_sid,
        phoneNumber: number.phone_number,
        friendlyName: number.friendly_name,
        status: number.status,
      })),
    });
  } catch (error) {
    console.error("Failed to list Twilio numbers", error);
    return NextResponse.json({ error: "Could not load Twilio numbers right now." }, { status: 500 });
  }
}
