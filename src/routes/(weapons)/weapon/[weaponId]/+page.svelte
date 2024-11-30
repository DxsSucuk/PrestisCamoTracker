<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		getCategory,
		globalMultiplayerCamos,
		globalWarzoneCamos,
		globalZombiesCamos,
		weaponsList
	} from '$lib/handler';
	import type { Camo, Weapon } from '$lib/structures';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { fly, scale, slide } from 'svelte/transition';

	var currentWeapon: Weapon | undefined;
	var globalZMCamos: Camo[];
	var globalMPCamos: Camo[];
	var globalWZCamos: Camo[];

	var militaryCamos: Camo[];
	var masteryCamos: Camo[];

	var specialFilter: string;

	onMount(() => {
		let weaponId = $page.params.weaponId;
		let typId = $page.url.searchParams.has('typ') ? $page.url.searchParams.get('typ')! : '0';

		currentWeapon = get(weaponsList).find((c) => c.id == weaponId);
		globalZombiesCamos.subscribe((c) => (globalZMCamos = c));
		globalMultiplayerCamos.subscribe((c) => (globalMPCamos = c));
		globalWarzoneCamos.subscribe((c) => (globalWZCamos = c));

		updateCamos(typId);
	});

	function updateCamos(typ: string) {
		var toUseCamoList: Camo[];

		if (typ == '0') {
			toUseCamoList = get(globalMultiplayerCamos);
			specialFilter = 'special_mp';
		} else if (typ == '1') {
			toUseCamoList = get(globalZombiesCamos);
			specialFilter = 'special_zm';
		} else {
			toUseCamoList = get(globalWarzoneCamos);

			specialFilter = 'special_wz';
		}

		militaryCamos = toUseCamoList.filter((c) => c.category == 'military');
		masteryCamos = toUseCamoList.filter((c) => c.category == 'mastery');
	}

	function goBack() {
		goto('/?category=' + currentWeapon?.category);
	}
</script>

