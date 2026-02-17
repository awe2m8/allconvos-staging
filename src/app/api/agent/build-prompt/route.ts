import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface BuildPromptBody {
  notes?: unknown;
}

interface PromptDraft {
  businessSummary: string;
  tasks: string[];
  personality: string[];
  guardrails: string[];
  openingScript: string;
  systemPrompt: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function cleanList(input: unknown, fallback: string[]): string[] {
  if (!Array.isArray(input)) {
    return fallback;
  }

  const values = input
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0)
    .slice(0, 10);

  return values.length > 0 ? values : fallback;
}

function buildSystemPrompt(input: Omit<PromptDraft, "systemPrompt">): string {
  const tasks = input.tasks.map((task, index) => `${index + 1}. ${task}`).join("\n");
  const personality = input.personality.map((item, index) => `${index + 1}. ${item}`).join("\n");
  const guardrails = input.guardrails.map((item, index) => `${index + 1}. ${item}`).join("\n");

  return [
    "You are the business's AI receptionist.",
    "",
    `Business context: ${input.businessSummary}`,
    "",
    "Primary tasks:",
    tasks,
    "",
    "Personality:",
    personality,
    "",
    "Guard rails:",
    guardrails,
    "",
    "If you are unsure about details, ask a clarifying question instead of guessing.",
  ].join("\n");
}

function buildFallbackDraft(notes: string): PromptDraft {
  const summary = notes.length > 240 ? `${notes.slice(0, 240).trim()}...` : notes.trim();

  const baseDraft = {
    businessSummary: summary,
    tasks: [
      "Answer inbound calls and identify the caller intent in the first 30 seconds.",
      "Collect name, phone, service request, and urgency for every new lead.",
      "Book appointments based on availability and confirm next steps by SMS.",
    ],
    personality: [
      "Warm, calm, and professional.",
      "Confident and concise, never robotic.",
      "Helpful under pressure and focused on resolution.",
    ],
    guardrails: [
      "Never invent pricing, legal, or medical advice.",
      "Escalate angry callers or emergencies to a human immediately.",
      "If unsure, ask clarifying questions before committing to an action.",
    ],
    openingScript:
      "Hi, thanks for calling. I’m your virtual receptionist. I can help with bookings, questions, and urgent requests. What can I help you with today?",
  };

  return {
    ...baseDraft,
    systemPrompt: buildSystemPrompt(baseDraft),
  };
}

function normalizeDraft(raw: unknown, notes: string): PromptDraft {
  if (!raw || typeof raw !== "object") {
    return buildFallbackDraft(notes);
  }

  const candidate = raw as Record<string, unknown>;
  const businessSummary = isNonEmptyString(candidate.businessSummary)
    ? candidate.businessSummary.trim()
    : isNonEmptyString(candidate.business_summary)
      ? candidate.business_summary.trim()
      : notes.slice(0, 240).trim();

  const tasks = cleanList(candidate.tasks, [
    "Answer inbound calls and identify caller intent quickly.",
    "Capture lead details and route to the right workflow.",
    "Book jobs or appointments and confirm next actions.",
  ]);

  const personality = cleanList(candidate.personality, [
    "Professional and human.",
    "Clear and concise.",
    "Empathetic and confident.",
  ]);

  const guardrails = cleanList(candidate.guardrails, [
    "Do not invent details.",
    "Escalate edge cases to a human.",
    "Ask clarifying questions when uncertain.",
  ]);

  const openingScript = isNonEmptyString(candidate.openingScript)
    ? candidate.openingScript.trim()
    : isNonEmptyString(candidate.opening_script)
      ? candidate.opening_script.trim()
      : "Hi, thanks for calling. I’m your virtual receptionist. How can I help today?";

  const base = {
    businessSummary: businessSummary || "Business information captured from voice brief.",
    tasks,
    personality,
    guardrails,
    openingScript,
  };

  return {
    ...base,
    systemPrompt: buildSystemPrompt(base),
  };
}

async function buildDraftWithOpenAI(notes: string): Promise<PromptDraft> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildFallbackDraft(notes);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You build concise AI receptionist specs. Return strict JSON with keys: businessSummary, tasks[], personality[], guardrails[], openingScript.",
        },
        {
          role: "user",
          content: [
            "Turn these voice notes into a receptionist spec.",
            "",
            "Voice notes:",
            notes,
          ].join("\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("AI model request failed");
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!isNonEmptyString(content)) {
    throw new Error("AI response was empty");
  }

  try {
    const parsed = JSON.parse(content) as unknown;
    return normalizeDraft(parsed, notes);
  } catch {
    return normalizeDraft(content, notes);
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as BuildPromptBody;
    const notes = isNonEmptyString(body.notes) ? body.notes.trim() : "";

    if (notes.length < 20) {
      return NextResponse.json({ error: "Please provide more detail before generating a prompt." }, { status: 400 });
    }

    const trimmedNotes = notes.slice(0, 12000);
    const draft = await buildDraftWithOpenAI(trimmedNotes);

    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Failed to build agent prompt", error);
    return NextResponse.json({ error: "Could not generate the prompt right now." }, { status: 500 });
  }
}
