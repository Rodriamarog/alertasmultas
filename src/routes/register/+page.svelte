<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';

	let { form } = $props();
	let loading = $state(false);

	const redirectParam = $derived(page.url.searchParams.get('redirect'));
	const loginUrl = $derived(redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login');
</script>

<div class="min-h-screen bg-white flex items-center justify-center px-5">
	<div class="w-full max-w-md">
		<div class="mb-8 flex justify-center">
			<a href="/" class="text-lg">
				<span class="font-bold text-slate-800">Alertas</span><span class="text-slate-500">Multas</span>
			</a>
		</div>

		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
			<p class="text-slate-600">
				¿Ya tienes cuenta?
				<a href={loginUrl} class="text-gray-900 hover:underline font-medium">Inicia sesión</a>
			</p>
		</div>

		{#if form?.success}
			<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
				<div class="flex items-start gap-3">
					<svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div>
						<h3 class="text-sm font-medium text-green-800">¡Cuenta creada!</h3>
						<p class="text-xs text-green-700 mt-1">
							Revisa tu correo <strong>{form.email}</strong> para verificar tu cuenta.
						</p>
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

		{#if !form?.success}
			<form method="POST" use:enhance={() => {
				loading = true;
				return async ({ update }) => { await update(); loading = false; };
			}} class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Correo electrónico</Label>
					<Input id="email" name="email" type="email" placeholder="tu@correo.com" required disabled={loading} />
				</div>

				<div class="space-y-2">
					<Label for="phone">Número de WhatsApp</Label>
					<div class="flex">
						<select
							name="countryCode"
							disabled={loading}
							class="flex h-10 items-center rounded-l-md border border-r-0 border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<option value="+52">🇲🇽 +52</option>
							<option value="+1">🇺🇸 +1</option>
						</select>
						<Input
							id="phone"
							name="phone"
							type="tel"
							placeholder="664 123 4567"
							required
							disabled={loading}
							class="rounded-l-none"
							inputmode="numeric"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<Label for="password">Contraseña</Label>
					<Input id="password" name="password" type="password" placeholder="••••••••" required disabled={loading} />
				</div>

				<div class="space-y-2">
					<Label for="passwordConfirm">Confirmar contraseña</Label>
					<Input id="passwordConfirm" name="passwordConfirm" type="password" placeholder="••••••••" required disabled={loading} />
				</div>

				<Button type="submit" size="lg" class="w-full mt-2" disabled={loading}>
					{loading ? 'Creando cuenta...' : 'Crear cuenta'}
				</Button>
			</form>
		{/if}

		<div class="mt-8 text-center">
			<a href="/" class="text-sm text-slate-600 hover:text-gray-900">← Volver al inicio</a>
		</div>
	</div>
</div>
