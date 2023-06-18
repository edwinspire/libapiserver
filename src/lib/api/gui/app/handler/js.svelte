<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import EditorCode from "./editorCode.svelte";

  export let code;
  let fnEditorCode;

  export function getCode() {
    console.log(">> getCode en JS.SVELTE ", );
    return fnEditorCode.getCode();
  }

  onMount(() => {});
</script>

<EditorCode lang="js" bind:code bind:this={fnEditorCode} />
