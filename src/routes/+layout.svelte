<script lang="ts">
	import '../app.postcss';
	import '@fortawesome/fontawesome-free/css/all.min.css'
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { fly, scale } from 'svelte/transition';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { config, defaultProgress, defaultUserConfig, loadAll, progress } from '$lib/handler';
	import { onMount } from 'svelte';
	import { parseLocalProgress, parseUserConfig } from '$lib/structures';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	loadAll();

	export let data;
	onMount(() => {
		let storageProgress = localStorage.getItem("storedProgress")
		let parsedProgress = storageProgress ? parseLocalProgress(JSON.parse(storageProgress)) : defaultProgress
		progress.set(parsedProgress)
		progress.subscribe((x) => localStorage.setItem("storedProgress", JSON.stringify(x)))

		let storageConfig = localStorage.getItem("storedConfig")
		let parsedConfig = storageConfig ? parseUserConfig(JSON.parse(storageConfig)) : defaultUserConfig
		config.set(parsedConfig)
		config.subscribe((x) => localStorage.setItem("storedConfig", JSON.stringify(x)))
	})
</script>
<svelte:head>
	<meta property="og:description" content="Simple, quick and local. A Black Ops 6 Camo Tracker">
    <meta name="twitter:description" content="Simple, quick and local. A Black Ops 6 Camo Tracker">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://camo.presti.me/images/branding/medium.png">
    <meta name="twitter:image" content="https://camo.presti.me/images/branding/large.png">
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
					class="btn btn-l variant-ghost-surface"
					href="https://bsky.app/profile/presti.onlywiff.com"
					target="_blank"
					rel="noreferrer"
				>
					<i class="fa-brands fa-bluesky"></i>
				</a>
				<a
					class="btn btn-l variant-ghost-surface"
					href="https://github.com/DxsSucuk/PrestisCamoTracker"
					target="_blank"
					rel="noreferrer"
				>
					<i class="fa-brands fa-github"></i>
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
	<svelte:fragment slot="pageFooter">
		<p class="text-base text-gray-400 text-center p-6">Call of Duty® is a registered trademark of Activision. This site is not affiliated with Activision.</p>
	</svelte:fragment>
	<script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>
	<script>
	   kofiWidgetOverlay.draw('presti', {
	   'type': 'floating-chat',
	   'floating-chat.donateButton.text': 'Support me',
	   'floating-chat.donateButton.background-color': '#794bc4',
	   'floating-chat.donateButton.text-color': '#fff'
	   });
	</script>
</AppShell>
