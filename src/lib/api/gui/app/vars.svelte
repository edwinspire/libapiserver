<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import { listAppVars } from "../utils";
  import EditorCode from "./handler/editorCode.svelte";
  import CodeHTML from "../widgets/codeHTML.svelte";

  // export let vars = {};
  export let editable = false;
  let Datavars = {};

  listAppVars.subscribe((value) => {
    console.log("listAppVars ->>>>", value, JSON.stringify(value, null, 4));
    // @ts-ignore
    Datavars = value;
  });

  onMount(() => {});
</script>

<div>
  {#each Object.keys(Datavars) as varKey}
    {#if editable}
      <div>{varKey}</div>
      <div>
        <EditorCode lang={"json"} code={JSON.stringify(Datavars[varKey])} />
      </div>
    {:else}
      <details>
        <summary><strong>{varKey}</strong></summary>
        <CodeHTML bind:jsonObject={Datavars[varKey]} />
      </details>
    {/if}
  {/each}
</div>
