import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { env as pubEnv } from '$env/dynamic/public';
import { stripe } from '$lib/server/stripe';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const user = locals.user;

	try {
		const body = await request.json();
		const { quantity, plates } = body as { quantity: number; plates: string[] };

		if (!quantity || quantity < 1) {
			return json({ error: 'Quantity must be at least 1' }, { status: 400 });
		}

		if (!plates || plates.length !== quantity) {
			return json({ error: 'Plates count must match quantity' }, { status: 400 });
		}

		const priceId = env.STRIPE_PRICE_ID_VEHICLE;
		if (!priceId) {
			return json({ error: 'Vehicle price not configured' }, { status: 500 });
		}

		// Get or create Stripe customer
		let customerId = user.stripe_customer_id as string | undefined;

		if (!customerId) {
			const customer = await stripe.customers.create({
				email: user.email,
				metadata: { userId: user.id }
			});
			customerId = customer.id;

			await locals.pb.collection('users').update(user.id, {
				stripe_customer_id: customerId
			});
		}

		const checkoutSession = await stripe.checkout.sessions.create({
			mode: 'subscription',
			customer: customerId,
			line_items: [{ price: priceId, quantity }],
			allow_promotion_codes: true,
			success_url: `${pubEnv.PUBLIC_APP_URL || 'http://localhost:5173'}/dashboard?success=true`,
			cancel_url: `${pubEnv.PUBLIC_APP_URL || 'http://localhost:5173'}?cancelled=true`,
			metadata: {
				userId: user.id,
				plates: plates.join(',')
			},
			subscription_data: {
				metadata: { userId: user.id }
			}
		});

		return json({ url: checkoutSession.url });
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return json({ error: 'Failed to create checkout session' }, { status: 500 });
	}
};
