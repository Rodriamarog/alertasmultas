import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const body = await request.json();
	const plate = (body.plate ?? '').trim().toUpperCase();

	if (!plate) {
		return json({ error: 'Plate is required' }, { status: 400 });
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

	return json(vehicle, { status: 201 });
};
