import { appUrl } from "@/lib/siteUrls";

export interface TwilioAvailableNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string | null;
  region: string | null;
  isoCountry: string | null;
}

export interface TwilioProvisionedNumber {
  sid: string;
  phoneNumber: string;
  friendlyName: string;
  voiceUrl: string | null;
}

interface TwilioSearchResponse {
  available_phone_numbers?: Array<{
    phone_number?: string;
    friendly_name?: string;
    locality?: string | null;
    region?: string | null;
    iso_country?: string | null;
  }>;
}

interface TwilioProvisionResponse {
  sid?: string;
  phone_number?: string;
  friendly_name?: string;
  voice_url?: string | null;
}

function getTwilioConfig(): { accountSid: string; authToken: string } {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Missing Twilio environment variables");
  }

  return {
    accountSid,
    authToken,
  };
}

function buildTwilioAuthorizationHeader(accountSid: string, authToken: string): string {
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  return `Basic ${credentials}`;
}

async function twilioRequest(path: string, init?: RequestInit): Promise<Response> {
  const { accountSid, authToken } = getTwilioConfig();
  const twilioApiBase = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`;

  return fetch(`${twilioApiBase}${path}`, {
    ...init,
    headers: {
      Authorization: buildTwilioAuthorizationHeader(accountSid, authToken),
      ...(init?.headers ?? {}),
    },
  });
}

function normalizeCountryCode(countryCode: string): string {
  const raw = countryCode.trim().toUpperCase();

  if (/^[A-Z]{2}$/.test(raw)) {
    return raw;
  }

  const digits = raw.replace(/^\+/, "").replaceAll(/\D/g, "");
  const callingCodeMap: Record<string, string> = {
    "1": "US",
    "44": "GB",
    "61": "AU",
    "64": "NZ",
  };

  const mapped = callingCodeMap[digits];
  if (mapped) {
    return mapped;
  }

  throw new Error("Invalid country code. Use ISO code like AU or calling code like +61.");
}

function normalizeAreaCode(areaCode: string | null | undefined): string | null {
  if (!areaCode) {
    return null;
  }

  const digitsOnly = areaCode.replaceAll(/\D/g, "");
  if (!digitsOnly) {
    return null;
  }

  return digitsOnly.slice(0, 6);
}

export async function searchAvailableTwilioNumbers(input: {
  countryCode: string;
  areaCode?: string | null;
  limit?: number;
}): Promise<TwilioAvailableNumber[]> {
  const countryCode = normalizeCountryCode(input.countryCode);
  if (!countryCode || countryCode.length !== 2) {
    throw new Error("Invalid country code");
  }

  const params = new URLSearchParams({
    PageSize: String(Math.min(Math.max(input.limit ?? 8, 1), 20)),
    VoiceEnabled: "true",
    SmsEnabled: "true",
  });

  const isAustralia = countryCode === "AU";
  const normalizedAreaCode = normalizeAreaCode(input.areaCode);
  if (normalizedAreaCode && !isAustralia) {
    params.set("AreaCode", normalizedAreaCode);
  }

  async function fetchByResource(resource: "Local" | "Mobile"): Promise<TwilioAvailableNumber[]> {
    const response = await twilioRequest(`/AvailablePhoneNumbers/${countryCode}/${resource}.json?${params.toString()}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Twilio number search failed (${response.status}): ${errorText}`);
    }

    const payload = (await response.json()) as TwilioSearchResponse;
    const numbers = payload.available_phone_numbers ?? [];

    return numbers
      .map((number) => {
        const phoneNumber = typeof number.phone_number === "string" ? number.phone_number.trim() : "";
        if (!phoneNumber) {
          return null;
        }

        return {
          phoneNumber,
          friendlyName: typeof number.friendly_name === "string" ? number.friendly_name : phoneNumber,
          locality: typeof number.locality === "string" ? number.locality : null,
          region: typeof number.region === "string" ? number.region : null,
          isoCountry: typeof number.iso_country === "string" ? number.iso_country : null,
        } satisfies TwilioAvailableNumber;
      })
      .filter((number): number is TwilioAvailableNumber => number !== null);
  }

  // AU should prioritize mobile inventory so users don't receive landline-heavy results.
  if (isAustralia) {
    const mobileNumbers = await fetchByResource("Mobile");
    if (mobileNumbers.length > 0) {
      return mobileNumbers;
    }
    return fetchByResource("Local");
  }

  return fetchByResource("Local");
}

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.trim();
}

export async function provisionTwilioNumber(input: {
  phoneNumber: string;
  agentId: string;
}): Promise<TwilioProvisionedNumber> {
  const normalizedPhoneNumber = normalizePhoneNumber(input.phoneNumber);
  if (!/^\+\d{7,15}$/.test(normalizedPhoneNumber)) {
    throw new Error("Invalid phone number format");
  }

  const voiceUrl = appUrl(`/api/twilio/voice/incoming?agentId=${encodeURIComponent(input.agentId)}`);
  const body = new URLSearchParams({
    PhoneNumber: normalizedPhoneNumber,
    VoiceUrl: voiceUrl,
    VoiceMethod: "POST",
  });

  const response = await twilioRequest("/IncomingPhoneNumbers.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twilio number provisioning failed (${response.status}): ${errorText}`);
  }

  const payload = (await response.json()) as TwilioProvisionResponse;

  const sid = typeof payload.sid === "string" ? payload.sid : "";
  const phoneNumber = typeof payload.phone_number === "string" ? payload.phone_number : normalizedPhoneNumber;
  const friendlyName = typeof payload.friendly_name === "string" ? payload.friendly_name : phoneNumber;
  const returnedVoiceUrl = typeof payload.voice_url === "string" ? payload.voice_url : voiceUrl;

  if (!sid || !phoneNumber) {
    throw new Error("Twilio provisioning response missing required fields");
  }

  return {
    sid,
    phoneNumber,
    friendlyName,
    voiceUrl: returnedVoiceUrl,
  };
}
