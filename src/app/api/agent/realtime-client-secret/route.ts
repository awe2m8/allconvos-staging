import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLatestSubscriptionForUser, isActiveSubscriptionStatus } from "@/lib/subscriptions";
import { getVoiceAgentForUser } from "@/lib/voiceAgents";

interface CreateRealtimeClientSecretBody {
  agentId?: unknown;
}

interface RealtimeClientSecretResponse {
  value?: unknown;
  client_secret?: {
    value?: unknown;
  };
  session?: {
    client_secret?: {
      value?: unknown;
    };
  };
}

function extractClientSecretValue(payload: RealtimeClientSecretResponse): string | null {
  const directValue = payload.value;
  if (typeof directValue === "string" && directValue.trim()) {
    return directValue.trim();
  }

  const nestedValue = payload.client_secret?.value;
  if (typeof nestedValue === "string" && nestedValue.trim()) {
    return nestedValue.trim();
  }

  const sessionNestedValue = payload.session?.client_secret?.value;
  if (typeof sessionNestedValue === "string" && sessionNestedValue.trim()) {
    return sessionNestedValue.trim();
  }

  return null;
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

    const body = (await request.json()) as CreateRealtimeClientSecretBody;
    const agentId = typeof body.agentId === "string" ? body.agentId.trim() : "";
    if (!agentId) {
      return NextResponse.json({ error: "agentId is required." }, { status: 400 });
    }

    const agent = await getVoiceAgentForUser(userId, agentId);
    if (!agent || agent.status !== "active") {
      return NextResponse.json({ error: "Agent not found or inactive." }, { status: 404 });
    }

    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY." }, { status: 500 });
    }

    const openAiModel = process.env.OPENAI_REALTIME_MODEL ?? "gpt-realtime";
    const openAiVoice = process.env.OPENAI_REALTIME_VOICE ?? "alloy";

    const openAiResponse = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model: openAiModel,
          instructions: agent.system_prompt,
          audio: {
            output: {
              voice: openAiVoice,
            },
          },
        },
      }),
    });

    if (!openAiResponse.ok) {
      const openAiErrorText = await openAiResponse.text();
      console.error("Failed creating realtime client secret", {
        status: openAiResponse.status,
        body: openAiErrorText,
      });
      return NextResponse.json({ error: "Could not start web call session." }, { status: 502 });
    }

    const openAiPayload = (await openAiResponse.json()) as RealtimeClientSecretResponse;
    const clientSecret = extractClientSecretValue(openAiPayload);

    if (!clientSecret) {
      console.error("Realtime client secret payload missing token", openAiPayload);
      return NextResponse.json({ error: "Realtime session token missing." }, { status: 502 });
    }

    return NextResponse.json({
      clientSecret,
      model: openAiModel,
      openingScript: agent.opening_script,
    });
  } catch (error) {
    console.error("Failed to create realtime client secret", error);
    return NextResponse.json({ error: "Could not start web call session right now." }, { status: 500 });
  }
}
