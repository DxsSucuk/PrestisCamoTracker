<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		categoryList,
		categoryWeaponMap,
		weaponsList,
		getCategory,
		getCamoProgressById,
		globalMultiplayerCamos,
		globalZombiesCamos,
		globalWarzoneCamos
	} from '$lib/handler';
	import type { Camo, Category, Weapon, WeaponCategoryMap } from '$lib/structures';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';

	var categories: Category[];
	var currentCategory: Category;
	var allWeapons: Weapon[];
	var weaponCategoryMaps: WeaponCategoryMap[];
	var weapons: Weapon[];

	let addTestWeapon: boolean;
	let updateContentList: string;

	onMount(async () => {
		categoryList.subscribe((c) => (categories = c));
		categoryWeaponMap.subscribe((c) => (weaponCategoryMaps = c));
		weaponsList.subscribe((c) => (allWeapons = c));

		let defaultCatId = $page.url.searchParams.has('category')
			? $page.url.searchParams.get('category')!
			: 'assault';

		var defaultCat = getCategory(defaultCatId);
		if (defaultCat !== undefined) {
			selectCategory(defaultCat);
		}

		if ($page.url.searchParams.has('search')) {
			searchQuery = $page.url.searchParams.get('search')!;
			searchForWeapon();
		}

		addTestWeapon = $page.url.searchParams.has('testmode');
		console.log(addTestWeapon);
	});

	let array: Weapon[] = [];

	function selectCategory(selection: Category) {
		currentCategory = selection;
		updateContentList = selection.id;
		var categoryMap = weaponCategoryMaps.find((c) => c.category == selection.id);
		weapons = categoryMap
			? allWeapons.filter((c) => categoryMap!.weapons.indexOf(c.id) > -1)
			: array;
		addTestWeapons();
	}

	var searchQuery: string;

	function searchForWeapon() {
		updateContentList = searchQuery;
		weapons = allWeapons.filter((c) => c.name.toUpperCase().includes(searchQuery.toUpperCase()));
	}

	function addTestWeapons() {
		if (addTestWeapon) {
			console.log('Adding test weapons!');
			let testWeapons: Weapon[] = allWeapons.filter((c) => c.category.includes('TEST'));
			testWeapons.forEach((element) => {
				weapons.push(element);
			});
		}
	}

	function openWeapon(weapon: Weapon) {
		goto('/weapon/' + weapon.id);
	}

	function getHighestCamo(weapon: Weapon, typ: string): Camo {
		var toUseCamoListGlobal: Camo[];
		let militaryFilter;
		let specialFilter;
		let masteryFilter;

		if (typ == '0') {
			toUseCamoListGlobal = get(globalMultiplayerCamos);
			militaryFilter = 'military_mp'
			specialFilter = 'special_mp';
			masteryFilter = "mastery_mp"
		} else if (typ == '1') {
			toUseCamoListGlobal = get(globalZombiesCamos);
			militaryFilter = 'military_zm'
			specialFilter = 'special_zm';
			masteryFilter = "mastery_zm"
		} else {
			toUseCamoListGlobal = get(globalWarzoneCamos);
			militaryFilter = 'military_wz'
			specialFilter = 'special_wz';
			masteryFilter = "mastery_wz"
		}

		let highestWeaponCamo = getCamoProgressById(weapon.id).camo.sort((a, b) => a.position < b.position ? -1 : a.position > b.position ? 1 : 0)
			.findLast((c) => c.done && (c.category.includes(militaryFilter) || c.category.includes(specialFilter) || c.category.includes(masteryFilter)));

		if (!highestWeaponCamo) return toUseCamoListGlobal[0];

		var toUseCamo = highestWeaponCamo.category.includes("special") ? weapon.camos.find((c) => c.id == highestWeaponCamo!.id) :
		toUseCamoListGlobal.find((c) => c.id == highestWeaponCamo!.id);


		return toUseCamo || toUseCamoListGlobal[0]
	}
</script>

