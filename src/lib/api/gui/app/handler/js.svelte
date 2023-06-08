<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import EditorCode from "./editorCode.svelte";

  export let code;
  let fnEditorCode;

  export function getCode() {
    fnEditorCode.getCode();
  }

  onMount(() => {});
</script>

<EditorCode lang="js" bind:code bind:this={fnEditorCode} />
