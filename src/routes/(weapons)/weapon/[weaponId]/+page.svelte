<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		getCamoProgress,
		getCamoProgressById,
		getCategory,
		globalMultiplayerCamos,
		globalWarzoneCamos,
		globalZombiesCamos,
		progress,
		updateCamoProgress,
		weaponsList
	} from '$lib/handler';
	import type { Camo, CamoProgress, UnlockedWeaponCamo, Weapon } from '$lib/structures';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';

	var currentWeapon: Weapon | undefined;
	var globalZMCamos: Camo[];
	var globalMPCamos: Camo[];
	var globalWZCamos: Camo[];

	var militaryCamos: Camo[];
	var masteryCamos: Camo[];

	var currentProgress: UnlockedWeaponCamo;

	var militaryFilter: string;
	var specialFilter: string;
	var masteryFilter: string;

	onMount(() => {
		let weaponId = $page.params.weaponId;
		let typId = $page.url.searchParams.has('typ') ? $page.url.searchParams.get('typ')! : '0';

		currentProgress = getCamoProgressById(weaponId);
		progress.subscribe((c) => (currentProgress = getCamoProgress(c, weaponId)));

		currentWeapon = get(weaponsList).find((c) => c.id == weaponId);
		globalZombiesCamos.subscribe((c) => (globalZMCamos = c));
		globalMultiplayerCamos.subscribe((c) => (globalMPCamos = c));
		globalWarzoneCamos.subscribe((c) => (globalWZCamos = c));

		updateCamos(typId);
	});

	function pressCamoWithOverwrite(camo: Camo, setDone: boolean) {
		let index = currentProgress.camo.findIndex((c) => c.id === camo.id);
		let tempCamo: CamoProgress;
		if (index > -1) {
			tempCamo = currentProgress.camo[index];
			tempCamo.done = setDone;
			currentProgress.camo[index] = tempCamo;
		} else {
			tempCamo = {
				position: camo.position,
				category: camo.category,
				done: setDone,
				progress: 0,
				id: camo.id
			};
			currentProgress.camo.push(tempCamo);
		}

		updateCamoProgress(currentProgress);

		if (tempCamo.done) document.getElementById(camo.id)?.classList.add('ring-2', 'ring-green-500');
		else document.getElementById(camo.id)?.classList.remove('ring-2', 'ring-green-500');
	}

	function pressCamo(camo: Camo) {
		let index = currentProgress.camo.findIndex((c) => c.id === camo.id);
		let tempCamo: CamoProgress;
		if (index > -1) {
			tempCamo = currentProgress.camo[index];
			tempCamo.done = !tempCamo.done;
			currentProgress.camo[index] = tempCamo;
		} else {
			tempCamo = {
				position: camo.position,
				category: camo.category,
				done: true,
				progress: 0,
				id: camo.id
			};
			currentProgress.camo.push(tempCamo);
		}

		updateCamoProgress(currentProgress);

		if (tempCamo.done) document.getElementById(camo.id)?.classList.add('ring-2', 'ring-green-500');
		else document.getElementById(camo.id)?.classList.remove('ring-2', 'ring-green-500');
	}

	function updateCamos(typ: string) {
		var toUseCamoList: Camo[];

		if (typ == '0') {
			toUseCamoList = get(globalMultiplayerCamos);
			militaryFilter = 'military_mp';
			specialFilter = 'special_mp';
			masteryFilter = 'mastery_mp';
		} else if (typ == '1') {
			toUseCamoList = get(globalZombiesCamos);
			militaryFilter = 'military_zm';
			specialFilter = 'special_zm';
			masteryFilter = 'mastery_zm';
		} else {
			toUseCamoList = get(globalWarzoneCamos);
			militaryFilter = 'military_wz';
			specialFilter = 'special_wz';
			masteryFilter = 'mastery_wz';
		}

		militaryCamos = toUseCamoList.filter((c) => c.category == militaryFilter);
		masteryCamos = toUseCamoList.filter((c) => c.category == masteryFilter);
	}

	function isCamoDone(camo: Camo): boolean {
		let index = currentProgress.camo.findIndex((c) => c.id === camo.id);
		let tempCamo: CamoProgress;
		if (index > -1) {
			tempCamo = currentProgress.camo[index];
			return tempCamo.done;
		} else {
			tempCamo = {
				position: camo.position,
				category: camo.category,
				done: false,
				progress: 0,
				id: camo.id
			};
			return false;
		}
	}

	function goBack() {
		goto('/?category=' + currentWeapon?.category);
	}

	function doneAll(category:string) {
		if (category.includes("military")) {
			militaryCamos.forEach(c => {
				pressCamoWithOverwrite(c, true)
			})
		}

		if (category.includes("special")) {
			currentWeapon?.camos.filter(c => c.category.includes(specialFilter)).forEach(c => {
				pressCamoWithOverwrite(c, true)
			})
		}

		if (category.includes("mastery")) {
			masteryCamos.forEach(c => {
				pressCamoWithOverwrite(c, true)
			})
		}
	}

	function clearAll(category:string) {
		if (category.includes("military")) {
			militaryCamos.forEach(c => {
				pressCamoWithOverwrite(c, false)
			})
		}

		if (category.includes("special")) {
			currentWeapon?.camos.forEach(c => {
				pressCamoWithOverwrite(c, false)
			})
		}

		if (category.includes("mastery")) {
			masteryCamos.forEach(c => {
				pressCamoWithOverwrite(c, false)
			})
		}
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
							on:click={() => updateCamos('2')}>WZ</span
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
				<div
					class="space-y-4"
					in:fly={{ x: -500, duration: 500, delay: 250 }}
					out:fly={{ x: 500, duration: 200 }}
				>
					<!-- Grid 1 Section -->
					<div
						class="relative space-y-4 bg-gray-900 rounded-xl shadow-lg p-4
					{specialFilter.includes('zm')
							? 'ring-2 ring-green-500'
							: specialFilter.includes('mp')
								? 'ring-2 ring-blue-500'
								: specialFilter.includes('wz')
									? 'ring-2 ring-red-500'
									: ''}"
					>
						<h2 class="text-2xl font-semibold">Military</h2>
						<!-- Buttons -->
						<div class="absolute right-5 top-0 flex space-x-2">
							<button
								class="bg-green-500 text-white px-4 py-1 rounded shadow hover:bg-green-600 transition"
								on:click={() => doneAll('military')}
							>
								Done
							</button>
							<button
								class="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
								on:click={() => clearAll('military')}
							>
								Clear
							</button>
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{#each militaryCamos as camoEntry}
								<div
									id={camoEntry.id}
									class="bg-gray-800 rounded-xl shadow-lg p-6 flex items-center {isCamoDone(
										camoEntry
									)
										? 'ring-2 ring-green-500'
										: ''}"
									role="button"
									on:click={() => {
										pressCamo(camoEntry);
									}}
								>
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
					<div
						class="relative space-y-4 bg-gray-900 rounded-xl shadow-lg p-4
					{specialFilter.includes('zm')
							? 'ring-2 ring-green-500'
							: specialFilter.includes('mp')
								? 'ring-2 ring-blue-500'
								: specialFilter.includes('wz')
									? 'ring-2 ring-red-500'
									: ''}"
					>
						<h2 class="text-2xl font-semibold">Special</h2>
						<!-- Buttons -->
						<div class="absolute right-5 top-0 flex space-x-2">
							<button
								class="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
								on:click={() => doneAll('special')}
							>
								Done
							</button>
							<button
								class="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
								on:click={() => clearAll('special')}
							>
								Clear
							</button>
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{#each currentWeapon?.camos.filter((c) => c.category == specialFilter) as camoEntry}
								<div
									id={camoEntry.id}
									class="bg-gray-800 rounded-xl shadow-lg p-6 flex items-center {isCamoDone(
										camoEntry
									)
										? 'ring-2 ring-green-500'
										: ''}"
									role="button"
									on:click={() => {
										pressCamo(camoEntry);
									}}
								>
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
					<div
						class="relative space-y-4 bg-gray-900 rounded-xl shadow-lg p-4
					{specialFilter.includes('zm')
							? 'ring-2 ring-green-500'
							: specialFilter.includes('mp')
								? 'ring-2 ring-blue-500'
								: specialFilter.includes('wz')
									? 'ring-2 ring-red-500'
									: ''}"
					>
						<h2 class="text-2xl font-semibold">Mastery</h2>
						<!-- Buttons -->
						<div class="absolute right-5 top-0 flex space-x-2">
							<button
								class="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
								on:click={() => doneAll('mastery')}
							>
								Done
							</button>
							<button
								class="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
								on:click={() => clearAll('mastery')}
							>
								Clear
							</button>
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{#each masteryCamos as camoEntry}
								<div
									id={camoEntry.id}
									class="bg-gray-800 rounded-xl shadow-lg p-6 flex items-center {isCamoDone(
										camoEntry
									)
										? 'ring-2 ring-green-500'
										: ''}"
									role="button"
									on:click={() => {
										pressCamo(camoEntry);
									}}
								>
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
