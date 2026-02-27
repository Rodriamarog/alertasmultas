// scripts/lib/notify.js
// Inserts a new fine record into PocketBase and sends a WhatsApp notification.

const CONTENT_SID = 'HXd2473dd12164260d0b5f52aeccc29c7a';

async function pbPost(pbUrl, token, path, body) {
	const res = await fetch(`${pbUrl}/api/${path}`, {
		method: 'POST',
		headers: { Authorization: token, 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(`PocketBase POST ${path} failed: ${JSON.stringify(err)}`);
	}
	return res.json();
}

async function pbPatch(pbUrl, token, path, body) {
	const res = await fetch(`${pbUrl}/api/${path}`, {
		method: 'PATCH',
		headers: { Authorization: token, 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(`PocketBase PATCH ${path} failed: ${JSON.stringify(err)}`);
	}
	return res.json();
}

/**
 * Insert a new fine into PocketBase and send a WhatsApp notification.
 *
 * @param {{ pbUrl: string, token: string, twilioClient: object|null, twilioFrom: string }} config
 * @param {{ id: string, plate: string, expand?: { user?: { phone?: string } } }} vehicle
 * @param {{ folio: string, fecha: string, descripcion: string, monto: number }} fine
 * @returns {Promise<{ record: object, notified: boolean }>}
 */
export async function notifyNewFine({ pbUrl, token, twilioClient, twilioFrom }, vehicle, fine) {
	const record = await pbPost(pbUrl, token, 'collections/fines/records', {
		vehicle: vehicle.id,
		folio: fine.folio,
		fecha: fine.fecha,
		descripcion: fine.descripcion,
		monto: fine.monto,
		notified: false
	});
	console.log(`  + New fine: ${fine.folio} — $${fine.monto}`);

	const phone = vehicle.expand?.user?.phone;
	if (!twilioClient || !phone || !twilioFrom) {
		return { record, notified: false };
	}

	try {
		await twilioClient.messages.create({
			from: twilioFrom,
			to: `whatsapp:${phone}`,
			contentSid: CONTENT_SID,
			contentVariables: JSON.stringify({
				'1': `vehículo con placas ${vehicle.plate}`,
				'2': `MULTA - ${fine.descripcion} - $${fine.monto} MXN`,
				'3': 'AYUNTAMIENTO DE TIJUANA',
				'4': fine.fecha
			})
		});
		console.log(`  ✓ WhatsApp sent to ${phone}`);

		await pbPatch(pbUrl, token, `collections/fines/records/${record.id}`, { notified: true });
		return { record, notified: true };
	} catch (err) {
		console.error(`  Error sending WhatsApp for ${fine.folio}:`, err.message);
		return { record, notified: false };
	}
}
