import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export interface TwilioPhoneNumberRecord {
  id: string;
  user_id: string;
  agent_id: string;
  twilio_account_sid: string;
  incoming_phone_number_sid: string;
  phone_number: string;
  friendly_name: string | null;
  voice_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

function mapTwilioPhoneNumberRow(row: Record<string, unknown>): TwilioPhoneNumberRecord {
  return {
    id: typeof row.id === "string" ? row.id : "",
    user_id: typeof row.user_id === "string" ? row.user_id : "",
    agent_id: typeof row.agent_id === "string" ? row.agent_id : "",
    twilio_account_sid: typeof row.twilio_account_sid === "string" ? row.twilio_account_sid : "",
    incoming_phone_number_sid: typeof row.incoming_phone_number_sid === "string" ? row.incoming_phone_number_sid : "",
    phone_number: typeof row.phone_number === "string" ? row.phone_number : "",
    friendly_name: typeof row.friendly_name === "string" ? row.friendly_name : null,
    voice_url: typeof row.voice_url === "string" ? row.voice_url : null,
    status: typeof row.status === "string" ? row.status : "active",
    created_at: typeof row.created_at === "string" ? row.created_at : "",
    updated_at: typeof row.updated_at === "string" ? row.updated_at : "",
  };
}

export async function upsertTwilioPhoneNumber(input: {
  userId: string;
  agentId: string;
  twilioAccountSid: string;
  incomingPhoneNumberSid: string;
  phoneNumber: string;
  friendlyName: string | null;
  voiceUrl: string | null;
  status: string;
}): Promise<TwilioPhoneNumberRecord> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("twilio_phone_numbers")
    .upsert(
      {
        user_id: input.userId,
        agent_id: input.agentId,
        twilio_account_sid: input.twilioAccountSid,
        incoming_phone_number_sid: input.incomingPhoneNumberSid,
        phone_number: input.phoneNumber,
        friendly_name: input.friendlyName,
        voice_url: input.voiceUrl,
        status: input.status,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "incoming_phone_number_sid",
      }
    )
    .select(
      "id, user_id, agent_id, twilio_account_sid, incoming_phone_number_sid, phone_number, friendly_name, voice_url, status, created_at, updated_at"
    )
    .single();

  if (error) {
    throw error;
  }

  return mapTwilioPhoneNumberRow(data as Record<string, unknown>);
}

export async function listTwilioPhoneNumbersForAgent(userId: string, agentId: string): Promise<TwilioPhoneNumberRecord[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("twilio_phone_numbers")
    .select("id, user_id, agent_id, twilio_account_sid, incoming_phone_number_sid, phone_number, friendly_name, voice_url, status, created_at, updated_at")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapTwilioPhoneNumberRow(row as Record<string, unknown>));
}

export async function listActiveTwilioPhoneNumbersForUser(userId: string): Promise<TwilioPhoneNumberRecord[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("twilio_phone_numbers")
    .select("id, user_id, agent_id, twilio_account_sid, incoming_phone_number_sid, phone_number, friendly_name, voice_url, status, created_at, updated_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapTwilioPhoneNumberRow(row as Record<string, unknown>));
}

export async function getTwilioPhoneNumberForUserAgentBySid(input: {
  userId: string;
  agentId: string;
  incomingPhoneNumberSid: string;
}): Promise<TwilioPhoneNumberRecord | null> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("twilio_phone_numbers")
    .select("id, user_id, agent_id, twilio_account_sid, incoming_phone_number_sid, phone_number, friendly_name, voice_url, status, created_at, updated_at")
    .eq("user_id", input.userId)
    .eq("agent_id", input.agentId)
    .eq("incoming_phone_number_sid", input.incomingPhoneNumberSid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapTwilioPhoneNumberRow(data as Record<string, unknown>);
}

export async function updateTwilioPhoneNumberStatus(input: {
  id: string;
  status: string;
  voiceUrl?: string | null;
}): Promise<TwilioPhoneNumberRecord> {
  const supabase = getSupabaseAdminClient();

  const updatePayload: Record<string, unknown> = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  if (input.voiceUrl !== undefined) {
    updatePayload.voice_url = input.voiceUrl;
  }

  const { data, error } = await supabase
    .from("twilio_phone_numbers")
    .update(updatePayload)
    .eq("id", input.id)
    .select(
      "id, user_id, agent_id, twilio_account_sid, incoming_phone_number_sid, phone_number, friendly_name, voice_url, status, created_at, updated_at"
    )
    .single();

  if (error) {
    throw error;
  }

  return mapTwilioPhoneNumberRow(data as Record<string, unknown>);
}
