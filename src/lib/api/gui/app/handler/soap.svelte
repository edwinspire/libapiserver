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
  let jsonParams = JSON.stringify(
    {
      wsdl: "https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL",
      FunctionName: "NumberToDollars",
      BasicAuthSecurity: {
        User: "any",
        Password: "any",
      },
      RequestArgs: {}
    },
    null,
    2
  );

  export function getCode() {
    //fnEditorCode.apply();
    return fnEditorCode.getCode();
  }

  onMount(() => {
    // console.log(code);
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
          <strong>FunctionName:</strong> Function or method to call.
        </li>
        <li>
          <strong>BasicAuthSecurity:</strong> Only if required.
        </li>
        <li>
          <strong>RequestArgs:</strong> Better not define it. Internally, the variables that must be sent when consuming the endpoint are assigned.
        </li>
      </ul>
    </div>
  </div>
</EditorCode>
