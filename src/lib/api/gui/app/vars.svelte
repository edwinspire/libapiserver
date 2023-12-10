<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { listAppVars } from '../utils';
	import EditorCode from './handler/editorCode.svelte';
	import CodeHTML from '../widgets/codeHTML.svelte';

	// export let vars = {};
	export let editable = false;
	export let environment = '';
	let Datavars = {};
	let fnEditorCodes = {};

	listAppVars.subscribe((value) => {
		console.log('listAppVars ->>>>', value);
		// @ts-ignore
		Datavars = value || {};
		/*
		if (Datavars) {
			fnEditorCodes = Object.keys(Datavars[environment]).map((key) => {
				return { key: {} };
			});
		}
		*/
	});

	export function getCode() {
		//fnEditorCode.apply();
		//return fnEditorCode.getCode();
		let codes = {};
		Object.keys(fnEditorCodes).forEach((key) => {
			
try {
	codes[key] = JSON.parse(fnEditorCodes[key].getCode());	
} catch (error) {
	console.error(error, key, fnEditorCodes[key].getCode());
}

			//return c;
		});
		return codes;
	}

	onMount(() => {});
</script>

<details>
	<summary><strong>App Vars</strong></summary>

	<div>
		{#if Datavars && Datavars[environment]}
			{#each Object.keys(Datavars[environment]) as varKey}
				{#if editable}
					<details>
						<summary><strong>{varKey}</strong></summary>
						<EditorCode
							bind:this={fnEditorCodes[varKey]}
							lang={'json'}
							code={JSON.stringify(Datavars[environment][varKey])}
						/>
					</details>
				{:else}
					<details>
						<summary><strong>{varKey}</strong></summary>
						<CodeHTML bind:jsonObject={Datavars[environment][varKey]} />
					</details>
				{/if}
			{/each}
		{/if}
	</div>
</details>
