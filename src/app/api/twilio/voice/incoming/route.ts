import { NextRequest, NextResponse } from "next/server";
import { getVoiceAgentById } from "@/lib/voiceAgents";

function escapeXml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function twimlResponse(body: string, status = 200): NextResponse {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function buildErrorTwiml(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>${escapeXml(message)}</Say>
  <Hangup/>
</Response>`;
}

function buildBridgeStreamUrl(): string | null {
  const rawBridgeUrl = process.env.VOICE_BRIDGE_WS_URL;
  if (!rawBridgeUrl) {
    return null;
  }

  try {
    return new URL(rawBridgeUrl).toString();
  } catch {
    return null;
  }
}

async function handleIncomingCall(request: NextRequest): Promise<NextResponse> {
  const agentId = request.nextUrl.searchParams.get("agentId");
  if (!agentId) {
    return twimlResponse(buildErrorTwiml("This number is not configured with an active receptionist."), 400);
  }

  const streamUrl = buildBridgeStreamUrl();
  if (!streamUrl) {
    return twimlResponse(buildErrorTwiml("Voice bridge is not configured yet. Please try again later."), 500);
  }

  try {
    const agent = await getVoiceAgentById(agentId);
    if (!agent || agent.status !== "active") {
      return twimlResponse(buildErrorTwiml("This receptionist is not active right now."), 404);
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting you now.</Say>
  <Connect>
    <Stream url="${escapeXml(streamUrl)}">
      <Parameter name="agentId" value="${escapeXml(agentId)}" />
    </Stream>
  </Connect>
</Response>`;

    return twimlResponse(twiml);
  } catch (error) {
    console.error("Failed to serve Twilio voice webhook", error);
    return twimlResponse(buildErrorTwiml("We could not connect your call. Please try again shortly."), 500);
  }
}

export async function GET(request: NextRequest) {
  return handleIncomingCall(request);
}

export async function POST(request: NextRequest) {
  return handleIncomingCall(request);
}
