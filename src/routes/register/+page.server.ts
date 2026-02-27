import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const passwordConfirm = data.get('passwordConfirm') as string;
		const countryCode = data.get('countryCode') as string;
		const rawPhone = data.get('phone') as string;

		const digitsOnly = rawPhone?.replace(/\D/g, '') ?? '';
		if (digitsOnly.length !== 10) {
			return fail(400, { error: 'Ingresa un número de 10 dígitos (sin código de país)' });
		}
		const phone = `${countryCode}${digitsOnly}`;

		if (password !== passwordConfirm) {
			return fail(400, { error: 'Las contraseñas no coinciden' });
		}

		if (password.length < 8) {
			return fail(400, { error: 'La contraseña debe tener al menos 8 caracteres' });
		}

		try {
			await locals.pb.collection('users').create({ email, password, passwordConfirm, phone });
			await locals.pb.collection('users').requestVerification(email);
		} catch (err: any) {
			return fail(400, { error: err?.data?.message || 'No se pudo crear la cuenta' });
		}

		return { success: true, email };
	}
};
