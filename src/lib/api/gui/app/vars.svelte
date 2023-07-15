<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { listAppVars } from "../utils";
  import EditorCode from "./handler/editorCode.svelte";

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
        <div class="margin_code">
          <code>
            {@html JSON.stringify(Datavars[varKey], null, 4)
              .replace(/\n/g, "<br/>")
              .replace(/ /g, "&nbsp;")}
          </code>
        </div>
      </details>
    {/if}
  {/each}
</div>

<style>
  .margin_code {
    margin-left: 2em;
  }
</style>
