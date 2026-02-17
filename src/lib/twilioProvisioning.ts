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

interface TwilioErrorResponse {
  code?: number;
  message?: string;
  more_info?: string;
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

interface TwilioIncomingPhoneNumberResponse {
  sid?: string;
  phone_number?: string;
  friendly_name?: string;
  voice_url?: string | null;
}

interface TwilioIncomingPhoneNumbersListResponse {
  incoming_phone_numbers?: TwilioIncomingPhoneNumberResponse[];
}

interface TwilioAddressResponse {
  sid?: string;
}

interface TwilioAddressesListResponse {
  addresses?: TwilioAddressResponse[];
}

export class TwilioApiError extends Error {
  status: number;
  code: number | null;
  moreInfo: string | null;

  constructor(input: { message: string; status: number; code?: number | null; moreInfo?: string | null }) {
    super(input.message);
    this.name = "TwilioApiError";
    this.status = input.status;
    this.code = input.code ?? null;
    this.moreInfo = input.moreInfo ?? null;
  }
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

async function readTwilioError(response: Response, fallbackMessage: string): Promise<TwilioApiError> {
  let code: number | null = null;
  let message = fallbackMessage;
  let moreInfo: string | null = null;

  const contentType = response.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const payload = (await response.json()) as TwilioErrorResponse;
      if (typeof payload.code === "number") {
        code = payload.code;
      }
      if (typeof payload.message === "string" && payload.message.trim()) {
        message = payload.message.trim();
      }
      if (typeof payload.more_info === "string" && payload.more_info.trim()) {
        moreInfo = payload.more_info.trim();
      }
    } else {
      const text = (await response.text()).trim();
      if (text) {
        message = text;
      }
    }
  } catch {
    // Ignore parse errors and use fallback message.
  }

  const withCode = code ? `Twilio error ${code}: ${message}` : `Twilio error: ${message}`;
  return new TwilioApiError({
    message: withCode,
    status: response.status,
    code,
    moreInfo,
  });
}

let cachedAddressSid: string | null | undefined;

function getConfiguredTwilioAddressSid(): string | null {
  const raw = process.env.TWILIO_ADDRESS_SID;
  if (!raw) {
    return null;
  }

  const sid = raw.trim();
  if (!sid) {
    return null;
  }

  return sid;
}

function getConfiguredTwilioBundleSid(): string | null {
  const raw = process.env.TWILIO_BUNDLE_SID;
  if (!raw) {
    return null;
  }

  const sid = raw.trim();
  if (!sid) {
    return null;
  }

  return sid;
}

async function findAnyTwilioAddressSid(): Promise<string | null> {
  if (cachedAddressSid !== undefined) {
    return cachedAddressSid;
  }

  const response = await twilioRequest("/Addresses.json?PageSize=20");
  if (!response.ok) {
    cachedAddressSid = null;
    return cachedAddressSid;
  }

  const payload = (await response.json()) as TwilioAddressesListResponse;
  const addressSid =
    payload.addresses
      ?.map((address) => (typeof address.sid === "string" ? address.sid.trim() : ""))
      .find((sid) => sid.length > 0) ?? null;

  cachedAddressSid = addressSid;
  return cachedAddressSid;
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

  const baseParams = {
    PageSize: String(Math.min(Math.max(input.limit ?? 8, 1), 20)),
    VoiceEnabled: "true",
    SmsEnabled: "true",
  };

  const isAustralia = countryCode === "AU";
  const normalizedAreaCode = normalizeAreaCode(input.areaCode);
  function buildSearchParams(options?: { excludeAddressRequired?: boolean }): URLSearchParams {
    const params = new URLSearchParams(baseParams);
    if (normalizedAreaCode && !isAustralia) {
      params.set("AreaCode", normalizedAreaCode);
    }
    if (isAustralia && options?.excludeAddressRequired) {
      // AU inventory often contains numbers with regulatory address requirements.
      // We try this filter first, then fall back to broader AU inventory.
      params.set("ExcludeAllAddressRequired", "true");
    }
    return params;
  }

  async function fetchByResource(
    resource: "Local" | "Mobile",
    options?: { excludeAddressRequired?: boolean; softFail?: boolean }
  ): Promise<TwilioAvailableNumber[]> {
    const params = buildSearchParams(options);
    const response = await twilioRequest(`/AvailablePhoneNumbers/${countryCode}/${resource}.json?${params.toString()}`);
    if (!response.ok) {
      if (options?.softFail) {
        return [];
      }
      throw await readTwilioError(response, `Could not search ${resource.toLowerCase()} numbers`);
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
    const mobileNumbers = await fetchByResource("Mobile", {
      excludeAddressRequired: true,
      softFail: true,
    });
    if (mobileNumbers.length > 0) {
      return mobileNumbers;
    }

    const fallbackMobile = await fetchByResource("Mobile");
    if (fallbackMobile.length > 0) {
      return fallbackMobile;
    }

    const localNumbers = await fetchByResource("Local", {
      excludeAddressRequired: true,
      softFail: true,
    });
    if (localNumbers.length > 0) {
      return localNumbers;
    }

    return fetchByResource("Local");
  }

  return fetchByResource("Local");
}

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.trim();
}

