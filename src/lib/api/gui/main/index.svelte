<script>
  //  import "@codemirror/lib/codemirror.css";

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
  import App from "../app/index.svelte";

  const dispatch = createEventDispatcher();

  let idappSelected = 0;
  let showMethod = false;

  /**
   * @type {any[]}
   */
  let routes = [];

  /**
   * @type {{ name: any; value: any; }[]}
   */
  let options = [];

  /**
   * @type {any}
   */
  let app = {};

  let mainTab = "app";

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
      let apps_res = await uf.get("/api/app/" + idapp, { raw: true });
      routes = await apps_res.json();
      // console.log(routes);

      app = routes.find((element) => (element.idapp = idapp));
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
    mainTab = "app";
    idappSelected = e.detail.data.idapp;
  }

  /**
   * @param {any} e
   */
  function newRow(e) {
    console.log(e);
    showMethod = true;
  }

  onMount(() => {
    // uf.addHeader(tokenStore.);
    console.log(tokenStore);
    getListApps();
  });
</script>

<div class="box">
  <div class="field">
    <label class="label is-small">App</label>
    <div class="control">
      <PredictiveInput
        bind:options
        on:select={(/** @type {{ detail: { value: number; }; }} */ e) => {
          console.log(e);
         // getApp(e.detail.value);
         app.idapp = e.detail.value;
        }}
      />
    </div>
  </div>

  <div class="tabs is-small is-boxed">
    <ul>
      <li class={mainTab == "app" ? "is-active" : ""}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          on:click={() => {
            mainTab = "app";
          }}>App</a
        >
      </li>
      <li class={mainTab == "endpoints" ? "is-active" : ""}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          on:click={() => {
            mainTab = "endpoints";
          }}>EndPoints</a
        >
      </li>
    </ul>
  </div>

  <div />

  <div class={mainTab == "app" ? "" : "is-hidden"}>
    <App bind:idapp={app.idapp} />
  </div>

  <div class={mainTab == "endpoints" ? "" : "is-hidden"}>
    <Table
      bind:RawDataTable={routes}
      bind:columns
      on:editrow={editRow}
      on:newrow={newRow}
    >
      <span slot="item1" />
    </Table>
  </div>
</div>

<style>
</style>
