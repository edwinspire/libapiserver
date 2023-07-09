<script>
  // @ts-ignore
  import uFetch from "@edwinspire/universal-fetch";
  import {
    PredictiveInput,
    Table,
    ColumnTypes,
    DialogModal,
    Level,
    // @ts-ignore
  } from "@edwinspire/svelte-components";
  import { onMount } from "svelte";
  import { userStore } from "../utils.js";
  //import CellMethods from " ./cellMethods.svelte";
  //import MethodDialog from "./method.svelte";
  import { AppToTable, TableToApp } from "../../db/utils.js";

  let uf = new uFetch();
  let methodList = [];
  /**
   * @type {any[]}
   */
  let appDataTable = [];

  let columns = {
    //dev: { decorator: { component: CellMethods } },
    //qa: { decorator: { component: CellMethods } },
    //prd: { decorator: { component: CellMethods } },
    idapp: { hidden: true },
    rowkey: { hidden: true },
    app: { hidden: true },
    namespace: { hidden: true },
    name: { hidden: true },
    version: { hidden: true },
    description: { hidden: true },
  };

  userStore.subscribe((value) => {
    console.log("tokenStore ->>>>", value);
    // @ts-ignore
    uf.addHeader("api-token", value.token);
  });

  async function getMethods() {
    // Lógica de autenticación aquí
    let result = {};
    try {
      //     console.log("getMethods >>>>>> ", $userStore, uf);

      let ms_res = await uf.get("/system/main/methods");
      let mtds = await ms_res.json();
      //console.log(apps);

      if (mtds && Array.isArray(mtds) && mtds.length > 0) {
        for (let i = 0; i < mtds.length; i++) {
          // @ts-ignore
          result[mtds[i].label] = {
            consume: false,
            create: false,
            read: false,
            update: false,
            delete: false,
            upgrade: false,
          };
        }
        //console.log('>>x> mtds', mtds);
        return result;
      } else {
        return result;
      }
    } catch (error) {
      // @ts-ignore
      //      alert(error.message);
      return result;
    }
  }

  async function getApps() {
    // Lógica de autenticación aquí

    try {
      let defaultMethods = await getMethods();

      console.log("getListApps >>>>>> ", $userStore, uf);

      let apps_res = await uf.get("/system/main/apps");
      let apps = await apps_res.json();
      //console.log(apps);

      if (apps && Array.isArray(apps) && apps.length > 0) {
        appDataTable = apps
          .map((a) => {
            return AppToTable(a);
          })
          .flat()
          .map((endp) => {
            let endpointAttr = {
              url: endp.url,
              enabled: endp.enabled,
              ...defaultMethods,
            };

            return endpointAttr;
          });
        console.log("======> ", appDataTable);
      } else {
        appDataTable = [];
      }
    } catch (error) {
      // @ts-ignore
      alert(error.message);
    }
  }

  onMount(() => {
    setTimeout(() => {
      getApps();
    }, 5000);
  });
</script>

<Table bind:RawDataTable={appDataTable} bind:columns>
  <span slot="l01"> Endpoints </span>
</Table>
