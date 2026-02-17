import http from "node:http";
import { URL } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { WebSocket, WebSocketServer } from "ws";

const PORT = Number.parseInt(process.env.PORT ?? "8081", 10);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const OPENAI_REALTIME_MODEL = process.env.OPENAI_REALTIME_MODEL ?? "gpt-realtime";
const OPENAI_REALTIME_VOICE = process.env.OPENAI_REALTIME_VOICE ?? "alloy";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY for voice bridge.");
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables for voice bridge.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function isOpen(ws) {
  return ws.readyState === WebSocket.OPEN;
}

async function loadActiveAgent(agentId) {
  const { data, error } = await supabase
    .from("voice_agents")
    .select("id, name, status, opening_script, system_prompt")
    .eq("id", agentId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const server = http.createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  const host = request.headers.host ?? "localhost";
  const requestUrl = new URL(request.url ?? "/", `http://${host}`);

  if (requestUrl.pathname !== "/twilio-media-stream") {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request, requestUrl);
  });
});

wss.on("connection", async (twilioWs, request, requestUrl) => {
  const agentId = requestUrl.searchParams.get("agentId");
  if (!agentId) {
    twilioWs.close(1008, "Missing agentId");
    return;
  }

  let agent;
  try {
    agent = await loadActiveAgent(agentId);
  } catch (error) {
    console.error("Failed loading agent for stream", { agentId, error });
    twilioWs.close(1011, "Agent lookup failed");
    return;
  }

  if (!agent) {
    twilioWs.close(1008, "Unknown agent");
    return;
  }

  console.log("Twilio media stream opened", {
    agentId,
    streamPath: requestUrl.pathname,
    fromIp: request.socket.remoteAddress ?? "unknown",
  });

  const openAiWs = new WebSocket(`wss://api.openai.com/v1/realtime?model=${encodeURIComponent(OPENAI_REALTIME_MODEL)}`, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "OpenAI-Beta": "realtime=v1",
    },
  });

  let streamSid = "";
  let sessionReady = false;
  let openingPromptQueued = false;

  function closeBoth() {
    if (isOpen(twilioWs)) {
      twilioWs.close();
    }
    if (isOpen(openAiWs)) {
      openAiWs.close();
    }
  }

  openAiWs.on("open", () => {
    sessionReady = true;

    openAiWs.send(
      JSON.stringify({
        type: "session.update",
        session: {
          turn_detection: { type: "server_vad" },
          input_audio_format: "g711_ulaw",
          output_audio_format: "g711_ulaw",
          voice: OPENAI_REALTIME_VOICE,
          modalities: ["text", "audio"],
          temperature: 0.7,
          instructions: agent.system_prompt,
        },
      })
    );
  });

  openAiWs.on("message", (message) => {
    const event = safeJsonParse(message.toString());
    if (!event || typeof event.type !== "string") {
      return;
    }

    if (event.type === "session.updated" && !openingPromptQueued) {
      openingPromptQueued = true;

      openAiWs.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Start the call with this exact opening script, then continue naturally: ${agent.opening_script}`,
              },
            ],
          },
        })
      );

      openAiWs.send(
        JSON.stringify({
          type: "response.create",
        })
      );
      return;
    }

    if (event.type === "response.audio.delta" && event.delta && streamSid && isOpen(twilioWs)) {
      twilioWs.send(
        JSON.stringify({
          event: "media",
          streamSid,
          media: {
            payload: event.delta,
          },
        })
      );
      return;
    }

    if (event.type === "error") {
      console.error("OpenAI realtime stream error event", event);
    }
  });

  openAiWs.on("close", () => {
    if (isOpen(twilioWs)) {
      twilioWs.close();
    }
  });

  openAiWs.on("error", (error) => {
    console.error("OpenAI realtime websocket error", error);
    closeBoth();
  });

  twilioWs.on("message", (message) => {
    const data = safeJsonParse(message.toString());
    if (!data || typeof data.event !== "string") {
      return;
    }

    if (data.event === "start") {
      streamSid = data.start?.streamSid ?? "";
      return;
    }

    if (data.event === "media") {
      const payload = data.media?.payload;
      if (typeof payload !== "string" || !payload) {
        return;
      }

      if (!sessionReady || !isOpen(openAiWs)) {
        return;
      }

      openAiWs.send(
        JSON.stringify({
          type: "input_audio_buffer.append",
          audio: payload,
        })
      );
      return;
    }

    if (data.event === "stop") {
      closeBoth();
    }
  });

  twilioWs.on("close", () => {
    if (isOpen(openAiWs)) {
      openAiWs.close();
    }
  });

  twilioWs.on("error", (error) => {
    console.error("Twilio media websocket error", error);
    closeBoth();
  });
});

server.listen(PORT, () => {
  console.log(`Voice bridge listening on :${PORT}`);
});
