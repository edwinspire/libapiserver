<script>
  // @ts-ignore
  import uFetch from "@edwinspire/universal-fetch";
  import {
    PredictiveInput,
    Table,
    ColumnTypes,
    DialogModal,
    // @ts-ignore
  } from "@edwinspire/svelte-components/src/index.js";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { tokenStore } from "../utils.js";
  import Route from "./route.svelte";

  const dispatch = createEventDispatcher();
  export let idapp = 0;

  $: idapp, getApp();

  /**
   * @type {any}
   */
  let app;

  let columns = {
    idapp: { hidden: true },
    app: { hidden: false },
    description: { hidden: true },
    enabled: {
      hidden: false,
      label: "App Enabled",
      decorator: { component: ColumnTypes.Boolean },
    },
    icon: { hidden: true },
    "routes.enabled": {
      label: "route enabled",
      decorator: { component: ColumnTypes.Boolean },
    },
    "routes.idroute": { hidden: true },
    "routes.methods.code": { label: "code", hidden: true },
    "routes.methods.description": { hidden: true },
    "routes.route": { label: "route" },
    "routes.methods.enabled": {
      label: "Method Enabled",
      decorator: { component: ColumnTypes.Boolean },
    },
    "routes.methods.env": { label: "Enviroment" },
    "routes.methods.examples": { hidden: true },
    "routes.methods.handler": { label: "handler" },
    "routes.methods.idmethod": { hidden: true },
    "routes.methods.is_public": {
      label: "is public",
      decorator: { component: ColumnTypes.Boolean },
    },
    "routes.methods.method": { label: "method" },
    "routes.methods.version": { label: "version" },
  };

  let uf = new uFetch();

  function emitExit() {
    dispatch("exit", {
      page: "exit",
    });
  }

  async function getApp() {
    // Lógica de autenticación aquí

    try {
      let apps_res = await uf.get("/api/app/" + idapp, { raw: false });
      app = await apps_res.json();
    } catch (error) {
      // @ts-ignore
      alert(error.message);
    }
  }

  tokenStore.subscribe((value) => {
    console.log("tokenStore", value);
    uf.addHeader("api-token", value);
  });

  /**
   * @param {any} e
   */
  function editRow(e) {
    console.log(e);
    //    showMethod = true;
  }

  /**
   * @param {any} e
   */
  function newRow(e) {
    console.log(e);
    //  showMethod = true;
  }

  onMount(() => {
    // uf.addHeader(tokenStore.);
    console.log(tokenStore);

    //getListApps();
  });
</script>

<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="#"> <strong>Application</strong> </a>

    <a
      role="button"
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbarBasicExample"
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

  <div class="navbar-menu">
    <div class="navbar-start" />

    <div class="navbar-end">
      <div class="navbar-item">
        <span class="button is-primary is-small">
          <strong>New App</strong>
        </span>
      </div>
      <div class="navbar-item">
        <span class="button is-primary is-small">
          <strong>New Route</strong>
        </span>
      </div>

      <div
        class="navbar-item"
        on:click={() => {
          alert("OK");
          console.log(app);
        }}
      >
        <a class="button is-primary is-small">
          <strong>Guardar</strong>
        </a>
      </div>
    </div>
  </div>
</nav>

{#if app}
  <div class="box">
    <div class="field">
      <label class="label is-small">App Name</label>
      <div class="control">
        <input
          class="input is-small"
          type="text"
          placeholder="App Name"
          bind:value={app.app}
        />
      </div>
    </div>

    <label class="checkbox">
      <input type="checkbox" class="is-small" bind:checked={app.enabled} />
      Enabled
    </label>

    <div class="field">
      <label class="label is-small">App Icon</label>
      <div class="control">
        <input
          class="input is-small"
          type="text"
          placeholder="App Icon"
          bind:value={app.icon}
        />
      </div>
    </div>

    <div class="field">
      <label class="label is-small">Description</label>
      <div class="control">
        <textarea
          class="textarea is-small"
          placeholder="Textarea"
          bind:value={app.description}
        />
      </div>
    </div>

    <div class="box">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="#"> <strong>Routes</strong> </a>

          <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>

        <div class="navbar-menu">
          <div class="navbar-start" />

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="field has-addons">
                <div class="control">
                  <input
                    class="input is-small"
                    type="text"
                    placeholder="Find a route"
                  />
                </div>
                <div class="control">
                  <a class="button is-info is-small"> Search </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {#if app && app.route && Array.isArray(app.route)}
        {#each app.route as route}
          <Route bind:route />
        {/each}
      {/if}
    </div>
  </div>
{/if}
