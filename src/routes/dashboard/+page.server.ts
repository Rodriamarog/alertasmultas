import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const vehicles = await locals.pb
		.collection('vehicles')
		.getFullList({ filter: `user="${locals.user.id}"` });

	let fines: import('pocketbase').RecordModel[] = [];
	if (vehicles.length > 0) {
		const vehicleIds = vehicles.map((v) => `vehicle="${v.id}"`).join('||');
		fines = await locals.pb
			.collection('fines')
			.getFullList({ filter: vehicleIds, sort: '-fecha', expand: 'vehicle' });
	}

	return {
		user: locals.user,
		vehicles,
		fines
	};
};
