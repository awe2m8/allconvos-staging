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
            default_payment_method: paymentMethodId,
            payment_behavior: 'default_incomplete',
            collection_method: 'charge_automatically',
            expand: ['latest_invoice.payment_intent'],
        });

        // Step 1: Check what we got from the subscription creation
        const latestInvoice = subscription.latest_invoice;
        const isExpanded = typeof latestInvoice !== 'string';

        let paymentIntent: Stripe.PaymentIntent | null = null;
        let invoiceAmountDue = 0;
        let invoiceId = '';

        if (isExpanded && latestInvoice) {
            const invoice = latestInvoice as any;
            invoiceId = invoice.id;
            invoiceAmountDue = invoice.amount_due || 0;

            // Try to get PI directly from the expanded invoice
            const piFromExpansion = invoice.payment_intent;

            if (typeof piFromExpansion === 'object' && piFromExpansion !== null) {
                paymentIntent = piFromExpansion as Stripe.PaymentIntent;
            } else if (typeof piFromExpansion === 'string') {
                // Expansion returned just an ID, retrieve the full object
                paymentIntent = await stripe.paymentIntents.retrieve(piFromExpansion);
            }
        } else if (typeof latestInvoice === 'string') {
            // Expansion failed completely, retrieve invoice manually
            invoiceId = latestInvoice;
            const invoice = await stripe.invoices.retrieve(latestInvoice, {
                expand: ['payment_intent']
            }) as any;
            invoiceAmountDue = invoice.amount_due || 0;

            const piFromRetrieval = invoice.payment_intent;
            if (typeof piFromRetrieval === 'object' && piFromRetrieval !== null) {
                paymentIntent = piFromRetrieval as Stripe.PaymentIntent;
            } else if (typeof piFromRetrieval === 'string') {
                paymentIntent = await stripe.paymentIntents.retrieve(piFromRetrieval);
            }
        }

        console.log('Subscription created:', {
            id: subscription.id,
            status: subscription.status,
            paymentIntentId: paymentIntent?.id,
            hasClientSecret: !!paymentIntent?.client_secret
        });

        return NextResponse.json({
            subscriptionId: subscription.id,
            clientSecret: paymentIntent?.client_secret || null,
            status: subscription.status,
            debug: {
                step1_isInvoiceExpanded: isExpanded,
                invoiceId: invoiceId,
                invoiceAmountDue: invoiceAmountDue,
                paymentIntentId: paymentIntent ? paymentIntent.id : 'NONE',
                paymentIntentStatus: paymentIntent ? paymentIntent.status : 'NONE',
                rawLatestInvoiceType: typeof subscription.latest_invoice,
                rawPiOnInvoice: isExpanded ? typeof (subscription.latest_invoice as any)?.payment_intent : 'N/A',
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
