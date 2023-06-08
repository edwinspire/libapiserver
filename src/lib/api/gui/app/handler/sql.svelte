<script>
  
    import { onMount } from "svelte";
    import EditorCode from "./editorCode.svelte";
    import EditorCode2 from "./editorCode.svelte";
  
    /**
   * @type {any}
   */
     export let code;
    /**
   * @type {EditorCode}
   */
    let fnEditorCode;
  
    export function apply() {
      fnEditorCode.apply();
    }
  
    onMount(() => {
        console.log(code);
    });
  </script>
  
  <EditorCode lang="json" bind:code bind:this={fnEditorCode} />
  <EditorCode2 lang="sql" bind:code bind:this={fnEditorCode} />
  
