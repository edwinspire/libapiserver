<script>
  //  import "@codemirror/lib/codemirror.css";

  import uFetch from "@edwinspire/universal-fetch";
  import {
    PredictiveInput,
    Table,
    ColumnTypes,
    DialogModal,
    Level,
  } from "@edwinspire/svelte-components";
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
  let endpoints = [];

  /**
   * @type {{ name: any; value: any; }[]}
   */
  let options = [];

  /**
   * @type {any}
   */
  let app = {};

  let mainTab = "app";

  let columns = {};

  let uf = new uFetch();

  async function getListApps() {
    // Lógica de autenticación aquí

    try {
      let apps_res = await uf.get("/api/apps");
      let apps = await apps_res.json();
      //console.log(apps);

      if (apps && Array.isArray(apps) && apps.length > 0) {
        options = apps.map((item) => {
          return { name: item.app, value: item.app };
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
   * @param {string} appname
   */
  async function getApp(appname) {
    // Lógica de autenticación aquí

    try {
      let apps_res = await uf.get("/api/app/" + appname, { raw: true });
      endpoints = await apps_res.json();
      // console.log(routes);
      //app = routes.find((element) => (element.idapp = idapp));
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
  <div class={mainTab == "app" ? "" : "is-hidden"}>
    <App bind:idapp={app.idapp} />
  </div>
</div>

<style>
</style>
