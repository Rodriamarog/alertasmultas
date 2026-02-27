<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';

	let { form } = $props();
	let loading = $state(false);

	const token = $derived(page.url.searchParams.get('token') || '');
</script>

<div class="min-h-screen bg-white flex items-center justify-center px-5">
	<div class="w-full max-w-md">
		<div class="mb-8 flex justify-center">
			<a href="/" class="text-lg">
				<span class="font-bold text-slate-800">Alertas</span><span class="text-slate-500">Multas</span>
			</a>
		</div>

		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Nueva contraseña</h1>
			<p class="text-slate-600">Ingresa tu nueva contraseña a continuación.</p>
		</div>

		{#if !token}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<span class="text-sm text-red-800">Enlace inválido. Por favor solicita uno nuevo.</span>
			</div>
		{:else}
			{#if form?.error}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
					<div class="flex items-start gap-3">
						<svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span class="text-sm text-red-800">{form.error}</span>
					</div>
				</div>
			{/if}

			<form method="POST" use:enhance={() => {
				loading = true;
				return async ({ update }) => { await update(); loading = false; };
			}} class="space-y-4">
				<input type="hidden" name="token" value={token} />

				<div class="space-y-2">
					<Label for="password">Nueva contraseña</Label>
					<Input id="password" name="password" type="password" placeholder="••••••••" required disabled={loading} />
				</div>

				<div class="space-y-2">
					<Label for="passwordConfirm">Confirmar nueva contraseña</Label>
					<Input id="passwordConfirm" name="passwordConfirm" type="password" placeholder="••••••••" required disabled={loading} />
				</div>

				<Button type="submit" size="lg" class="w-full mt-2" disabled={loading}>
					{loading ? 'Guardando...' : 'Guardar contraseña'}
				</Button>
			</form>
		{/if}

		<div class="mt-8 text-center">
			<a href="/login" class="text-sm text-slate-600 hover:text-gray-900">← Volver al inicio de sesión</a>
		</div>
	</div>
</div>
