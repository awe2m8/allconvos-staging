import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Price IDs - you'll need to create these in Stripe Dashboard
// and add them to your environment variables
const PRICE_IDS: Record<string, string> = {
    lite: process.env.STRIPE_PRICE_LITE || '',
    pro: process.env.STRIPE_PRICE_PRO || '',
};

export async function POST(request: NextRequest) {
    try {
        // Initialize Stripe lazily to avoid build-time errors if key is missing
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Missing STRIPE_SECRET_KEY');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            typescript: true,
        });

        const body = await request.json();
        const { paymentMethodId, planId, email, name, company } = body;

        // Validate required fields
        if (!paymentMethodId || !planId || !email || !name) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get the price ID for the selected plan
        const priceId = PRICE_IDS[planId];
        if (!priceId) {
            return NextResponse.json(
                { error: 'Invalid plan selected. Please configure Stripe Price IDs.' },
                { status: 400 }
            );
        }

        // Create or retrieve customer
        const customers = await stripe.customers.list({ email, limit: 1 });
        let customer: Stripe.Customer;

        if (customers.data.length > 0) {
            customer = customers.data[0];
        } else {
            customer = await stripe.customers.create({
                email,
                name,
                metadata: {
                    company: company || '',
                },
            });
        }

        // Attach the payment method to the customer
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customer.id,
        });

        // Set as default payment method
        await stripe.customers.update(customer.id, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // Create the subscription with expanded fields
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            default_payment_method: paymentMethodId,
            payment_behavior: 'default_incomplete',
            collection_method: 'charge_automatically',
            expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
        });

        // With default_incomplete, Stripe may use:
        // 1. subscription.pending_setup_intent (for SetupIntent flow)
        // 2. invoice.payment_intent (for PaymentIntent flow)
        // We need to check BOTH and use whichever has a client_secret

        let clientSecret: string | null = null;
        let secretSource = 'NONE';

        // Check 1: subscription.pending_setup_intent (SetupIntent for 3D Secure / validation)
        const pendingSetupIntent = (subscription as any).pending_setup_intent;
        if (pendingSetupIntent) {
            if (typeof pendingSetupIntent === 'object' && pendingSetupIntent.client_secret) {
                clientSecret = pendingSetupIntent.client_secret;
                secretSource = 'subscription.pending_setup_intent';
            } else if (typeof pendingSetupIntent === 'string') {
                // It's just an ID, retrieve the full object
                const si = await stripe.setupIntents.retrieve(pendingSetupIntent);
                clientSecret = si.client_secret;
                secretSource = 'subscription.pending_setup_intent (retrieved)';
            }
        }

        // Check 2: invoice.payment_intent (PaymentIntent for immediate charge)
        if (!clientSecret) {
            const latestInvoice = subscription.latest_invoice as any;
            if (latestInvoice && typeof latestInvoice === 'object') {
                const pi = latestInvoice.payment_intent;
                if (pi && typeof pi === 'object' && pi.client_secret) {
                    clientSecret = pi.client_secret;
                    secretSource = 'invoice.payment_intent';
                } else if (typeof pi === 'string') {
                    const paymentIntent = await stripe.paymentIntents.retrieve(pi);
                    clientSecret = paymentIntent.client_secret;
                    secretSource = 'invoice.payment_intent (retrieved)';
                }
            }
        }

        // Debug info
        const latestInvoice = subscription.latest_invoice as any;

        console.log('Subscription created:', {
            id: subscription.id,
            status: subscription.status,
            clientSecretSource: secretSource,
            hasClientSecret: !!clientSecret
        });

        return NextResponse.json({
            subscriptionId: subscription.id,
            clientSecret: clientSecret,
            status: subscription.status,
            debug: {
                secretSource: secretSource,
                invoiceId: latestInvoice?.id || 'NONE',
                invoiceAmountDue: latestInvoice?.amount_due || 0,
                hasPendingSetupIntent: !!pendingSetupIntent,
                pendingSetupIntentType: typeof pendingSetupIntent,
                hasPaymentIntent: !!(latestInvoice?.payment_intent),
                paymentIntentType: typeof latestInvoice?.payment_intent,
            }
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
