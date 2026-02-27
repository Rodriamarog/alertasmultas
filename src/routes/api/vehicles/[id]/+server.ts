import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	let vehicle;
	try {
		vehicle = await locals.pb.collection('vehicles').getOne(params.id);
	} catch {
		return json({ error: 'Vehicle not found' }, { status: 404 });
	}

	if (vehicle.user !== locals.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	await locals.pb.collection('vehicles').delete(params.id);

	// Count remaining vehicles
	const remaining = await locals.pb
		.collection('vehicles')
		.getFullList({ filter: `user="${locals.user.id}"` });

	const subscriptionId = locals.user.stripe_subscription_id as string;
	if (subscriptionId) {
		try {
			if (remaining.length === 0) {
				await stripe.subscriptions.cancel(subscriptionId);
			} else {
				const subscription = await stripe.subscriptions.retrieve(subscriptionId);
				const item = subscription.items.data[0];
				if (item) {
					await stripe.subscriptions.update(subscriptionId, {
						items: [{ id: item.id, quantity: remaining.length }],
						proration_behavior: 'create_prorations'
					});
				}
			}
		} catch (err) {
			console.error('Failed to update Stripe subscription after delete:', err);
		}
	}

	return new Response(null, { status: 204 });
};
