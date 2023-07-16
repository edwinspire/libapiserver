<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import EditorCode from "./editorCode.svelte";
  import { Tab } from "@edwinspire/svelte-components";
  import Vars from "../vars.svelte";
  import { formatJsonForHtmlCode } from "../../utils";

  /**
   * @type {any}
   */
  export let code;

  let tabList = [
    { label: "Parameters", isActive: true },
    { label: "Information", isActive: false },
    { label: "App Variables" },
  ];

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
      RequestArgs: {},
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

<Tab bind:tabs={tabList}>
  <div class={tabList[0].isActive ? "" : "is-hidden"}>
    <EditorCode lang="json" bind:code bind:this={fnEditorCode} />
  </div>
  <div class={tabList[1].isActive ? "" : "is-hidden"}>
    Enter the parameters in json format like the following example:
    <code>
      {@html formatJsonForHtmlCode(jsonParams)}
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
        <strong>RequestArgs:</strong> Better not define it. Internally, the variables
        that must be sent when consuming the endpoint are assigned.
      </li>
    </ul>
  </div>

  <div class={tabList[2].isActive ? "" : "is-hidden"}>
    <Vars />
  </div>
</Tab>
