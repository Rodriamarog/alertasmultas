<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';

	let { data } = $props();

	let vehicles = $state(data.vehicles ?? []);
	let fines = $state(data.fines ?? []);
	let activeTab = $state<'vehiculos' | 'multas'>('vehiculos');

	// Modal state
	let showModal = $state(false);
	let modalError = $state('');
	let modalBusy = $state(false);

	// Non-subscribed flow (multi-step)
	let step = $state<1 | 2>(1);
	let desiredQuantity = $state(1);
	let pendingPlates = $state<string[]>([]);
	let plateInput = $state('');

	// Subscribed flow (single-step)
	let singlePlateInput = $state('');

	const isSubscribed = $derived(data.user.subscription_status === 'active');

	function openModal() {
		showModal = true;
		modalError = '';
		step = 1;
		desiredQuantity = 1;
		pendingPlates = [];
		plateInput = '';
		singlePlateInput = '';
	}

	function closeModal() {
		showModal = false;
	}

	function validatePlate(raw: string): { plate: string; error: string | null } {
		const plate = raw.trim().toUpperCase().replace(/\s+/g, '');
		if (plate.length < 7) return { plate, error: 'La placa debe tener al menos 7 caracteres' };
		if (!/^[A-Z0-9]+$/.test(plate)) return { plate, error: 'Solo se permiten letras y números' };
		return { plate, error: null };
	}

	// Non-subscribed: add plate to pending list
	function addPendingPlate() {
		const { plate, error } = validatePlate(plateInput);
		if (!plate) return;
		if (error) { modalError = error; return; }
		if (pendingPlates.includes(plate)) {
			modalError = 'Esa placa ya está en la lista';
			return;
		}
		modalError = '';
		pendingPlates = [...pendingPlates, plate];
		plateInput = '';
	}

	function removePendingPlate(plate: string) {
		pendingPlates = pendingPlates.filter((p) => p !== plate);
	}

	// Non-subscribed: go to Stripe checkout
	async function goToCheckout() {
		if (pendingPlates.length !== desiredQuantity) {
			modalError = `Agrega exactamente ${desiredQuantity} placa(s)`;
			return;
		}
		modalBusy = true;
		modalError = '';
		try {
			const res = await fetch('/api/create-checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ quantity: desiredQuantity, plates: pendingPlates })
			});
			const json = await res.json();
			if (!res.ok) {
				modalError = json.error ?? 'No se pudo iniciar el pago';
				return;
			}
			window.location.href = json.url;
		} catch {
			modalError = 'Error de red';
		} finally {
			modalBusy = false;
		}
	}

	// Subscribed: add single plate directly
	async function addSubscribedVehicle() {
		const { plate, error } = validatePlate(singlePlateInput);
		if (!plate) return;
		if (error) { modalError = error; return; }
		modalBusy = true;
		modalError = '';
		try {
			const res = await fetch('/api/vehicles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ plate })
			});
			const json = await res.json();
			if (!res.ok) {
				modalError = json.error ?? 'No se pudo agregar el vehículo';
				return;
			}
			vehicles = [...vehicles, json];
			closeModal();
		} catch {
			modalError = 'Error de red';
		} finally {
			modalBusy = false;
		}
	}

	let confirmDeleteId = $state<string | null>(null);

	function promptDelete(id: string) {
		confirmDeleteId = id;
	}

	async function confirmDelete() {
		if (!confirmDeleteId) return;
		const id = confirmDeleteId;
		confirmDeleteId = null;
		const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
		if (res.ok) {
			vehicles = vehicles.filter((v) => v.id !== id);
			fines = fines.filter((f) => f.vehicle !== id);
		}
	}
</script>