function mapIncomingNumber(
  payload: TwilioIncomingPhoneNumberResponse,
  fallback: { phoneNumber: string; voiceUrl: string }
): TwilioProvisionedNumber {
  const sid = typeof payload.sid === "string" ? payload.sid : "";
  const phoneNumber = typeof payload.phone_number === "string" ? payload.phone_number : fallback.phoneNumber;
  const friendlyName = typeof payload.friendly_name === "string" ? payload.friendly_name : phoneNumber;
  const returnedVoiceUrl = typeof payload.voice_url === "string" ? payload.voice_url : fallback.voiceUrl;

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

async function findIncomingPhoneNumberByPhoneNumber(phoneNumber: string): Promise<TwilioIncomingPhoneNumberResponse | null> {
  const params = new URLSearchParams({
    PhoneNumber: phoneNumber,
    PageSize: "1",
  });

  const response = await twilioRequest(`/IncomingPhoneNumbers.json?${params.toString()}`);
  if (!response.ok) {
    throw await readTwilioError(response, "Could not read current Twilio numbers");
  }

  const payload = (await response.json()) as TwilioIncomingPhoneNumbersListResponse;
  return payload.incoming_phone_numbers?.[0] ?? null;
}

async function updateIncomingPhoneNumberVoiceWebhook(input: { sid: string; voiceUrl: string }): Promise<TwilioIncomingPhoneNumberResponse> {
  const body = new URLSearchParams({
    VoiceUrl: input.voiceUrl,
    VoiceMethod: "POST",
  });

  const response = await twilioRequest(`/IncomingPhoneNumbers/${encodeURIComponent(input.sid)}.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw await readTwilioError(response, "Could not attach webhook to existing number");
  }

  return (await response.json()) as TwilioIncomingPhoneNumberResponse;
}

async function createIncomingPhoneNumber(input: {
  phoneNumber: string;
  voiceUrl: string;
  addressSid?: string | null;
  bundleSid?: string | null;
}): Promise<TwilioIncomingPhoneNumberResponse> {
  const body = new URLSearchParams({
    PhoneNumber: input.phoneNumber,
    VoiceUrl: input.voiceUrl,
    VoiceMethod: "POST",
  });

  const addressSid = input.addressSid?.trim();
  if (addressSid) {
    body.set("AddressSid", addressSid);
  }
  const bundleSid = input.bundleSid?.trim();
  if (bundleSid) {
    body.set("BundleSid", bundleSid);
  }

  const response = await twilioRequest("/IncomingPhoneNumbers.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw await readTwilioError(response, "Could not buy and attach this number");
  }

  return (await response.json()) as TwilioIncomingPhoneNumberResponse;
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

  const alreadyOwned = await findIncomingPhoneNumberByPhoneNumber(normalizedPhoneNumber);
  if (alreadyOwned?.sid) {
    const updated = await updateIncomingPhoneNumberVoiceWebhook({
      sid: alreadyOwned.sid,
      voiceUrl,
    });
    return mapIncomingNumber(updated, {
      phoneNumber: normalizedPhoneNumber,
      voiceUrl,
    });
  }

  const configuredAddressSid = getConfiguredTwilioAddressSid();
  const configuredBundleSid = getConfiguredTwilioBundleSid();

  async function attemptPurchase(addressSid: string | null): Promise<TwilioProvisionedNumber> {
    try {
      const payload = await createIncomingPhoneNumber({
        phoneNumber: normalizedPhoneNumber,
        voiceUrl,
        addressSid,
        bundleSid: configuredBundleSid,
      });
      return mapIncomingNumber(payload, {
        phoneNumber: normalizedPhoneNumber,
        voiceUrl,
      });
    } catch (error) {
      if (error instanceof TwilioApiError && error.code === 21649 && !configuredBundleSid) {
        throw new Error(
          "Twilio requires a Regulatory Bundle for AU mobile numbers. Set TWILIO_BUNDLE_SID in Vercel and retry."
        );
      }
      throw error;
    }
  }

  try {
    return await attemptPurchase(configuredAddressSid);
  } catch (error) {
    if (!(error instanceof TwilioApiError) || error.code !== 21631 || configuredAddressSid) {
      throw error;
    }

    const fallbackAddressSid = await findAnyTwilioAddressSid();
    if (!fallbackAddressSid) {
      throw new Error(
        "Twilio requires an approved Address for this number. Add one in Twilio, then set TWILIO_ADDRESS_SID in Vercel and retry."
      );
    }

    return attemptPurchase(fallbackAddressSid);
  }
}
