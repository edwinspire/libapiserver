<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import Counter from '$lib/Counter.svelte';

	let websocket;

	function wsConnect() {
		let url_wwebsocket = 'ws://' + window.location.host + '/websocket';

		if (window.location.protocol.includes('https')) {
			url_wwebsocket = 'wss://' + window.location.host + '/websocket';
		}

		console.log('Trying to open a WebSocket connection...', url_wwebsocket);
		websocket = new WebSocket(url_wwebsocket);
		websocket.onopen = (event) => {
			console.log('Connection opened');
		};
		websocket.onclose = (event) => {
			console.log('Connection closed');
			setTimeout(wsConnect, 2000);
		};
		websocket.onmessage = (event) => {
			//      console.log(event);
			let data = {};
			try {
				data = JSON.parse(event.data);
			} catch (error) {
				console.error(error);
			}
			console.log('Websocket', data);
		};

		return websocket;
	}

	onMount(() => {
		if ('WebSocket' in window) {
			wsConnect();
		} else {
			console.error('WebSocket is not supported by your Browser.');
		}
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset="svelte-welcome.webp" type="image/webp" />
				<img src="svelte-welcome.png" alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

	<h2>
		try editing <strong>src/routes/index.svelte</strong>
	</h2>

	<Counter />
</section>

<div class="file">
	<label class="file-label">
	  <input class="file-input" type="file" name="resume">
	  <span class="file-cta">
		<span class="file-icon">
		  <i class="fas fa-upload"></i>
		</span>
		<span class="file-label">
		  Choose a file…
		</span>
	  </span>
	</label>
  </div>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