<div class="h-dvh flex flex-col">
	<!-- Navigation -->
	<nav class="h-14 shrink-0 bg-white border-b border-gray-200">
		<div class="h-full px-4 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<svg class="w-7 h-7 text-gray-900" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M8 20C8 14 12 10 18 10C24 10 28 14 28 20C28 26 24 30 18 30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
					<path d="M32 20C32 26 28 30 22 30C16 30 12 26 12 20C12 14 16 10 22 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
				</svg>
				<span class="text-lg font-semibold text-gray-900">AlertasMultas</span>
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<div class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
						<div class="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-medium">
							{data.user.email.charAt(0).toUpperCase()}
						</div>
						<span class="text-sm text-gray-700 hidden sm:block">{data.user.email}</span>
					</div>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-52">
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<a href="/logout" class="w-full">Cerrar sesión</a>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</nav>

	<!-- Mobile tab bar (hidden on lg+) -->
	<div class="lg:hidden shrink-0 flex border-b bg-white">
		<button
			class="flex-1 py-3 text-sm font-medium border-b-2 transition-colors {activeTab === 'vehiculos'
				? 'border-gray-900 text-gray-900'
				: 'border-transparent text-gray-500'}"
			onclick={() => (activeTab = 'vehiculos')}
		>
			Vehículos {#if vehicles.length > 0}<span class="ml-1 text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5">{vehicles.length}</span>{/if}
		</button>
		<button
			class="flex-1 py-3 text-sm font-medium border-b-2 transition-colors {activeTab === 'multas'
				? 'border-gray-900 text-gray-900'
				: 'border-transparent text-gray-500'}"
			onclick={() => (activeTab = 'multas')}
		>
			Multas {#if fines.length > 0}<span class="ml-1 text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5">{fines.length}</span>{/if}
		</button>
	</div>

	<!-- Body -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Vehicles panel: full-screen on mobile (toggled), sidebar on lg -->
		<div class="{activeTab === 'vehiculos' ? 'flex' : 'hidden'} lg:flex w-full lg:w-64 lg:shrink-0 lg:border-r flex-col overflow-y-auto">
			<div class="p-4">
				<h2 class="text-sm font-semibold text-gray-900 mb-3 hidden lg:block">Vehículos</h2>
				<Button onclick={openModal} class="w-full">Agregar vehículo</Button>
			</div>
			<hr class="border-gray-200" />
			{#if vehicles.length === 0}
				<p class="text-sm text-gray-400 text-center mt-8 px-4">Sin vehículos registrados.</p>
			{:else}
				<ul class="p-2">
					{#each vehicles as vehicle (vehicle.id)}
						<li class="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 active:bg-gray-100">
							<span class="text-sm font-medium text-gray-900">{vehicle.plate}</span>
							<button
								class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 active:text-red-600 transition-colors rounded-full hover:bg-red-50"
								onclick={() => promptDelete(vehicle.id)}
								aria-label="Eliminar {vehicle.plate}"
							>✕</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Fines panel: full-screen on mobile (toggled), main area on lg -->
		<div class="{activeTab === 'multas' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col overflow-hidden">
			<div class="px-4 py-3 border-b bg-white shrink-0 hidden lg:block">
				<h2 class="text-sm font-semibold text-gray-900">Multas Detectadas</h2>
			</div>
			<div class="overflow-auto flex-1">
				<table class="w-full min-w-[480px]">
					<thead class="bg-gray-50 border-b border-gray-200 sticky top-0">
						<tr>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Notificado</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#if fines.length === 0}
							<tr>
								<td colspan="5" class="px-4 py-16 text-center text-sm text-gray-400">
									No se han detectado multas.
									<div class="mt-1 text-xs text-gray-300">
										Última actualización: {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
									</div>
								</td>
							</tr>
						{:else}
							{#each fines as fine (fine.id)}
								<tr class="hover:bg-gray-50 active:bg-gray-100">
									<td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
										{fine.expand?.vehicle?.plate ?? '—'}
									</td>
									<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{fine.fecha}</td>
									<td class="px-4 py-3 text-sm text-gray-600">{fine.descripcion}</td>
									<td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${fine.monto.toLocaleString()} MXN</td>
									<td class="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
										{#if fine.notified}
											<Badge variant="default">Enviado</Badge>
										{:else}
											<Badge variant="secondary">Pendiente</Badge>
										{/if}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<!-- Modal overlay -->
{#if showModal}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		onclick={(e) => e.target === e.currentTarget && closeModal()}
	>
		<div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
			{#if isSubscribed}
				<!-- Single-step: already subscribed -->
				<h2 class="text-base font-semibold text-gray-900 mb-4">Agregar vehículo</h2>
				<p class="text-sm text-gray-500 mb-4">$29 MXN/mes será agregado a tu factura.</p>
				<Input
					placeholder="ABC1234"
					bind:value={singlePlateInput}
					onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && addSubscribedVehicle()}
					class="mb-3 text-base"
				/>
				{#if modalError}
					<p class="text-sm text-red-600 mb-3">{modalError}</p>
				{/if}
				<div class="flex gap-2">
					<Button variant="outline" onclick={closeModal} class="flex-1">Cancelar</Button>
					<Button onclick={addSubscribedVehicle} disabled={modalBusy} class="flex-1">
						{modalBusy ? '…' : 'Agregar'}
					</Button>
				</div>
			{:else if step === 1}
				<!-- Step 1: how many plates -->
				<h2 class="text-base font-semibold text-gray-900 mb-1">Monitoreo de vehículos</h2>
				<p class="text-sm text-gray-500 mb-4">$29 MXN por placa al mes.</p>
				<label for="quantity-input" class="block text-sm font-medium text-gray-700 mb-1">
					¿Cuántas placas quieres monitorear?
				</label>
				<Input
					id="quantity-input"
					type="number"
					min="1"
					bind:value={desiredQuantity}
					class="mb-4 text-base"
				/>
				<div class="flex gap-2">
					<Button variant="outline" onclick={closeModal} class="flex-1">Cancelar</Button>
					<Button
						onclick={() => { step = 2; modalError = ''; }}
						disabled={desiredQuantity < 1}
						class="flex-1"
					>
						Siguiente
					</Button>
				</div>
			{:else}
				<!-- Step 2: add plates one by one -->
				<h2 class="text-base font-semibold text-gray-900 mb-1">Agrega tus placas</h2>
				<p class="text-sm text-gray-500 mb-4">
					{pendingPlates.length}/{desiredQuantity} placa(s) agregadas
				</p>
				{#if pendingPlates.length < desiredQuantity}
					<div class="flex gap-2 mb-3">
						<Input
							placeholder="ABC1234"
							bind:value={plateInput}
							onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && addPendingPlate()}
							class="text-base"
						/>
						<Button onclick={addPendingPlate} variant="outline" class="shrink-0">+</Button>
					</div>
				{/if}
				{#if pendingPlates.length > 0}
					<ul class="mb-3 space-y-1">
						{#each pendingPlates as plate}
							<li class="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm">
								<span class="font-medium">{plate}</span>
								<button
									class="text-gray-400 hover:text-red-500 transition-colors"
									onclick={() => removePendingPlate(plate)}
								>✕</button>
							</li>
						{/each}
					</ul>
				{/if}
				{#if modalError}
					<p class="text-sm text-red-600 mb-3">{modalError}</p>
				{/if}
				<div class="flex gap-2">
					<Button variant="outline" onclick={() => (step = 1)} class="flex-1">Atrás</Button>
					<Button
						onclick={goToCheckout}
						disabled={modalBusy || pendingPlates.length !== desiredQuantity}
						class="flex-1"
					>
						{modalBusy ? '…' : 'Ir al pago'}
					</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- Delete confirmation modal -->
{#if confirmDeleteId}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		onclick={(e) => e.target === e.currentTarget && (confirmDeleteId = null)}
	>
		<div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
			<h2 class="text-base font-semibold text-gray-900 mb-2">¿Eliminar vehículo?</h2>
			<p class="text-sm text-gray-500 mb-6">
				Tu factura mensual se reducirá $29 MXN al eliminar esta placa.
			</p>
			<div class="flex gap-2">
				<Button variant="outline" onclick={() => (confirmDeleteId = null)} class="flex-1">Cancelar</Button>
				<Button variant="destructive" onclick={confirmDelete} class="flex-1">Eliminar</Button>
			</div>
		</div>
	</div>
{/if}
