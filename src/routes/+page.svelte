<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { categoryList, categoryWeaponMap, weaponsList, getCategory } from '$lib/handler';
	import type { Category, Weapon, WeaponCategoryMap } from '$lib/structures';
	import { onMount } from 'svelte';
	import { fly, scale, slide } from 'svelte/transition';

	var categories: Category[];
	var currentCategory: Category;
	var allWeapons: Weapon[];
	var weaponCategoryMaps: WeaponCategoryMap[];
	var weapons: Weapon[];
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
	});

	let array: Weapon[] = [];

	function selectCategory(selection: Category) {
		currentCategory = selection;
		var categoryMap = weaponCategoryMaps.find((c) => c.category == selection.id);
		weapons = categoryMap
			? allWeapons.filter((c) => categoryMap!.weapons.indexOf(c.id) > -1)
			: array;
	}

	var searchQuery: string;

	function searchForWeapon() {
		weapons = allWeapons.filter((c) => c.name.toUpperCase().includes(searchQuery.toUpperCase()));
	}

	function openWeapon(weapon: Weapon) {
		goto('/weapon/' + weapon.id);
	}
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
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

		<!-- Grid Section -->
		{#key currentCategory}
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
							<div class="absolute bottom-4 right-4 flex space-x-2">
								<span class="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded">MP</span>
								<span class="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded">ZM</span>
								<span class="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">WZ</span>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		{/key}
	</div>
</div>
