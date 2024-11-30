<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { blur, fly, scale, slide } from 'svelte/transition';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { loadAll } from '$lib/handler';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	loadAll();

	export let data;
</script>
<svelte:head>
	<meta property="og:description" content="Simple, quick and local. A Black Ops 6 Camo Tracker">
    <meta name="twitter:description" content="Simple, quick and local. A Black Ops 6 Camo Tracker">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://camo.presti.me/images/branding/medium.jpg">
    <meta name="twitter:image" content="https://camo.presti.me/images/branding/large.jpg">
    <meta name="twitter:title" content="Prestis Camo Tracker">
	<title>Prestis Camo Tracker</title>
    <script type="application/ld+json">{"@context":"http://schema.org","@type":"WebSite","name":"Prestis Camo Tracker","url":"https://camo.presti.me"}</script>
</svelte:head>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Prestis Camo Tracker</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://memerinoto.bsky.social"
					target="_blank"
					rel="noreferrer"
				>
					BSky
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/DxsSucuk/PrestisCamoTracker"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	{#key data.url}
		<div in:scale={{duration: 500, delay: 200}}
			out:fly={{duration: 150, x: -500}}>
			<slot />
		</div>
	{/key}
</AppShell>
