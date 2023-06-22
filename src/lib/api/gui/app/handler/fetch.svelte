<script>
  import { onMount } from "svelte";
  import EditorCode from "./editorCode.svelte";

  /**
   * @type {any}
   */
  export let code;
  /**
   * @type {EditorCode}
   */
  let fnEditorCode;
  let instrucions =
    "Url to make the request. The operation is similar to a proxy.<br>";

  export function getCode() {
    //fnEditorCode.apply();
    return fnEditorCode.getCode();
  }

  onMount(() => {
    console.log(code);
  });
</script>

<EditorCode lang="txt" bind:code bind:this={fnEditorCode} {instrucions} />