<div class="p-6 text-white">
	<!-- Container -->
	<div class="max-w-6xl mx-auto space-y-6">
		<!-- Categories and Search Section -->
		<div class="rounded-xl bg-gray-800 p-6 shadow-lg">
			<div
				class="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4"
			>
				<!-- Categories -->
				<div class="flex flex-wrap gap-2">
					{#if categories !== undefined}
						{#each categories as category}
							<button
								class="w-28 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
								on:click={() => selectCategory(category)}
							>
								{category.display}
							</button>
						{/each}
					{/if}
				</div>
				<!-- Search -->
				<input
					id="searchBar"
					type="text"
					placeholder="Search..."
					class="w-1/3 px-4 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-white text-sm focus:ring-blue-500 focus:border-blue-500"
					on:keyup={searchForWeapon}
					bind:value={searchQuery}
				/>
			</div>
		</div>

		<div class="space-y-4 bg-gray-800 rounded-xl shadow-lg p-4">
			<h2 class="text-2xl text-red-500 font-semibold">Notices</h2>
			<div class="grid grid-cols-1 gap-6">
					<div
						class="bg-gray-900 rounded-xl ring-2 ring-blue-500 shadow-lg p-6 flex items-center"
					>
						<!-- Text Content -->
						<div class="flex-1">
							<h4 class="text-lg font-semibold">Camo Issues</h4>
							<p class="text-base text-gray-400 mt-2">
								Warzone Special Camos are completly missing and need to be added. <br>
								Category specific Camo descriptions are not implemented: Meeles and Launcher required less kills.
							</p>
						</div>
					</div>
			</div>
		</div>

		<!-- Grid Section -->
		{#key updateContentList}
			<div
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
				in:fly={{ x: -500, duration: 500, delay: 250 }}
				out:fly={{ x: 500, duration: 200 }}
			>
				{#if weapons !== undefined}
					{#each weapons as weaponToDisplay}
						<div
							role="button"
							class="relative bg-gray-800 rounded-xl shadow-lg p-6 h-56"
							style="background-image: url({weaponToDisplay.image}); background-size: cover; background-position: center;"
							on:click={openWeapon(weaponToDisplay)}
						>
							<h3 class="text-xl font-semibold">{weaponToDisplay.name}</h3>
							<p class="text-base text-gray-400">
								{getCategory(weaponToDisplay.category)?.display}
							</p>
							{#if weaponToDisplay.notice !== undefined}
								<div class="absolute top-4 right-4 flex space-x-2">
									{#if weaponToDisplay.notice.multiplayer || weaponToDisplay.notice.global}
										<div
											class="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white font-bold text-lg"
										>
											!
										</div>
									{/if}
									{#if weaponToDisplay.notice.zombies || weaponToDisplay.notice.global}
										<div
											class="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full text-white font-bold text-lg"
										>
											!
										</div>
									{/if}
									{#if weaponToDisplay.notice.warzone || weaponToDisplay.notice.global}
										<div
											class="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full text-white font-bold text-lg"
										>
											!
										</div>
									{/if}
								</div>
							{/if}
							<div class="absolute bottom-4 right-4 flex space-x-2">
								<div
									class="relative ring-2 ring-blue-500 flex items-center justify-center w-12 h-12 rounded text-white text-sm font-bold"
								>
									<img
										src={getHighestCamo(weaponToDisplay, '0').image}
										alt="{weaponToDisplay.id} highest"
										class="w-full h-full object-cover rounded"
									/>
									<span class="absolute top-1 left-1">MP</span>
								</div>
								<div
									class="relative ring-2 ring-green-500 flex items-center justify-center w-12 h-12 rounded text-white text-sm font-bold"
								>
									<img
										src={getHighestCamo(weaponToDisplay, '1').image}
										alt="{weaponToDisplay.id} highest"
										class="w-full h-full object-cover rounded"
									/>
									<span class="absolute top-1 left-1">ZM</span>
								</div>
								<div
									class="relative ring-2 ring-red-500 flex items-center justify-center w-12 h-12 rounded text-white text-sm font-bold"
								>
									<img
										src={getHighestCamo(weaponToDisplay, '2').image}
										alt="{weaponToDisplay.id} highest"
										class="w-full h-full object-cover rounded"
									/>
									<span class="absolute top-1 left-1">WZ</span>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		{/key}
	</div>
</div>
