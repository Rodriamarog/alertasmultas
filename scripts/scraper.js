#!/usr/bin/env node
// scripts/scraper.js — scrape Tijuana traffic fines and notify via WhatsApp
// Usage: npm run scraper
// Cron:  0 8 * * * node /path/to/scripts/scraper.js

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { chromium } from 'playwright';
import twilio from 'twilio';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Parse .env
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
const ADMIN_EMAIL = env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = env.POCKETBASE_ADMIN_PASSWORD;
const TIJUANA_USER = env.TIJUANA_USER;
const TIJUANA_PASS = env.TIJUANA_PASS;
const TWILIO_ACCOUNT_SID = env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = env.TWILIO_WHATSAPP_FROM;

async function getAdminToken() {
	const res = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(`PocketBase admin auth failed: ${JSON.stringify(err)}`);
	}
	const { token } = await res.json();
	return token;
}

async function pbGet(token, path) {
	const res = await fetch(`${PB_URL}/api/${path}`, {
		headers: { Authorization: token }
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(`PocketBase GET ${path} failed: ${JSON.stringify(err)}`);
	}
	return res.json();
}

async function pbPost(token, path, body) {
	const res = await fetch(`${PB_URL}/api/${path}`, {
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

async function pbPatch(token, path, body) {
	const res = await fetch(`${PB_URL}/api/${path}`, {
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
 * Scrape fines for a given plate from the Tijuana portal.
 * Returns array of { fecha, descripcion, monto, folio }.
 */
async function scrapeVehicleFines(browser, tijuanaUser, tijuanaPass, plate) {
	const context = await browser.newContext();
	const page = await context.newPage();

	try {
		await page.goto('https://pagos.tijuana.gob.mx/PagosEnLinea/index.aspx', {
			waitUntil: 'networkidle',
			timeout: 30000
		});

		// Login
		await page.fill('#ContentPlaceHolder1_txtUsuario', tijuanaUser);
		await page.fill('#ContentPlaceHolder1_txtContrasenia', tijuanaPass);
		await page.click('#ContentPlaceHolder1_btnLogin');
		await page.waitForLoadState('networkidle');

		// Navigate to traffic fines section
		await page.click('#ContentPlaceHolder1_multastransito');
		await page.waitForSelector('#MainContent_gvPlacasRegistradas', { timeout: 15000 });

		// Find the row containing our plate and click the link
		const plateRow = page.locator('#MainContent_gvPlacasRegistradas tr').filter({ hasText: plate });
		const plateLink = plateRow.locator('a[id*="lbPlacas"]');
		await plateLink.click();
		await page.waitForSelector('#MainContent_gvInformacion', { timeout: 15000 });

		// Extract all rows from the fines table
		const rows = await page.$$('#MainContent_gvInformacion tr');
		const fines = [];

		for (const row of rows) {
			const cells = await row.$$('td');
			if (cells.length < 6) continue;

			const fecha = (await cells[3].textContent())?.trim() ?? '';
			const descripcion = (await cells[4].textContent())?.trim() ?? '';
			const montoRaw = (await cells[5].textContent())?.trim() ?? '';

			if (!fecha || !descripcion) continue;

			const monto = parseFloat(montoRaw.replace(/[$,]/g, '')) || 0;
			if (monto === 0) continue;

			const folio = `${fecha.replace(/ /g, '_')}_${descripcion.split(' ')[0]}`;

			fines.push({ fecha, descripcion, monto, folio });
		}

		return fines;
	} finally {
		await context.close();
	}
}

async function main() {
	console.log(`[${new Date().toISOString()}] Scraper starting`);

	if (!TIJUANA_USER || !TIJUANA_PASS) {
		console.error('TIJUANA_USER and TIJUANA_PASS must be set in .env');
		process.exit(1);
	}

	const token = await getAdminToken();
	console.log('✓ PocketBase admin authenticated');

	// Fetch all vehicles, expanding user record for phone
	const vehiclesData = await pbGet(
		token,
		'collections/vehicles/records?expand=user&perPage=500'
	);
	const vehicles = vehiclesData.items ?? [];
	console.log(`Found ${vehicles.length} vehicle(s) to check`);

	if (vehicles.length === 0) {
		console.log('No vehicles registered. Exiting.');
		return;
	}

	const browser = await chromium.launch({ headless: true });

	const twilioClient =
		TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
			? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
			: null;

	let totalNew = 0;

	for (const vehicle of vehicles) {
		const plate = vehicle.plate;
		const user = vehicle.expand?.user;
		console.log(`\nChecking plate: ${plate}`);

		let fines;
		try {
			fines = await scrapeVehicleFines(browser, TIJUANA_USER, TIJUANA_PASS, plate);
			console.log(`  Found ${fines.length} fine(s) on portal`);
		} catch (err) {
			console.error(`  Error scraping plate ${plate}:`, err.message);
			continue;
		}

		// Fetch existing folios for this vehicle
		const existingData = await pbGet(
			token,
			`collections/fines/records?filter=vehicle="${vehicle.id}"&perPage=500`
		);
		const existingFolios = new Set((existingData.items ?? []).map((f) => f.folio));

		for (const fine of fines) {
			if (existingFolios.has(fine.folio)) continue;

			// Insert new fine
			const record = await pbPost(token, 'collections/fines/records', {
				vehicle: vehicle.id,
				folio: fine.folio,
				fecha: fine.fecha,
				descripcion: fine.descripcion,
				monto: fine.monto,
				notified: false
			});
			console.log(`  + New fine: ${fine.folio} — $${fine.monto}`);
			totalNew++;

			// Send WhatsApp notification
			if (twilioClient && user?.phone && TWILIO_WHATSAPP_FROM) {
				try {
					await twilioClient.messages.create({
						from: TWILIO_WHATSAPP_FROM,
						to: `whatsapp:${user.phone}`,
						body: `🚨 Nueva multa detectada\nPlaca: ${plate}\nFecha: ${fine.fecha}\nDescripción: ${fine.descripcion}\nMonto: $${fine.monto} MXN`
					});
					console.log(`  ✓ WhatsApp sent to ${user.phone}`);

					// Mark as notified
					await pbPatch(token, `collections/fines/records/${record.id}`, {
						notified: true
					});
				} catch (err) {
					console.error(`  Error sending WhatsApp for ${fine.folio}:`, err.message);
				}
			}
		}
	}

	await browser.close();
	console.log(`\n✓ Done. ${totalNew} new fine(s) detected.`);
}

main().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});
