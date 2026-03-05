import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	const base = 'https://alertasmultas.com';
	const pages = [
		{ url: '/', priority: '1.0', changefreq: 'weekly' },
		{ url: '/register', priority: '0.5', changefreq: 'monthly' },
		{ url: '/login', priority: '0.3', changefreq: 'monthly' }
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(p) => `  <url>
    <loc>${base}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
