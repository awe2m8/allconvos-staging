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

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: {
                save_default_payment_method: 'on_subscription',
            },
            expand: ['latest_invoice.payment_intent'],
        });

        // Force retrieval of the invoice to ensure we have the latest status
        const invoiceId = typeof subscription.latest_invoice === 'string'
            ? subscription.latest_invoice
            : (subscription.latest_invoice as Stripe.Invoice).id;

        const invoice = await stripe.invoices.retrieve(invoiceId, {
            expand: ['payment_intent']
        }) as any;

        let paymentIntent = invoice.payment_intent as string | Stripe.PaymentIntent | null;

        // CRITICAL FIX: Even with expand, sometimes specifically in certain API versions 
        // or mock environments, this remains an ID. We must check.
        if (typeof paymentIntent === 'string') {
            paymentIntent = await stripe.paymentIntents.retrieve(paymentIntent);
        }

        console.log('Subscription created:', {
            id: subscription.id,
            status: subscription.status,
            paymentIntentId: paymentIntent?.id,
            hasClientSecret: !!paymentIntent?.client_secret
        });

        return NextResponse.json({
            subscriptionId: subscription.id,
            clientSecret: paymentIntent?.client_secret,
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
