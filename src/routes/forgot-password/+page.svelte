<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';

	let { form } = $props();
	let loading = $state(false);
</script>

<div class="min-h-screen bg-white flex items-center justify-center px-5">
	<div class="w-full max-w-md">
		<div class="mb-8 flex justify-center">
			<a href="/" class="text-lg">
				<span class="font-bold text-slate-800">Alertas</span><span class="text-slate-500">Multas</span>
			</a>
		</div>

		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h1>
			<p class="text-slate-600">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>
		</div>

		{#if form?.success}
			<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
				<div class="flex items-start gap-3">
					<svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div>
						<h3 class="text-sm font-medium text-green-800">Revisa tu correo</h3>
						<p class="text-xs text-green-700 mt-1">
							Si existe una cuenta con <strong>{form.email}</strong>, recibirás el enlace en breve.
						</p>
					</div>
				</div>
			</div>
		{/if}

		{#if !form?.success}
			<form method="POST" use:enhance={() => {
				loading = true;
				return async ({ update }) => { await update(); loading = false; };
			}} class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Correo electrónico</Label>
					<Input id="email" name="email" type="email" placeholder="tu@correo.com" required disabled={loading} />
				</div>

				<Button type="submit" size="lg" class="w-full mt-2" disabled={loading}>
					{loading ? 'Enviando...' : 'Enviar enlace'}
				</Button>
			</form>
		{/if}

		<div class="mt-8 text-center">
			<a href="/login" class="text-sm text-slate-600 hover:text-gray-900">← Volver al inicio de sesión</a>
		</div>
	</div>
</div>
