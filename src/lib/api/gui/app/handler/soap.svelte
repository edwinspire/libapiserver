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
  let jsonParams =
    "{ wsdl: string; FunctionName: string | any[]; BasicAuthSecurity: { User: any; Password: any; }; RequestArgs: any; }";

  export function getCode() {
    //fnEditorCode.apply();
    return fnEditorCode.getCode();
  }

  onMount(() => {
    console.log(code);
  });
</script>

<EditorCode lang="json" bind:code bind:this={fnEditorCode}>
  <div slot="message">
    <div class="content is-small">
      <h2>Parameters</h2>
      Enter the parameters in json format like the following example:
      <code>
        {jsonParams}
      </code>

      The variables with the following:
      <ul>
        <li>
          <strong>wsdl:</strong> url where the wsdl is located.
        </li>
        <li>
          <strong>FunctionName:</strong> Function or method to call
        </li>
        <li>
          <strong>RequestArgs</strong> Nor defined.
        </li>
      </ul>
    </div>
  </div>
</EditorCode>
