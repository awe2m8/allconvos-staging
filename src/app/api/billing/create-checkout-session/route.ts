import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { normalizePlanId, STRIPE_PRICE_IDS } from "@/lib/billing";
import { getStripeServerClient } from "@/lib/stripeServer";
import { getAppOrigin } from "@/lib/siteUrls";
import { getLatestSubscriptionForUser } from "@/lib/subscriptions";

interface CheckoutRequestBody {
  planId?: unknown;
}

interface StripeLikeError {
  message?: string;
  statusCode?: number;
  type?: string;
}

function isNonEmptyString(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

function isStripeLikeError(value: unknown): value is StripeLikeError {
  return typeof value === "object" && value !== null;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let attemptedPlanId: string | undefined;
  let attemptedPriceId: string | undefined;

  try {
    const body = (await request.json()) as CheckoutRequestBody;
    const planId = normalizePlanId(typeof body.planId === "string" ? body.planId : undefined);
    const priceId = STRIPE_PRICE_IDS[planId];
    attemptedPlanId = planId;
    attemptedPriceId = priceId;

    if (!priceId) {
      return NextResponse.json({ error: "Missing Stripe Price ID configuration" }, { status: 500 });
    }

    const stripe = getStripeServerClient();
    const appOrigin = getAppOrigin();

    const user = await currentUser();
    const primaryEmailAddressId = user?.primaryEmailAddressId;
    const userEmail = user?.emailAddresses.find((address) => address.id === primaryEmailAddressId)?.emailAddress;

    const existingSubscription = await getLatestSubscriptionForUser(userId);
    let customerId = existingSubscription?.stripe_customer_id;

    if (!isNonEmptyString(customerId)) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: user?.fullName ?? undefined,
        metadata: {
          clerk_user_id: userId,
        },
      });

      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      allow_promotion_codes: true,
      success_url: `${appOrigin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appOrigin}/billing/checkout?plan=${planId}`,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe session URL was missing" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const stripeMessage = isStripeLikeError(error) && typeof error.message === "string" ? error.message : "";
    const normalizedMessage = stripeMessage.toLowerCase();

    console.error("Failed to create checkout session", {
      planId: attemptedPlanId,
      priceId: attemptedPriceId,
      error,
    });

    if (normalizedMessage.includes("price specified is inactive")) {
      return NextResponse.json(
        {
          error:
            "This plan is temporarily unavailable because its Stripe price is inactive. Please contact support to refresh billing configuration.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
