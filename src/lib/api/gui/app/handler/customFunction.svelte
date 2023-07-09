<script>
  import { onMount } from "svelte";
  //  import EditorCode from "./editorCode.svelte";

  /**
   * @type {any}
   */
  export let code;

  export function getCode() {
    //fnEditorCode.apply();
    return code;
  }

  onMount(() => {
    console.log(code);
  });
</script>

<div>
  <div class="content is-small">
    <h2>FUNCTION</h2>
    Url to make the request. The operation is similar to a proxy
  </div>
  <div>code</div>
</div>
