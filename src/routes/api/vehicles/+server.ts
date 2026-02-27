import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const body = await request.json();
	const plate = (body.plate ?? '').trim().toUpperCase();

	if (!plate) {
		return json({ error: 'Plate is required' }, { status: 400 });
	}

	if (plate.length < 7 || !/^[A-Z0-9]+$/.test(plate)) {
		return json({ error: 'Placa inválida (mínimo 7 caracteres, solo letras y números)' }, { status: 400 });
	}

	// Require active subscription
	if (locals.user.subscription_status !== 'active') {
		return json({ error: 'Suscripción requerida' }, { status: 402 });
	}

	// Check for duplicate plate for this user
	let existing;
	try {
		existing = await locals.pb
			.collection('vehicles')
			.getFirstListItem(`user="${locals.user.id}" && plate="${plate}"`);
	} catch {
		existing = null;
	}

	if (existing) {
		return json({ error: 'Plate already registered' }, { status: 409 });
	}

	const vehicle = await locals.pb.collection('vehicles').create({
		user: locals.user.id,
		plate
	});

	// Update Stripe subscription quantity
	const subscriptionId = locals.user.stripe_subscription_id as string;
	if (subscriptionId) {
		try {
			const subscription = await stripe.subscriptions.retrieve(subscriptionId);
			const item = subscription.items.data[0];
			if (item) {
				await stripe.subscriptions.update(subscriptionId, {
					items: [{ id: item.id, quantity: (item.quantity ?? 1) + 1 }],
					proration_behavior: 'create_prorations'
				});
			}
		} catch (err) {
			console.error('Failed to update Stripe subscription quantity:', err);
		}
	}

	return json(vehicle, { status: 201 });
};
