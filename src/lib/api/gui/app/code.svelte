<script>
  import {
    DialogModal,
    // @ts-ignore
  } from "@edwinspire/svelte-components/src/index.js";
  import FetchCode from "./handler/fetch.svelte";
  import JsCode from "./handler/js.svelte";
  import SoapCode from "./handler/soap.svelte";
  import SqlCode from "./handler/sql.svelte";

  /**
   * @type {any}
   */
  export let method;
  let showCode = false;
</script>

<button
  class="button is-small is-primary"
  on:click={() => {
    showCode = !showCode;
  }}>Code</button
>

<DialogModal bind:Show={showCode}>
  <span slot="title">{method.handler}</span>

  <div slot="body">
    {#if method.handler == "jsFunction"}
      <JsCode bind:code={method.code} />
    {:else if method.handler == "soapFunction"}
      <SoapCode bind:code={method.code} />
    {:else if method.handler == "sqlFunction"}
      <SqlCode bind:code={method.code} />
    {:else if method.handler == "fetchFunction"}
      <FetchCode bind:code={method.code} />
    {:else}
      <code>
        {method.code}
      </code>
    {/if}
  </div>
</DialogModal>
