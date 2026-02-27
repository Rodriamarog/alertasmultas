<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';

	let { data, form } = $props();
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
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Iniciar sesión</h1>
			<p class="text-slate-600">
				¿No tienes cuenta?
				<a href="/register" class="text-gray-900 hover:underline font-medium">Regístrate</a>
			</p>
		</div>

		{#if data.resetSuccess}
			<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
				<div class="flex items-start gap-3">
					<svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div>
						<h3 class="text-sm font-medium text-green-800">¡Contraseña restablecida!</h3>
						<p class="text-xs text-green-700 mt-1">Ya puedes iniciar sesión con tu nueva contraseña.</p>
					</div>
				</div>
			</div>
		{/if}

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
			<div class="space-y-2">
				<Label for="email">Correo electrónico</Label>
				<Input id="email" name="email" type="email" placeholder="tu@correo.com" required disabled={loading} />
			</div>

			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<Label for="password">Contraseña</Label>
					<a href="/forgot-password" class="text-sm text-slate-600 hover:text-gray-900">¿Olvidaste tu contraseña?</a>
				</div>
				<Input id="password" name="password" type="password" placeholder="••••••••" required disabled={loading} />
			</div>

			<Button type="submit" size="lg" class="w-full mt-2" disabled={loading}>
				{loading ? 'Entrando...' : 'Iniciar sesión'}
			</Button>
		</form>

		<div class="mt-8 text-center">
			<a href="/" class="text-sm text-slate-600 hover:text-gray-900">← Volver al inicio</a>
		</div>
	</div>
</div>
