<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';

	let { data } = $props();

	const tier = $derived(data.user.subscription_tier ?? 'free');
	const tierVariant: Record<string, 'secondary' | 'default' | 'outline'> = {
		free: 'secondary',
		pro: 'default',
		business: 'outline'
	};

	let vehicles = $state(data.vehicles ?? []);
	let fines = $state(data.fines ?? []);
	let newPlate = $state('');
	let addError = $state('');
	let adding = $state(false);

	async function addVehicle() {
		addError = '';
		const plate = newPlate.trim().toUpperCase();
		if (!plate) return;
		adding = true;
		try {
			const res = await fetch('/api/vehicles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ plate })
			});
			const json = await res.json();
			if (!res.ok) {
				addError = json.error ?? 'Failed to add vehicle';
				return;
			}
			vehicles = [...vehicles, json];
			newPlate = '';
		} catch {
			addError = 'Network error';
		} finally {
			adding = false;
		}
	}

	async function deleteVehicle(id: string) {
		const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
		if (res.ok) {
			vehicles = vehicles.filter((v) => v.id !== id);
			fines = fines.filter((f) => f.vehicle !== id);
		}
	}
</script>

<div class="min-h-screen bg-[#fafafa]">
	<!-- Navigation -->
	<nav class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex items-center">
					<svg class="w-8 h-8 text-gray-900" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M8 20C8 14 12 10 18 10C24 10 28 14 28 20C28 26 24 30 18 30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
						<path d="M32 20C32 26 28 30 22 30C16 30 12 26 12 20C12 14 16 10 22 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
					</svg>
					<span class="ml-3 text-xl font-semibold text-gray-900">Dashboard</span>
				</div>
				<div class="flex items-center gap-4">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<div class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
								<div class="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-medium">
									{data.user.email.charAt(0).toUpperCase()}
								</div>
								<span class="text-sm text-gray-700 hidden md:block">{data.user.email}</span>
							</div>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="w-52">
							<DropdownMenu.Item>
								<a href="/profile" class="w-full">Profile</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<a href="/settings" class="w-full">Settings</a>
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<a href="/logout" class="w-full">Sign out</a>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-semibold text-gray-900">Welcome back</h1>
			<p class="mt-2 text-sm text-gray-600">Manage your vehicles and monitor traffic fines</p>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<!-- Subscription Tier -->
			<Card.Root>
				<Card.Content class="pt-6">
					<div class="flex items-center justify-between mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
						</svg>
						<Badge variant={tierVariant[tier] ?? 'secondary'} class="capitalize">{tier}</Badge>
					</div>
					<h3 class="text-sm font-medium text-gray-600">Subscription Plan</h3>
					<p class="mt-2 text-2xl font-semibold text-gray-900 capitalize">{tier}</p>
					{#if tier === 'free'}
						<a href="/checkout?tier=pro" class="mt-2 text-xs text-blue-600 hover:underline inline-block">Upgrade to Pro →</a>
					{:else}
						<p class="mt-1 text-xs text-gray-500">Thank you for subscribing!</p>
					{/if}
				</Card.Content>
			</Card.Root>

			<!-- Vehicles count -->
			<Card.Root>
				<Card.Content class="pt-6">
					<div class="flex items-center justify-between mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m0 0h8m-9 0H3m11 0h1l4-4V9a1 1 0 00-1-1h-4l-3 3v5h3z" />
						</svg>
						<Badge variant="secondary">{vehicles.length}</Badge>
					</div>
					<h3 class="text-sm font-medium text-gray-600">Monitored Vehicles</h3>
					<p class="mt-2 text-2xl font-semibold text-gray-900">{vehicles.length}</p>
					<p class="mt-1 text-xs text-gray-500">Registered plates</p>
				</Card.Content>
			</Card.Root>

			<!-- Fines count -->
			<Card.Root>
				<Card.Content class="pt-6">
					<div class="flex items-center justify-between mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
						<Badge variant={fines.length > 0 ? 'default' : 'secondary'}>{fines.length}</Badge>
					</div>
					<h3 class="text-sm font-medium text-gray-600">Total Fines</h3>
					<p class="mt-2 text-2xl font-semibold text-gray-900">{fines.length}</p>
					<p class="mt-1 text-xs text-gray-500">Detected across all plates</p>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Vehicles + Account -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Vehicle Management -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Vehicles</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex gap-2 mb-4">
						<Input
							placeholder="License plate (e.g. ABC-1234)"
							bind:value={newPlate}
							onkeydown={(e) => e.key === 'Enter' && addVehicle()}
						/>
						<Button onclick={addVehicle} disabled={adding}>
							{adding ? 'Adding…' : 'Add'}
						</Button>
					</div>
					{#if addError}
						<p class="text-xs text-red-600 mb-3">{addError}</p>
					{/if}
					{#if vehicles.length === 0}
						<p class="text-sm text-gray-500 text-center py-4">No vehicles registered yet.</p>
					{:else}
						<ul class="space-y-2">
							{#each vehicles as vehicle (vehicle.id)}
								<li class="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md">
									<span class="text-sm font-medium text-gray-900">{vehicle.plate}</span>
									<button
										class="text-xs text-red-500 hover:text-red-700"
										onclick={() => deleteVehicle(vehicle.id)}
									>
										Remove
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</Card.Content>
			</Card.Root>

			<!-- Account Information -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Account Information</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						<div>
							<span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</span>
							<p class="mt-1 text-sm text-gray-900">{data.user.email}</p>
						</div>
						<div>
							<span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Account ID</span>
							<p class="mt-1 text-sm text-gray-900">#{data.user.id}</p>
						</div>
					</div>
				</Card.Content>
				<Card.Footer class="gap-3">
					<Button variant="outline" class="flex-1" href="/settings">Settings</Button>
					<Button class="flex-1" href="/profile">Edit Profile</Button>
				</Card.Footer>
			</Card.Root>
		</div>

		<!-- Fines Table -->
		<div class="mt-8">
			<Card.Root>
				<Card.Header>
					<Card.Title>Detected Fines</Card.Title>
				</Card.Header>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50 border-t border-gray-200">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notified</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#if fines.length === 0}
								<tr>
									<td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">
										No fines detected yet. Add a vehicle and run the scraper.
									</td>
								</tr>
							{:else}
								{#each fines as fine (fine.id)}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{fine.expand?.vehicle?.plate ?? '—'}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{fine.fecha}</td>
										<td class="px-6 py-4 text-sm text-gray-600">{fine.descripcion}</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${fine.monto.toLocaleString()} MXN</td>
										<td class="px-6 py-4 whitespace-nowrap">
											{#if fine.notified}
												<Badge variant="default">Sent</Badge>
											{:else}
												<Badge variant="secondary">Pending</Badge>
											{/if}
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</Card.Root>
		</div>
	</main>
</div>
