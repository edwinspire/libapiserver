<script>
  // @ts-ignore
  import uFetch from "@edwinspire/universal-fetch";
  import { PredictiveInput } from "@edwinspire/svelte-components/src/index.js";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { tokenStore } from "../utils.js";

  const dispatch = createEventDispatcher();
  /**
   * @type {{ name: any; value: any; }[]}
   */
  let options = [];

  /**
   * @type {any}
   */
  let app;

  let uf = new uFetch();

  function emitExit() {
    dispatch("exit", {
      page: "exit",
    });
  }

  async function getListApps() {
    // Lógica de autenticación aquí

    try {
      let apps_res = await uf.get("/api/apps");
      let apps = await apps_res.json();
      console.log(apps);

      if (apps && Array.isArray(apps) && apps.length > 0) {
        options = apps.map((item) => {
          return { name: item.app, value: item.idapp };
        });
      } else {
        options = [];
      }
    } catch (error) {
      // @ts-ignore
      alert(error.message);
    }
  }

  /**
   * @param {number} idapp
   */
  async function getApp(idapp) {
    // Lógica de autenticación aquí

    try {
      let apps_res = await uf.get("/api/app/" + idapp);
      app = await apps_res.json();
      console.log(app);
      /*
      if (apps && Array.isArray(apps) && apps.length > 0) {
        options = apps.map((item) => {
          return { name: item.app, value: item.idapp };
        });

      } else {
     //   options = [];
      }
*/
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
    getListApps();
  });
</script>

<div class="container">
  Main pppppp

  <PredictiveInput
    bind:options
    on:select={(/** @type {{ detail: { value: number; }; }} */ e) => {
      console.log(e);
      getApp(e.detail.value);
    }}
  />

  {#if app}
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">App</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
              class="input is-static"
              type="email"
              value={app.app}
              readonly
            />
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">description</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
              class="input is-static"
              type="email"
              value={app.description}
              readonly
            />
          </p>
        </div>
      </div>
    </div>

    <ul>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th><abbr title="Position">Enabled</abbr></th>
              <th><abbr title="Played">Methods</abbr></th>
              <th><abbr title="Won">Route</abbr></th>
              <th><abbr title="Drawn">Full Route</abbr></th>
            </tr>
          </thead>

          {#each app.route as route}
            <tbody>
              <tr>
                <th>{route.enabled}</th>
                <td>
                  {#each route.method as method}
                    <span>
                      {method.method}
                    </span>
                  {/each}
                </td>
                <td>{route.route}</td>
                <td>Https://fgfgfhfhfh/fff/gggg/gg</td>
              </tr>
            </tbody>
          {/each}
        </table>
      </div>

      {#each app.route as route}
        <li>
          <h3>Route: {route.route}</h3>
          <ul>
            {#each route.method as method}
              <li>
                <h4>{method.method}</h4>
                <p>{method.description}</p>
                <code>{method.code}</code>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
</style>
