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

# Optional: AI prompt generation for voice-builder (falls back if missing)
OPENAI_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase schema

Run:

`supabase/schema.sql`

in the Supabase SQL editor before using billing/onboarding routes.

## Development

```bash
npm install
npm run dev
```

App routes:
- `/login`
- `/signup`
- `/start?plan=lite`
- `/billing/checkout`
- `/billing/success`
- `/app/onboarding`
