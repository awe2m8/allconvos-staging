import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export interface PromptDraftInput {
  businessSummary: string;
  tasks: string[];
  personality: string[];
  guardrails: string[];
  openingScript: string;
  systemPrompt: string;
}

export interface VoiceAgentRecord {
  id: string;
  user_id: string;
  name: string;
  plan: string;
  status: string;
  business_summary: string;
  tasks: string[];
  personality: string[];
  guardrails: string[];
  opening_script: string;
  system_prompt: string;
  created_at: string;
  updated_at: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0)
    .slice(0, 20);
}

export function normalizePromptDraftInput(raw: unknown): PromptDraftInput | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const draft = raw as Record<string, unknown>;
  const businessSummary = isNonEmptyString(draft.businessSummary) ? draft.businessSummary.trim() : "";
  const openingScript = isNonEmptyString(draft.openingScript) ? draft.openingScript.trim() : "";
  const systemPrompt = isNonEmptyString(draft.systemPrompt) ? draft.systemPrompt.trim() : "";
  const tasks = cleanStringArray(draft.tasks);
  const personality = cleanStringArray(draft.personality);
  const guardrails = cleanStringArray(draft.guardrails);

  if (!businessSummary || !openingScript || !systemPrompt || tasks.length === 0 || personality.length === 0 || guardrails.length === 0) {
    return null;
  }

  return {
    businessSummary,
    tasks,
    personality,
    guardrails,
    openingScript,
    systemPrompt,
  };
}

function mapVoiceAgentRow(raw: Record<string, unknown>): VoiceAgentRecord {
  return {
    id: typeof raw.id === "string" ? raw.id : "",
    user_id: typeof raw.user_id === "string" ? raw.user_id : "",
    name: typeof raw.name === "string" ? raw.name : "",
    plan: typeof raw.plan === "string" ? raw.plan : "",
    status: typeof raw.status === "string" ? raw.status : "",
    business_summary: typeof raw.business_summary === "string" ? raw.business_summary : "",
    tasks: cleanStringArray(raw.tasks),
    personality: cleanStringArray(raw.personality),
    guardrails: cleanStringArray(raw.guardrails),
    opening_script: typeof raw.opening_script === "string" ? raw.opening_script : "",
    system_prompt: typeof raw.system_prompt === "string" ? raw.system_prompt : "",
    created_at: typeof raw.created_at === "string" ? raw.created_at : "",
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : "",
  };
}

export async function createVoiceAgent(input: {
  userId: string;
  name: string;
  plan: string;
  draft: PromptDraftInput;
}): Promise<VoiceAgentRecord> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("voice_agents")
    .insert({
      user_id: input.userId,
      name: input.name,
      plan: input.plan,
      status: "active",
      business_summary: input.draft.businessSummary,
      tasks: input.draft.tasks,
      personality: input.draft.personality,
      guardrails: input.draft.guardrails,
      opening_script: input.draft.openingScript,
      system_prompt: input.draft.systemPrompt,
      updated_at: new Date().toISOString(),
    })
    .select(
      "id, user_id, name, plan, status, business_summary, tasks, personality, guardrails, opening_script, system_prompt, created_at, updated_at"
    )
    .single();

  if (error) {
    throw error;
  }

  return mapVoiceAgentRow(data as Record<string, unknown>);
}

export async function getVoiceAgentById(agentId: string): Promise<VoiceAgentRecord | null> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("voice_agents")
    .select("id, user_id, name, plan, status, business_summary, tasks, personality, guardrails, opening_script, system_prompt, created_at, updated_at")
    .eq("id", agentId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapVoiceAgentRow(data as Record<string, unknown>);
}
