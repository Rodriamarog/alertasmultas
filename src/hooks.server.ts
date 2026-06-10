import PocketBase from 'pocketbase';
import { env as publicEnv } from '$env/dynamic/public';
import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (!dev) {
		const proto = event.request.headers.get('x-forwarded-proto');
		if (proto === 'http') {
			const url = event.request.url.replace(/^http:/, 'https:');
			return new Response(null, { status: 301, headers: { location: url } });
		}
	}

	event.locals.pb = new PocketBase(publicEnv.PUBLIC_POCKETBASE_URL || 'http://localhost:8090');
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = event.locals.pb.authStore.record;
		}
	} catch {
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);
	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());
	return response;
};
