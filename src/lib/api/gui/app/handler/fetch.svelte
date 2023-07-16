<script>
// @ts-nocheck

  import { onMount } from "svelte";
  import EditorCode from "./editorCode.svelte";
  import { Tab } from "@edwinspire/svelte-components";
  import Vars from "../vars.svelte";

  /**
   * @type {any}
   */
  export let code;
  /**
   * @type {EditorCode}
   */
  let fnEditorCode;

  let tabList = [{ label: "Url", isActive: true }, { label: "App Variables" }];

  export function getCode() {
    //fnEditorCode.apply();
    return fnEditorCode.getCode();
  }

  onMount(() => {
    console.log(code);
  });
</script>

<Tab bind:tabs={tabList}>
  <div class={tabList[0].isActive ? "" : "is-hidden"}>
    <EditorCode lang="txt" bind:code bind:this={fnEditorCode}>
      <div slot="message">
        <div class="content is-small">
          <h2>Fetch</h2>
          Url to make the request. The operation is similar to a proxy
        </div>
      </div>
    </EditorCode>
  </div>

  <div class={tabList[1].isActive ? "" : "is-hidden"}>
    <Vars />
  </div>
</Tab>
