#!/usr/bin/env node
// scripts/test/fake-fine.js
// Injects a fake fine for the first registered vehicle and sends a real WhatsApp notification.
// Cleans up the fake record from PocketBase after sending.
// Usage: node scripts/test/fake-fine.js

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import twilio from 'twilio';
import { notifyNewFine } from '../lib/notify.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const envText = readFileSync(join(root, '.env'), 'utf8');
const env = Object.fromEntries(
	envText
		.split('\n')
		.filter((line) => line && !line.startsWith('#') && line.includes('='))
		.map((line) => {
			const idx = line.indexOf('=');
			return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
		})
);

const PB_URL = env.PUBLIC_POCKETBASE_URL || 'http://localhost:8090';

async function getAdminToken() {
	const res = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identity: env.POCKETBASE_ADMIN_EMAIL, password: env.POCKETBASE_ADMIN_PASSWORD })
	});
	const { token } = await res.json();
	if (!token) throw new Error('PocketBase admin auth failed');
	return token;
}

async function main() {
	const noCleanup = process.argv.includes('--no-cleanup');
	console.log('--- fake-fine test ---');

	const token = await getAdminToken();
	console.log('✓ PocketBase authenticated');

	// Fetch first vehicle with user expanded
	const res = await fetch(`${PB_URL}/api/collections/vehicles/records?expand=user&perPage=1`, {
		headers: { Authorization: token }
	});
	const { items } = await res.json();
	if (!items?.length) {
		console.error('No vehicles found — register a vehicle first');
		process.exit(1);
	}

	const vehicle = items[0];
	console.log(`✓ Using vehicle: ${vehicle.plate} (user: ${vehicle.expand?.user?.email})`);

	const twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

	const fakeFine = {
		folio: noCleanup ? 'TEST-DEDUP-001' : `TEST-${Date.now()}`,
		fecha: new Date().toISOString().split('T')[0],
		descripcion: 'Exceso de velocidad (TEST)',
		monto: 500
	};

	// Simulate scraper deduplication check
	const existingRes = await fetch(
		`${PB_URL}/api/collections/fines/records?filter=vehicle="${vehicle.id}"&perPage=500`,
		{ headers: { Authorization: token } }
	);
	const { items: existingFines } = await existingRes.json();
	const existingFolios = new Set((existingFines ?? []).map((f) => f.folio));

	if (existingFolios.has(fakeFine.folio)) {
		console.log(`\n✓ Deduplication works — folio ${fakeFine.folio} already in PocketBase, no notification sent`);
		return;
	}

	console.log(`\nInjecting fake fine: ${fakeFine.folio}`);
	const { record, notified } = await notifyNewFine(
		{ pbUrl: PB_URL, token, twilioClient, twilioFrom: env.TWILIO_WHATSAPP_FROM },
		vehicle,
		fakeFine
	);

	console.log(`\nNotification sent: ${notified}`);

	if (noCleanup) {
		console.log(`✓ Record kept in PocketBase (${record.id}) — run again to test deduplication`);
	} else {
		await fetch(`${PB_URL}/api/collections/fines/records/${record.id}`, {
			method: 'DELETE',
			headers: { Authorization: token }
		});
		console.log(`✓ Fake fine record cleaned up`);
	}
	console.log('\n--- done ---');
}

main().catch((err) => {
	console.error('Fatal:', err.message);
	process.exit(1);
});
