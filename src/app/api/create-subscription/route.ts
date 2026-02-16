import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const PRICE_IDS = {
    lite: process.env.STRIPE_PRICE_LITE || '',
    pro: process.env.STRIPE_PRICE_PRO || '',
} as const;

type PlanId = keyof typeof PRICE_IDS;
type ConfirmationType = 'payment_intent' | 'setup_intent';
type InvoiceWithPaymentIntent = Stripe.Invoice & {
    payment_intent?: string | Stripe.PaymentIntent | null;
};

interface CreateSubscriptionBody {
    paymentMethodId?: unknown;
    planId?: unknown;
    email?: unknown;
    name?: unknown;
    company?: unknown;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function isPlanId(value: unknown): value is PlanId {
    return value === 'lite' || value === 'pro';
}

export async function POST(request: NextRequest) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Missing STRIPE_SECRET_KEY');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (!process.env.STRIPE_TAX_RATE_GST_10) {
            console.error('Missing STRIPE_TAX_RATE_GST_10');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const body = (await request.json()) as CreateSubscriptionBody;
        const { paymentMethodId, planId, email, name, company } = body;

        if (!isNonEmptyString(paymentMethodId) || !isPlanId(planId) || !isNonEmptyString(email) || !isNonEmptyString(name)) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const priceId = PRICE_IDS[planId];
        if (!priceId) {
            return NextResponse.json(
                { error: 'Invalid plan selected. Please configure Stripe Price IDs.' },
                { status: 400 }
            );
        }

        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        if (paymentMethod.customer) {
            return NextResponse.json(
                { error: 'This payment method is already attached to another customer.' },
                { status: 400 }
            );
        }

        const customer = await stripe.customers.create({
            email,
            name,
            metadata: {
                company: isNonEmptyString(company) ? company : '',
            },
        });

        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customer.id,
        });

        await stripe.customers.update(customer.id, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            default_payment_method: paymentMethodId,
            payment_behavior: 'default_incomplete',
            collection_method: 'charge_automatically',
            default_tax_rates: [process.env.STRIPE_TAX_RATE_GST_10],
            expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
        });

        let clientSecret: string | null = null;
        let confirmationType: ConfirmationType | null = null;

        const pendingSetupIntent = subscription.pending_setup_intent;
        if (pendingSetupIntent) {
            if (typeof pendingSetupIntent === 'object' && pendingSetupIntent.client_secret) {
                clientSecret = pendingSetupIntent.client_secret;
                confirmationType = 'setup_intent';
            } else if (typeof pendingSetupIntent === 'string') {
                const si = await stripe.setupIntents.retrieve(pendingSetupIntent);
                if (si.client_secret) {
                    clientSecret = si.client_secret;
                    confirmationType = 'setup_intent';
                }
            }
        }

        const latestInvoice = subscription.latest_invoice;
        if (!clientSecret && latestInvoice && typeof latestInvoice === 'object') {
            const pi = (latestInvoice as InvoiceWithPaymentIntent).payment_intent;
            if (pi && typeof pi === 'object' && pi.client_secret) {
                clientSecret = pi.client_secret;
                confirmationType = 'payment_intent';
            } else if (typeof pi === 'string') {
                const paymentIntent = await stripe.paymentIntents.retrieve(pi);
                if (paymentIntent.client_secret) {
                    clientSecret = paymentIntent.client_secret;
                    confirmationType = 'payment_intent';
                }
            }
        }

        return NextResponse.json({
            subscriptionId: subscription.id,
            clientSecret,
            confirmationType,
            status: subscription.status,
        });
    } catch (error) {
        console.error('Subscription creation error:', error);

        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
