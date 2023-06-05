<script>
  // @ts-ignore
  import uFetch from "@edwinspire/universal-fetch";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { tokenStore } from "../utils.js";

  const dispatch = createEventDispatcher();

  /**
   * @type {any}
   */
  export let method;

  let uf = new uFetch();

  async function getApp() {
    // Lógica de autenticación aquí

    try {
      //let apps_res = await uf.get("/api/app/routes/" + idapp, { raw: false });
      //let apps = await apps_res.json();
      //console.log(routes);
    } catch (error) {
      // @ts-ignore
      alert(error.message);
    }
  }

  tokenStore.subscribe((value) => {
    console.log("tokenStore", value);
    uf.addHeader("api-token", value);
  });

  onMount(() => {
    // uf.addHeader(tokenStore.);
    console.log(tokenStore);

    //getListApps();
  });
</script>

<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
  <tr>
    <th>Method</th>
    <th>Version</th>
    <th>Is Public</th>
    <th>Handler</th>
    <th>Code</th>
  </tr>
  <tr>
    <td
      ><input
        class="input is-small"
        type="text"
        placeholder="Method"
        bind:value={method.method}
      /></td
    >
    <td
      ><input
        class="input is-small"
        type="number"
        placeholder="Version"
        bind:value={method.version}
      /></td
    >
    <td
      ><input
        class="input is-small"
        type="checkbox"
        placeholder="Is public"
        bind:checked={method.version}
      /></td
    >
    <td
      ><input
        class="input is-small"
        type="text"
        placeholder="Handler"
        bind:value={method.handler}
      /></td
    >
    <td><button class="button is-small">Code</button></td>
  </tr>
</table>

<div class="field">
  <label class="label is-small">Description</label>
  <div class="control">
    <textarea
      class="textarea is-small"
      placeholder="Textarea"
      bind:value={method.description}
    />
  </div>
</div>
