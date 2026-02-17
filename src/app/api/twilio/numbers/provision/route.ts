import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";
import { getVoiceAgentForUser } from "@/lib/voiceAgents";
import { provisionTwilioNumber } from "@/lib/twilioProvisioning";
import { upsertTwilioPhoneNumber } from "@/lib/twilioPhoneNumbers";

interface ProvisionTwilioNumberBody {
  agentId?: unknown;
  phoneNumber?: unknown;
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

    const body = (await request.json()) as ProvisionTwilioNumberBody;
    const agentId = typeof body.agentId === "string" ? body.agentId.trim() : "";
    const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";

    if (!agentId || !phoneNumber) {
      return NextResponse.json({ error: "agentId and phoneNumber are required." }, { status: 400 });
    }

    const agent = await getVoiceAgentForUser(userId, agentId);
    if (!agent || agent.status !== "active") {
      return NextResponse.json({ error: "Agent not found or inactive." }, { status: 404 });
    }

    const provisioned = await provisionTwilioNumber({
      phoneNumber,
      agentId: agent.id,
    });

    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    if (!twilioAccountSid) {
      return NextResponse.json({ error: "Missing TWILIO_ACCOUNT_SID." }, { status: 500 });
    }

    const saved = await upsertTwilioPhoneNumber({
      userId,
      agentId: agent.id,
      twilioAccountSid,
      incomingPhoneNumberSid: provisioned.sid,
      phoneNumber: provisioned.phoneNumber,
      friendlyName: provisioned.friendlyName,
      voiceUrl: provisioned.voiceUrl,
      status: "active",
    });

    return NextResponse.json({
      number: {
        id: saved.id,
        sid: saved.incoming_phone_number_sid,
        phoneNumber: saved.phone_number,
        friendlyName: saved.friendly_name,
        status: saved.status,
      },
    });
  } catch (error) {
    console.error("Failed to provision Twilio number", error);
    return NextResponse.json({ error: "Could not provision Twilio number right now." }, { status: 500 });
  }
}
