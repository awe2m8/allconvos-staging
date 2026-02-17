# allconvos-main

Next.js 16 app with:
- Marketing website
- Clerk authentication (Google/Apple/email)
- Stripe billing
- Supabase-backed subscription + onboarding state

## Core flow

`CTA -> /start?plan=... -> (auth gate) -> /billing/checkout -> Stripe Checkout -> webhook sync -> /app/onboarding`

## Required environment variables

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# App URL (auth + billing + onboarding domain)
NEXT_PUBLIC_APP_URL=https://app.your-domain.com

# Optional marketing URL override (defaults to app URL with `app.` removed)
NEXT_PUBLIC_MARKETING_URL=https://your-domain.com

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_LITE=

# Optional: AI prompt generation + realtime voice
OPENAI_API_KEY=
OPENAI_REALTIME_MODEL=gpt-realtime
OPENAI_REALTIME_VOICE=alloy

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Twilio -> OpenAI realtime bridge websocket URL
# Example local:
# VOICE_BRIDGE_WS_URL=ws://localhost:8081/twilio-media-stream
VOICE_BRIDGE_WS_URL=

# Twilio number provisioning
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
# Optional but recommended for countries requiring address compliance (e.g. AU)
TWILIO_ADDRESS_SID=
```

## Supabase schema

Run:

`supabase/schema.sql`

in the Supabase SQL editor before using billing/onboarding/voice-agent routes.

## Development

```bash
npm install
npm run dev
```

Standalone Twilio/OpenAI bridge process:

```bash
npm run voice:bridge
```

App routes:
- `/login`
- `/signup`
- `/start?plan=lite`
- `/billing/checkout`
- `/billing/success`
- `/app/onboarding`

## Twilio + OpenAI Realtime flow

1. Build a receptionist draft in `/app/onboarding`.
2. Click `Create Live Voice Agent` and copy the returned Twilio webhook URL.
3. In Twilio (Phone Number -> Voice), set:
   - Webhook URL: that generated `/api/twilio/voice/incoming?agentId=...` URL
   - Method: `HTTP POST`
4. Deploy/run the bridge (`voice-bridge/server.mjs`) on a public host with TLS.
5. Set `VOICE_BRIDGE_WS_URL` in this app to the bridge websocket endpoint:
   - `wss://your-bridge-domain/twilio-media-stream`

The call path is:

`Twilio Number -> /api/twilio/voice/incoming -> Twilio Media Stream -> voice-bridge -> OpenAI Realtime`

## Web Call Lab flow

After creating a live agent in `/app/onboarding`, use `Start Web Call` to test that same agent in-browser.

Path:

`Browser mic -> /api/agent/realtime-client-secret -> OpenAI Realtime (WebRTC) -> Browser audio playback`

## In-app Twilio number provisioning flow

After creating a live agent in `/app/onboarding`:

1. Use `Twilio Number Provisioning` to search available numbers.
2. Click `Buy & Attach` to purchase the number and auto-point it to that agent webhook.
3. See assigned numbers in the same panel.
