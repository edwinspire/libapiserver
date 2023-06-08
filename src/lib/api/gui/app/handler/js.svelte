<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import EditorCode from "./editorCode.svelte";

  export let code;
  let fnEditorCode;

  export function apply() {
    fnEditorCode.apply();
  }

  onMount(() => {});
</script>

<EditorCode lang="js" bind:code bind:this={fnEditorCode} />
