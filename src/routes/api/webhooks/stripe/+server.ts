import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import PocketBase from 'pocketbase';
import { stripe, webhookSecret } from '$lib/server/stripe';
import type Stripe from 'stripe';
import twilio from 'twilio';

const WELCOME_TEMPLATE_SID = 'HXd9966754893693dff0805363cd061b61';

async function getAdminPb() {
	const pb = new PocketBase(env.PUBLIC_POCKETBASE_URL || 'http://localhost:8090');
	await pb.collection('_superusers').authWithPassword(env.POCKETBASE_ADMIN_EMAIL || '', env.POCKETBASE_ADMIN_PASSWORD || '');
	return pb;
}

export const POST: RequestHandler = async ({ request }) => {
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		return json({ error: 'No signature' }, { status: 400 });
	}

	if (!webhookSecret) {
		console.error('Stripe webhook secret not configured');
		return json({ error: 'Webhook secret not configured' }, { status: 500 });
	}

	let event: Stripe.Event;

	try {
		const body = await request.text();
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (err) {
		console.error('Webhook signature verification failed:', err);
		return json({ error: 'Invalid signature' }, { status: 400 });
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session;
				await handleCheckoutComplete(session);
				break;
			}
			case 'customer.subscription.updated': {
				const subscription = event.data.object as Stripe.Subscription;
				await handleSubscriptionUpdated(subscription);
				break;
			}
			case 'customer.subscription.deleted': {
				const subscription = event.data.object as Stripe.Subscription;
				await handleSubscriptionDeleted(subscription);
				break;
			}
			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return json({ received: true });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return json({ error: 'Webhook processing failed' }, { status: 500 });
	}
};

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
	const userId = session.metadata?.userId;
	const platesRaw = session.metadata?.plates;

	if (!userId || !platesRaw) {
		console.error('Missing userId or plates in checkout session metadata');
		return;
	}

	const pb = await getAdminPb();
	let user;
	try {
		user = await pb.collection('users').getOne(userId);
	} catch {
		console.error(`User not found: ${userId}`);
		return;
	}

	const subscriptionId = session.subscription as string;
	const customerId = session.customer as string;

	// Create vehicle records for each plate (skip duplicates)
	const plates = platesRaw.split(',').map((p) => p.trim().toUpperCase()).filter((p) => /^[A-Z0-9]{7,}$/.test(p));
	for (const plate of plates) {
		let existing;
		try {
			existing = await pb.collection('vehicles').getFirstListItem(`user="${userId}" && plate="${plate}"`);
		} catch {
			existing = null;
		}
		if (!existing) {
			await pb.collection('vehicles').create({ user: userId, plate });
		}
	}

	await pb.collection('users').update(user.id, {
		subscription_tier: 'active',
		stripe_customer_id: customerId,
		stripe_subscription_id: subscriptionId,
		subscription_status: 'active',
		subscription_updated_at: new Date().toISOString()
	});

	// Send welcome WhatsApp notification
	const phone = user.phone;
	if (phone && env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_WHATSAPP_FROM) {
		try {
			const twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
			await twilioClient.messages.create({
				from: env.TWILIO_WHATSAPP_FROM,
				to: `whatsapp:${phone}`,
				contentSid: WELCOME_TEMPLATE_SID,
				contentVariables: JSON.stringify({
					'1': plates.join(' | ')
				})
			});
			console.log(`✓ Welcome WhatsApp sent to ${phone}`);
		} catch (err) {
			console.error('Failed to send welcome WhatsApp:', err);
		}
	}
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
	const customerId = subscription.customer as string;

	const pb = await getAdminPb();
	let user;
	try {
		user = await pb.collection('users').getFirstListItem(`stripe_customer_id="${customerId}"`);
	} catch {
		console.error(`User not found for customer: ${customerId}`);
		return;
	}

	await pb.collection('users').update(user.id, {
		subscription_tier: 'active',
		stripe_subscription_id: subscription.id,
		subscription_status: subscription.status,
		subscription_updated_at: new Date().toISOString()
	});
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	const customerId = subscription.customer as string;

	const pb = await getAdminPb();
	let user;
	try {
		user = await pb.collection('users').getFirstListItem(`stripe_customer_id="${customerId}"`);
	} catch {
		console.error(`User not found for customer: ${customerId}`);
		return;
	}

	await pb.collection('users').update(user.id, {
		subscription_tier: 'free',
		subscription_status: 'cancelled',
		stripe_subscription_id: '',
		subscription_updated_at: new Date().toISOString()
	});
}
