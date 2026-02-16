import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { normalizePlanId, resolvePlanIdFromPriceId } from "@/lib/billing";
import { ensureOnboardingProgressRow } from "@/lib/onboarding";
import { getStripeServerClient } from "@/lib/stripeServer";
import { upsertSubscriptionRecord } from "@/lib/subscriptions";

export const runtime = "nodejs";

function readSubscriptionCustomerId(subscription: Stripe.Subscription): string {
  if (typeof subscription.customer === "string") {
    return subscription.customer;
  }

  return subscription.customer.id;
}

async function resolveClerkUserId(
  stripe: Stripe,
  subscription: Stripe.Subscription,
  fallbackUserId: string | null
): Promise<string | null> {
  if (fallbackUserId) {
    return fallbackUserId;
  }

  const customerId = readSubscriptionCustomerId(subscription);
  const customer = await stripe.customers.retrieve(customerId);

  if (customer.deleted) {
    return null;
  }

  return customer.metadata.clerk_user_id || null;
}

async function syncSubscription(
  subscription: Stripe.Subscription,
  fallbackUserId: string | null = null,
  fallbackPlanId: string | null = null
): Promise<void> {
  const stripe = getStripeServerClient();
  const userId = await resolveClerkUserId(stripe, subscription, fallbackUserId);

  if (!userId) {
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const resolvedPlan = resolvePlanIdFromPriceId(priceId);
  const plan = resolvedPlan ?? normalizePlanId(fallbackPlanId);
  const subscriptionRecord = subscription as unknown as Record<string, unknown>;
  const currentPeriodEndRaw = subscriptionRecord.current_period_end;
  const currentPeriodEnd =
    typeof currentPeriodEndRaw === "number" ? new Date(currentPeriodEndRaw * 1000).toISOString() : null;

  await upsertSubscriptionRecord({
    userId,
    stripeCustomerId: readSubscriptionCustomerId(subscription),
    stripeSubscriptionId: subscription.id,
    plan,
    status: subscription.status,
    currentPeriodEnd,
  });

  await ensureOnboardingProgressRow(userId);
}

export async function POST(request: NextRequest) {
  const stripe = getStripeServerClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const headerStore = await headers();
  const signature = headerStore.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Invalid Stripe webhook signature", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription" && session.subscription) {
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : session.subscription.id;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userIdFromMetadata = session.metadata?.user_id || null;
        const planIdFromMetadata = session.metadata?.plan_id || null;
        await syncSubscription(subscription, userIdFromMetadata, planIdFromMetadata);
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(
        subscription,
        subscription.metadata.user_id || null,
        subscription.metadata.plan_id || null
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
