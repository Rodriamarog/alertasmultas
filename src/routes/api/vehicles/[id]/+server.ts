import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

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

	return new Response(null, { status: 204 });
};
