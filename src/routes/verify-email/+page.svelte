<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';

	let success = $state(false);
	let errorMsg = $state('');
	let loading = $state(true);

	$effect(() => {
		const token = $page.url.searchParams.get('token');

		if (!token) {
			errorMsg = 'Enlace de verificación inválido';
			loading = false;
			return;
		}

		pb.collection('users').confirmVerification(token)
			.then(() => {
				success = true;
				loading = false;
				setTimeout(() => goto('/dashboard'), 3000);
			})
			.catch((err: any) => {
				errorMsg = err?.message || 'Error al verificar el correo';
				loading = false;
			});
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">
	<div class="max-w-md w-full bg-white border border-gray-200 rounded-lg p-8 text-center">
		{#if loading}
			<p class="text-gray-600">Verificando tu correo...</p>
		{:else if success}
			<div class="mb-4">
				<svg class="w-16 h-16 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<h1 class="text-2xl font-semibold text-gray-900 mb-2">Correo verificado</h1>
			<p class="text-gray-600 mb-6">Tu correo ha sido verificado correctamente.</p>
			<p class="text-sm text-gray-500">Redirigiendo al panel en 3 segundos...</p>
			<a href="/dashboard" class="mt-4 inline-block px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
				Ir al panel
			</a>
		{:else}
			<div class="mb-4">
				<svg class="w-16 h-16 text-red-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<h1 class="text-2xl font-semibold text-gray-900 mb-2">Error de verificación</h1>
			<p class="text-gray-600 mb-6">{errorMsg}</p>
			<a href="/login" class="inline-block px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
				Iniciar sesión
			</a>
		{/if}
	</div>
</div>