<div class="p-6 text-white">
	<!-- Container -->
	<div class="max-w-6xl mx-auto space-y-8">
		<div
			role="button"
			on:click={goBack}
			class="bg-gray-800 rounded-xl shadow-lg p-4 flex items-center cursor-pointer hover:bg-gray-700 transition"
		>
			<!-- Icon or Text -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 text-white"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			<span class="ml-3 text-white text-lg font-medium">Back</span>
		</div>

		{#if currentWeapon !== undefined}
			<!-- Two Cards Section -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-900 rounded-xl shadow-lg p-4">
				<!-- Card 1 -->
				<div
					class="relative bg-gray-800 rounded-xl shadow-lg p-6 h-56"
					style="background-image: url({currentWeapon.image}); background-size: cover; background-position: center;"
				></div>
				<!-- Card 2 -->
				<div class="relative bg-gray-800 rounded-xl shadow-lg p-6 h-56">
					<h3 class="text-xl font-semibold">{currentWeapon.name}</h3>
					<p class="text-base text-gray-400">{getCategory(currentWeapon.category)?.display}</p>
					<div
						class="absolute bottom-4 right-4 flex space-x-2 bg-gray-700 rounded-xl shadow-lg p-4 flex"
					>
						<span
							class="{specialFilter == 'special_mp'
								? 'bg-blue-500'
								: 'bg-gray-800'} text-white text-sm font-bold px-3 py-1 rounded"
							role="button"
							on:click={() => updateCamos('0')}>MP</span
						>
						<span
							class="{specialFilter == 'special_zm'
								? 'bg-green-500'
								: 'bg-gray-800'} text-white text-sm font-bold px-3 py-1 rounded"
							role="button"
							on:click={() => updateCamos('1')}>ZM</span
						>
						<span
							class="{specialFilter == 'special_wz'
								? 'bg-red-500'
								: 'bg-gray-800'} text-white text-sm font-bold px-3 py-1 rounded"
							role="button"
							aria-disabled="true">WA</span
						>
					</div>
				</div>
			</div>

			{#if currentWeapon.notice !== undefined}
				<div class="space-y-4 bg-gray-900 rounded-xl shadow-lg p-4">
					<h2 class="text-2xl text-red-500 font-semibold">Notices</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{#if currentWeapon.notice.multiplayer !== undefined}
							<div
								class="bg-gray-800 rounded-xl ring-2 ring-blue-500 shadow-lg p-6 flex items-center"
							>
								<!-- Text Content -->
								<div class="flex-1">
									<h4 class="text-lg font-semibold">Multiplayer</h4>
									<p class="text-base text-gray-400 mt-2">
										{currentWeapon.notice.multiplayer}
									</p>
								</div>
							</div>
						{/if}
						{#if currentWeapon.notice.zombies !== undefined}
							<div
								class="bg-gray-800 rounded-xl ring-2 ring-green-500 shadow-lg p-6 flex items-center"
							>
								<!-- Text Content -->
								<div class="flex-1">
									<h4 class="text-lg font-semibold">Zombies</h4>
									<p class="text-base text-gray-400 mt-2">
										{currentWeapon.notice.zombies}
									</p>
								</div>
							</div>
						{/if}
						{#if currentWeapon.notice.warzone !== undefined}
							<div
								class="bg-gray-800 rounded-xl ring-2 ring-red-500 shadow-lg p-6 flex items-center"
							>
								<!-- Text Content -->
								<div class="flex-1">
									<h4 class="text-lg font-semibold">Warzone</h4>
									<p class="text-base text-gray-400 mt-2">
										{currentWeapon.notice.warzone}
									</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			{#key specialFilter}
				<div class="space-y-4" in:fly={{ x: -500, duration: 500, delay: 250 }} out:fly={{ x: 500, duration: 200 }}>
					<!-- Grid 1 Section -->
					<div class="space-y-4 bg-gray-900 rounded-xl shadow-lg p-4">
						<h2 class="text-2xl font-semibold">Military</h2>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{#each militaryCamos as camoEntry}
								<div class="bg-gray-800 rounded-xl shadow-lg p-6 flex items-center">
									<!-- Text Content -->
									<div class="flex-1">
										<h4 class="text-lg font-semibold">{camoEntry.display}</h4>
										<p class="text-base text-gray-400 mt-2">
											{camoEntry.description.replaceAll('%weapon%', currentWeapon.name)}
										</p>
									</div>
									<!-- Image Area -->
									<div class="ml-4 w-24 h-24 bg-gray-700 rounded-xl flex-shrink-0">
										<img
											src={camoEntry.image}
											alt="{camoEntry.id} pattern"
											class="w-full h-full object-cover rounded-xl"
										/>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Grid 2 Section -->
					<div class="space-y-4 bg-gray-900 rounded-xl shadow-lg p-4">
						<h2 class="text-2xl font-semibold">Special</h2>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{#each currentWeapon?.camos.filter((c) => c.category == specialFilter) as camoEntry}
								<div class="bg-gray-800 rounded-xl shadow-lg p-6 flex items-center">
									<!-- Text Content -->
									<div class="flex-1">
										<h4 class="text-lg font-semibold">{camoEntry.display}</h4>
										<p class="text-base text-gray-400 mt-2">
											{camoEntry.description.replaceAll('%weapon%', currentWeapon.name)}
										</p>
									</div>
									<!-- Image Area -->
									<div class="ml-4 w-24 h-24 bg-gray-700 rounded-xl flex-shrink-0">
										<img
											src={camoEntry.image}
											alt="{camoEntry.id} pattern"
											class="w-full h-full object-cover rounded-xl"
										/>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Grid 3 Section -->
					<div class="space-y-4 bg-gray-900 rounded-xl shadow-lg p-4">
						<h2 class="text-2xl font-semibold">Mastery</h2>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{#each masteryCamos as camoEntry}
								<div class="bg-gray-800 rounded-xl shadow-lg p-6 flex items-center">
									<!-- Text Content -->
									<div class="flex-1">
										<h4 class="text-lg font-semibold">{camoEntry.display}</h4>
										<p class="text-base text-gray-400 mt-2">
											{camoEntry.description.replaceAll('%weapon%', currentWeapon.name)}
										</p>
									</div>
									<!-- Image Area -->
									<div class="ml-4 w-24 h-24 bg-gray-700 rounded-xl flex-shrink-0">
										<img
											src={camoEntry.image}
											alt="{camoEntry.id} pattern"
											class="w-full h-full object-cover rounded-xl"
										/>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/key}
		{:else}
			<p>Weapon Id invalid.</p>
		{/if}
	</div>
</div>
