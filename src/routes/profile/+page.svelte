<script lang="ts">
	let { data } = $props();
</script>

<div class="min-h-screen bg-[#fafafa]">
	<nav class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center gap-4">
					<a href="/dashboard" class="text-sm text-gray-600 hover:text-gray-900">← Panel</a>
					<span class="text-xl font-semibold text-gray-900">Perfil</span>
				</div>
			</div>
		</div>
	</nav>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="bg-white border border-gray-200 rounded-lg p-6">
			<p class="text-sm text-gray-500">Edición de perfil próximamente.</p>
			<p class="text-sm text-gray-400 mt-1">{data.user.email}</p>
		</div>
	</main>
</div>
