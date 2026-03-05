<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/bricolage-grotesque';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>AlertasMultas — Multas en Tijuana por WhatsApp</title>
	<meta name="description" content="Recibe alertas por WhatsApp cuando aparezca una multa en tus placas de Tijuana. Monitoreo diario del portal oficial. $29 MXN por placa al mes." />
	<meta property="og:site_name" content="AlertasMultas" />
	<meta property="og:locale" content="es_MX" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{@render children()}
