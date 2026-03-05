<script lang="ts">
	import {
		EyeOff,
		TrendingUp,
		AlertTriangle,
		ClipboardList,
		ScanSearch,
		Bell,
		Users,
		KeyRound,
		MapPin,
		ShieldCheck,
		Check,
		Shield
	} from '@lucide/svelte';
</script>

<div class="bg-white">

	<!-- Nav -->
	<header class="sticky top-0 z-50 bg-white border-b border-gray-100">
		<div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
			<span class="text-base font-bold text-gray-900 whitespace-nowrap">AlertasMultas</span>
			<div class="flex items-center gap-2">
				<a href="/login" class="text-sm text-gray-600 hover:text-gray-900 px-2 py-2 whitespace-nowrap">Iniciar sesión</a>
				<a href="/register" class="text-sm bg-black text-white px-3 py-2 rounded-lg font-medium whitespace-nowrap">Registrarse</a>
			</div>
		</div>
	</header>

	<!-- Hero -->
	<section class="max-w-5xl mx-auto px-5 pt-14 pb-12 md:pt-20 md:pb-16">
		<div class="max-w-2xl mx-auto text-center">
			<h1 class="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
				Recibe una alerta por WhatsApp en cuanto aparezca una multa en tus placas de Tijuana
			</h1>
			<p class="mt-5 text-lg text-gray-600 leading-relaxed">
				Las multas en Tijuana llegan sin aviso y sin papel. Si no las pagas a tiempo <strong class="text-gray-900">se duplican</strong> — y si te paran con una pendiente, tu carro va directo al <strong class="text-gray-900">corralón</strong>.
			</p>
			<div class="mt-8 flex flex-col sm:flex-row justify-center gap-3">
				<a href="/register" class="flex items-center justify-center gap-2 bg-black text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-800 transition-colors">
					Crear cuenta
				</a>
				<a href="#precios" class="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-7 py-3.5 rounded-xl text-base font-medium hover:border-gray-400 transition-colors">
					Ver precios →
				</a>
			</div>
			<p class="mt-4 text-sm text-gray-400">$29 MXN por placa al mes · Cancela cuando quieras</p>
		</div>
		<div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
			<div class="flex flex-col items-center gap-2 w-4/5 sm:w-[55%]">
				<span class="text-sm font-semibold uppercase tracking-widest text-red-500">Multa encontrada</span>
				<img
					src="/images/infraccion.png"
					alt="Infracción de tránsito en Tijuana"
					class="w-full rounded-xl shadow-lg"
					loading="eager"
				/>
			</div>
			<div class="shrink-0 rotate-90 sm:rotate-0" aria-hidden="true">
				<svg width="56" height="32" viewBox="0 0 56 32" fill="none">
					<path
						class="arrow-path"
						d="M2,16 C6,5 12,27 18,16 C24,5 30,27 36,16 L47,16 M41,10 L47,16 L41,22"
						stroke="#111827"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
			<div class="flex flex-col items-center gap-2 w-4/5 sm:w-[35%]">
				<span class="text-sm font-semibold uppercase tracking-widest text-green-600">Alerta enviada</span>
				<img
					src="/images/whatsapp-alert.jpeg"
					alt="Alerta de multa por WhatsApp"
					class="w-full rounded-xl shadow-lg"
					loading="eager"
				/>
			</div>
		</div>
	</section>

	<!-- Pain -->
	<section class="bg-gray-50 py-16 px-5">
		<div class="max-w-5xl mx-auto">
			<h2 class="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-900">¿Sabías que tu carro podría tener una multa ahorita mismo?</h2>
			<p class="text-center text-gray-500 mb-12 text-base md:text-lg">Y mientras no lo sabes, el reloj corre.</p>
			<div class="grid md:grid-cols-3 gap-5">
				<div class="bg-white rounded-2xl p-6 border border-gray-200">
					<div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
						<EyeOff class="w-5 h-5 text-orange-500" />
					</div>
					<h3 class="text-base font-bold mb-2 text-gray-900">Las multas de estacionamiento son invisibles</h3>
					<p class="text-gray-500 text-sm leading-relaxed">No siempre te dejan papel. La infracción va directo al sistema y tú no te enteras. La primera vez que lo sabes puede ser cuando ya se duplicó.</p>
				</div>
				<div class="bg-white rounded-2xl p-6 border border-gray-200">
					<div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
						<TrendingUp class="w-5 h-5 text-red-500" />
					</div>
					<h3 class="text-base font-bold mb-2 text-gray-900">Si no pagas a tiempo, el monto se duplica</h3>
					<p class="text-gray-500 text-sm leading-relaxed">Las multas no pagadas acumulan recargos rápidamente. Lo que hoy son $500 pesos, pasado el plazo puede costar el doble.</p>
				</div>
				<div class="bg-white rounded-2xl p-6 border border-gray-200">
					<div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
						<AlertTriangle class="w-5 h-5 text-red-600" />
					</div>
					<h3 class="text-base font-bold mb-2 text-gray-900">Con multa pendiente, te mandan al corralón</h3>
					<p class="text-gray-500 text-sm leading-relaxed">Si te detienen en un retén con una infracción pendiente, se llevan tu vehículo. Sacarlo del corralón puede costarte mucho más que la multa original.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section class="py-16 px-5">
		<div class="max-w-5xl mx-auto">
			<h2 class="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-900">Cómo funciona</h2>
			<p class="text-center text-gray-500 mb-12 text-base md:text-lg">Simple, automático, sin complicaciones.</p>
			<div class="grid md:grid-cols-3 gap-8 md:gap-12">
				<div class="flex flex-col items-center text-center">
					<div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 shrink-0">
						<ClipboardList class="w-6 h-6 text-blue-600" />
					</div>
					<h3 class="font-bold text-lg mb-2 text-gray-900">Registra tus placas</h3>
					<p class="text-gray-500 text-sm leading-relaxed">Crea tu cuenta y agrega las placas que quieres monitorear. Tarda menos de un minuto.</p>
				</div>
				<div class="flex flex-col items-center text-center">
					<div class="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-5 shrink-0">
						<ScanSearch class="w-6 h-6 text-violet-600" />
					</div>
					<h3 class="font-bold text-lg mb-2 text-gray-900">Monitoreamos por ti</h3>
					<p class="text-gray-500 text-sm leading-relaxed">Revisamos el portal oficial de multas de Tijuana automáticamente todos los días sin que tengas que hacer nada.</p>
				</div>
				<div class="flex flex-col items-center text-center">
					<div class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-5 shrink-0">
						<Bell class="w-6 h-6 text-green-600" />
					</div>
					<h3 class="font-bold text-lg mb-2 text-gray-900">Te avisamos por WhatsApp</h3>
					<p class="text-gray-500 text-sm leading-relaxed">En cuanto aparezca una multa, recibes un mensaje al instante con la fecha, descripción y monto.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Who it's for -->
	<section class="bg-gray-50 py-16 px-5">
		<div class="max-w-5xl mx-auto">
			<h2 class="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-900">¿Para quién es?</h2>
			<p class="text-center text-gray-500 mb-12 text-base md:text-lg">Si tienes placas en Tijuana, esto es para ti.</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				<div class="bg-white rounded-2xl p-6 border border-gray-200">
					<div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
						<KeyRound class="w-5 h-5 text-amber-600" />
					</div>
					<h3 class="font-bold text-lg mb-2 text-gray-900">Arrendadores de vehículos</h3>
					<p class="text-gray-500 text-sm leading-relaxed">Rentas tu carro y quien lo usa no te avisa de nada. Monitorea tus placas y entérate de cualquier infracción antes de que sea un problema.</p>
				</div>
				<div class="bg-white rounded-2xl p-6 border border-gray-200">
					<div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
						<Users class="w-5 h-5 text-blue-600" />
					</div>
					<h3 class="font-bold text-lg mb-2 text-gray-900">Padres con hijos conductores</h3>
					<p class="text-gray-500 text-sm leading-relaxed">Tienes varios autos a tu nombre y tus hijos los manejan. Con AlertasMultas sabes al instante si alguien acumula una multa, antes de que se duplique.</p>
				</div>
				<div class="bg-white rounded-2xl p-6 border border-gray-200">
					<div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
						<ShieldCheck class="w-5 h-5 text-indigo-600" />
					</div>
					<h3 class="font-bold text-lg mb-2 text-gray-900">Aseguradora de vehículos</h3>
					<p class="text-gray-500 text-sm leading-relaxed">Tienes una flota asegurada y necesitas saber si hay infracciones pendientes antes de renovar o liquidar un siniestro. Monitorea todas tus placas desde un solo lugar.</p>
				</div>
				<div class="bg-white rounded-2xl p-6 border border-gray-200">
					<div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
						<MapPin class="w-5 h-5 text-emerald-600" />
					</div>
					<h3 class="font-bold text-lg mb-2 text-gray-900">Cualquier tijuanense</h3>
					<p class="text-gray-500 text-sm leading-relaxed">En Tijuana las multas sorpresa son una realidad. No esperes a que te paren o a que tu carro ya esté en el corralón para enterarte.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Pricing -->
	<section id="precios" class="py-16 px-5">
		<div class="max-w-5xl mx-auto">
			<h2 class="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-900">Un solo precio, sin sorpresas</h2>
			<p class="text-center text-gray-500 mb-12 text-base md:text-lg">Sin planes, sin contratos, sin letra chica.</p>
			<div class="max-w-sm mx-auto border-2 border-black rounded-2xl p-8">
				<div class="mb-6">
					<span class="text-5xl font-bold text-gray-900">$29</span>
					<span class="text-gray-500 text-lg"> MXN / placa al mes</span>
				</div>
				<p class="text-gray-500 text-sm mb-6">¿Tienes 3 placas? Son $87 al mes. Simple.</p>
				<ul class="space-y-3 mb-8">
					{#each [
						'Monitoreo diario del portal oficial',
						'Alertas instantáneas por WhatsApp',
						'Historial completo de multas',
						'Panel de control en línea',
						'Cancela cuando quieras'
					] as feature}
						<li class="flex items-center gap-3 text-sm text-gray-700">
							<Check class="w-4 h-4 text-green-600 shrink-0" />
							{feature}
						</li>
					{/each}
				</ul>
				<a href="/register" class="block w-full text-center px-6 py-3.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
					Crear cuenta
				</a>
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="px-5 pb-16">
		<div class="bg-black rounded-2xl py-14 px-8 md:px-16 max-w-4xl mx-auto text-center">
			<div class="flex justify-center mb-5">
				<Shield class="w-10 h-10 text-white opacity-80" />
			</div>
			<h2 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
				Duerme tranquilo.
			</h2>
			<p class="text-gray-400 text-lg md:text-xl mb-8 max-w-xl mx-auto leading-relaxed">
				Nosotros vigilamos tus placas. Por $29 pesos al mes — menos de lo que cuesta una hora en el corralón.
			</p>
			<a href="/register" class="inline-block bg-white text-black px-10 py-4 rounded-xl text-base font-bold hover:bg-gray-100 transition-colors">
				Crear cuenta
			</a>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-gray-100 py-8 px-5">
		<p class="text-center text-sm text-gray-400">
			© 2026 AlertasMultas · Tijuana, B.C.
		</p>
	</footer>

</div>

<style>
	.arrow-path {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		animation: draw-arrow 2.2s ease-in-out infinite;
	}

	@keyframes draw-arrow {
		0%   { stroke-dashoffset: 100; opacity: 1; }
		60%  { stroke-dashoffset: 0;   opacity: 1; }
		82%  { stroke-dashoffset: 0;   opacity: 1; }
		94%  { stroke-dashoffset: 0;   opacity: 0; }
		95%  { stroke-dashoffset: 100; opacity: 0; }
		100% { stroke-dashoffset: 100; opacity: 1; }
	}
</style>
