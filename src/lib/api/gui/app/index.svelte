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
  import { createEventDispatcher } from "svelte";
  import { tokenStore } from "../utils.js";
  import CellMethods from "./cellMethods.svelte";
  import MethodDialog from "./method.svelte";

  const dispatch = createEventDispatcher();
  export let idapp = 0;

  $: idapp, getApp();

  let columns = {
    methods: { decorator: { component: CellMethods } },
    idapp: { hidden: true },
    rowkey: { hidden: true },
  };
  /**
   * @type {{ name: any; value: any; }[]}
   */
  let options = [];

  let namespaceSelected = "";
  let nameSelected = "";
  let showDialogOneField = false;
  let showDialogMethod = false;
  let methodSelectedDialog = "";
  let paramDialogOneField = {
    title: "",
    description: "",
    inputType: "text",
    value: "",
    label: "",
    function: (/** @type {any} */ value) => {
      console.log("<Funcion>", value);
    },
  };

  let paramDialogMethod = {
    title: "",
    values: { enabled: true, public: false, handler: "" },
    function: (/** @type {any} */ value) => {
      console.log("<Funcion >>>>>>", value);
    },
  };

  let methods = [
    { id: "CONNECT", text: `CONNECT` },
    { id: "GET", text: `GET` },
    { id: "DELETE", text: `DELETE` },
    { id: "HEAD", text: `HEAD` },
    { id: "PATCH", text: `PATCH` },
    { id: "POST", text: `POST` },
    { id: "PUT", text: `PUT` },
  ];

  let handlers = [
    { id: "fetch", text: `fetch` },
    { id: "js", text: `js` },
    { id: "soap", text: `soap` },
    { id: "sql", text: `sql` },
  ];

  /**
   * @type {any}
   */
  let app;

  /**
   * @type {any[]}
   */
  let appDataTable = [];

  let pageSelected = "endpoint";
  let versionSelected = "";

  let uf = new uFetch();

  async function getListApps() {
    // Lógica de autenticación aquí

    try {
      let apps_res = await uf.get("/api/apps");
      let apps = await apps_res.json();
      //console.log(apps);

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
   * @param {any[]} array
   */
  function TableToApp(array) {
    const result = {};

    for (let i = 0; i < array.length; i++) {
      const obj = array[i];
      const {
        idapp,
        rowkey,
        app,
        enabled,
        description,
        namespace,
        name,
        env,
        version,
        methods,
      } = obj;

      // @ts-ignore
      if (!result[app]) {
        // @ts-ignore
        result[app] = {
          idapp: idapp,
          rowkey: rowkey,
          enabled: enabled,
          description: description,
          namespaces: {},
        };
      }

      const namespaceObj = {
        [name]: {
          [env]: {
            [version]: {},
          },
        },
      };

      for (let j = 0; j < methods.length; j++) {
        const method = methods[j];
        const key = Object.keys(method)[0];
        // @ts-ignore
        namespaceObj[name][env][version][key] = method[key];
      }

      // @ts-ignore
      if (!result[app].namespaces[namespace]) {
        // @ts-ignore
        result[app].namespaces[namespace] = namespaceObj;
      } else {
        Object.assign(
          // @ts-ignore
          result[app].namespaces[namespace],
          namespaceObj[namespace]
        );
      }
    }

    return result;
  }

  /**
   * @param {any} json
   */
  function AppToTable(json) {
    console.log(json);

    let result = [];
    /*
    // Recorrer los datos para construir la matriz
    for (const app in json) {
      const appData = json[app];
      for (const namespace in appData.namespaces) {
        const namespaceData = appData.namespaces[namespace];
        for (const name in namespaceData) {
          const envData = namespaceData[name];
          for (const env in envData) {
            const versionData = envData[env];
            for (const version in versionData) {
              const methods = versionData[version];
              result.push({
                enabled: appData.enabled,
                endpoint: `/api/${app}/${namespace}/${name}/${env}/${version}`,
                description: appData.description,
                idapp: appData.idapp,
                rowkey: appData.rowkey,
                app,
                namespace,
                name,
                env,
                version,
                methods,
              });
            }
          }
        }
      }
    }
    */

    return result;
  }

  /**
   * @param {string } method_selected
   */
  function methodValidation(method_selected) {
    if (!method_selected || (method_selected && method_selected.length < 2)) {
      alert("You must select a method");
      return false;
    }
    return true;
  }

  async function getApp() {
    // Lógica de autenticación aquí

    if (idapp) {
      try {
        let apps_res = await uf.get("/api/app/" + idapp, { raw: false });
        app = await apps_res.json();
        console.log(app);
        if (app) {
          appDataTable = AppToTable(app);
          console.log(appDataTable);
        }
      } catch (error) {
        // @ts-ignore
        alert(error.message);
      }
    }
  }

  tokenStore.subscribe((value) => {
    console.log("tokenStore", value);
    uf.addHeader("api-token", value);
  });

  async function saveApp() {
    try {
      let apps_res = await uf.post("/api/app/0", app);
      let rapp = await apps_res.json();
      idapp = rapp.idapp;

      await getListApps();
    } catch (error) {
      // @ts-ignore
      alert(error.message);
    }
  }

  onMount(() => {
    // uf.addHeader(tokenStore.);
    console.log(tokenStore);

    getListApps();
  });
</script>

<Level>
  <span slot="l01">
    <PredictiveInput
      bind:options
      on:select={(/** @type {{ detail: { value: number; }; }} */ e) => {
        idapp = e.detail.value;
        //getApp();
      }}
    /></span
  >
  <span slot="r01">
    <button
      class="button is-small"
      on:click={() => {
        paramDialogOneField.title = "New Application";
        paramDialogOneField.label = "Application Name";
        paramDialogOneField.inputType = "text";
        paramDialogOneField.value = "";
        paramDialogOneField.function = (value) => {
          app = { app: value, data: { namespaces: [] } };
          pageSelected = "app";
        };
        showDialogOneField = true;
      }}
    >
      <span class="icon is-small">
        <i class="fab fa-github" />
      </span>
      <span>New App</span>
    </button>
  </span>
</Level>

<div />

<div class="tabs is-small is-boxed">
  <ul>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <li class={pageSelected == "endpoint" ? "is-active" : ""}>
      <a
        on:click={() => {
          pageSelected = "endpoint";
        }}>Endpoints</a
      >
    </li>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <li class={pageSelected == "app" ? "is-active" : ""}>
      <a
        on:click={() => {
          pageSelected = "app";
        }}>App</a
      >
    </li>
  </ul>
</div>
<div class={pageSelected == "endpoint" ? "" : "is-hidden"}>
  <Table bind:RawDataTable={appDataTable} bind:columns>
    <span slot="l01"> Endpoints </span>
  </Table>
</div>
<div class={pageSelected == "app" ? "" : "is-hidden"}>
  <Level>
    <span slot="l01"> <strong>APPLICATION</strong></span>
    <span slot="r01">
      <button
        class="button is-small"
        on:click={() => {
          console.log("save", app);
          if (confirm("Do you want to save the application data?")) {
            saveApp();
          }
        }}
      >
        <span class="icon is-small">
          <i class="fab fa-github" />
        </span>
        <span>Save</span>
      </button>
    </span>
  </Level>

  {#if app}
    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label is-small">App</label>
      <div class="control">
        <input
          class="input is-small"
          type="text"
          placeholder="Text input"
          value={app.app}
        />
      </div>
    </div>

    <div class="field">
      <div class="control">
        <label class="checkbox is-small">
          <input type="checkbox" checked={app.data.enabled} />
          Enabled
        </label>
      </div>
    </div>

    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label is-small">Description</label>
      <div class="control">
        <textarea
          class="textarea is-small"
          placeholder="Description"
          bind:value={app.data.description}
        />
      </div>
    </div>

    {#if app && app.data && app.data.namespaces}
      <div class="box">
        <div class="tabs is-small is-boxed">
          <ul>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-missing-attribute -->
            {#each app.data.namespaces as namespace}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-missing-attribute -->
              <li
                class={namespaceSelected == namespace.namespace
                  ? "is-active"
                  : ""}
              >
                <a
                  on:click={() => {
                    namespaceSelected = namespace.namespace;
                  }}
                  ><span> {namespace.namespace}</span>
                  <span
                    class="icon is-small"
                    on:click={() => {
                      console.log("EDIT > ", namespaceSelected);
                    }}><i class="fa-solid fa-pen" /></span
                  >
                </a>
              </li>
            {/each}

            <li>
              <!-- svelte-ignore a11y-missing-attribute -->
              <a>
                <button
                  class="button is-small"
                  on:click={() => {
                    paramDialogOneField.title = "New Namespace";
                    paramDialogOneField.label = "Namespace";
                    paramDialogOneField.inputType = "text";
                    paramDialogOneField.value = "";
                    paramDialogOneField.function = (value) => {
                      console.log(app);

                      if (
                        app.data.namespaces.find(
                          (/** @type {any} */ element) =>
                            element.namespace == value.trim()
                        )
                      ) {
                        alert("The Namespace already exists");
                      } else {
                        app.data.namespaces.push({
                          namespace: value.trim(),
                          names: [],
                        });
                      }
                      console.log("namespace >>>", app);
                      app = app;
                    };

                    showDialogOneField = true;
                  }}
                >
                  <span class="icon is-small">
                    <i class="fa-solid fa-plus" />
                  </span>
                  <span>New Namespace</span>
                </button>
              </a>
            </li>
          </ul>
        </div>

        {#each app.data.namespaces as namespace}
          <div
            class={namespaceSelected == namespace.namespace ? "" : "is-hidden"}
          >
            <div class="box">
              <div class="tabs is-small is-boxed">
                <ul>
                  {#each namespace.names as name}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <li class={nameSelected == name.name ? "is-active" : ""}>
                      <a
                        on:click={() => {
                          nameSelected = name.name;
                        }}
                        ><span> {name.name}</span>
                        <span
                          class="icon is-small"
                          on:click={() => {
                            console.log("EDIT > ", namespaceSelected);
                          }}><i class="fa-solid fa-pen" /></span
                        >
                      </a>
                    </li>
                  {/each}

                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <li>
                    <a>
                      <button
                        class="button is-small"
                        on:click={() => {
                          paramDialogOneField.title = "New name";
                          paramDialogOneField.label = "Name";
                          paramDialogOneField.inputType = "text";
                          paramDialogOneField.value = "";
                          paramDialogOneField.function = (value) => {
                            if (
                              !namespace.names ||
                              !Array.isArray(namespace.names)
                            ) {
                              namespace.names = [];
                            }

                            if (
                              namespace.names.find(
                                (/** @type {any} */ element) =>
                                  element.name == value.trim()
                              )
                            ) {
                              alert("The name already exists");
                            } else {
                              namespace.names.push({
                                name: value.trim(),
                                versions: [],
                              });
                            }
                            app = app;
                          };
                          showDialogOneField = true;
                        }}
                      >
                        <span class="icon is-small">
                          <i class="fa-solid fa-plus" />
                        </span>
                        <span>New Name</span>
                      </button>
                    </a>
                  </li>
                </ul>
              </div>

              {#each namespace.names as name}
                <div class={nameSelected == name.name ? "box" : "is-hidden"}>
                  <div class="tabs is-small is-boxed">
                    <ul>
                      {#each name.versions as version}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <li
                          class={versionSelected == version.version
                            ? "is-active"
                            : ""}
                        >
                          <a
                            on:click={() => {
                              versionSelected = version.version;
                            }}
                            ><span>{version.version}</span>

                            <span
                              class="icon is-small"
                              on:click={() => {
                                console.log("EDIT > ", namespaceSelected);
                              }}><i class="fa-solid fa-pen" /></span
                            >
                          </a>
                        </li>
                      {/each}

                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <!-- svelte-ignore a11y-missing-attribute -->
                      <li>
                        <a>
                          <button
                            class="button is-small"
                            on:click={() => {
                              paramDialogOneField.title = "New version";
                              paramDialogOneField.label = "Version";
                              paramDialogOneField.inputType = "number";
                              paramDialogOneField.value = "0.01";
                              paramDialogOneField.function = (value) => {
                                if (
                                  !name.versions ||
                                  !Array.isArray(name.versions)
                                ) {
                                  name.versions = [];
                                }

                                if (
                                  name.versions.find(
                                    (/** @type {any} */ element) =>
                                      element.version == value
                                  )
                                ) {
                                  alert("The Version already exists");
                                } else {
                                  name.versions.push({
                                    version: value,
                                    dev: {},
                                    qa: {},
                                    prd: {},
                                  });
                                }
                                app = app;
                              };
                              showDialogOneField = true;
                            }}
                          >
                            <span class="icon is-small">
                              <i class="fa-solid fa-plus" />
                            </span>
                            <span>New Version</span>
                          </button>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {#each name.versions as version}
                    <div
                      class={versionSelected == version.version
                        ? ""
                        : "is-hidden"}
                    >
                      <div class="columns">
                        <div class="column env_class is-one-third">
                          <Level>
                            <span slot="l01">DEVELOPMENT</span>
                            <span slot="r01"
                              ><button
                                class="button is-small"
                                on:click={() => {
                                  methodSelectedDialog = "";
                                  paramDialogMethod = {
                                    title: "New Method - Development",
                                    values: {
                                      enabled: false,
                                      public: false,
                                      handler: "",
                                    },
                                    function: (/** @type {any} */ value) => {
                                      console.log("<Funcion>", value);

                                      if (methodValidation(value.method)) {
                                        if (!version.dev[value.method]) {
                                          version.dev[value.method] = {
                                            code: "",
                                            enabled: value.enabled,
                                            handler: value.handler,
                                            public: value.public,
                                          };
                                        } else {
                                          alert(
                                            "The Method " +
                                              value.method +
                                              " already exists"
                                          );
                                        }
                                      }
                                    },
                                  };
                                  showDialogMethod = true;
                                  app = app;
                                }}
                              >
                                <span class="icon is-small">
                                  <i class="fab fa-github" />
                                </span>
                                <span>New</span>
                              </button></span
                            >
                          </Level>

                          {#if version.dev}
                            <CellMethods bind:value={version.dev} />
                          {/if}
                        </div>

                        <div class="column env_class is-one-third">
                          <Level>
                            <span slot="l01">QA</span>
                            <span slot="r01"
                              ><button
                                class="button is-small"
                                on:click={() => {
                                  methodSelectedDialog = "";
                                  paramDialogMethod = {
                                    title: "New Method - Quality",
                                    values: {
                                      enabled: false,
                                      public: false,
                                      handler: "",
                                    },
                                    function: (/** @type {any} */ value) => {
                                      console.log("<Funcion>", value);

                                      if (methodValidation(value.method)) {
                                        if (!version.qa[value.method]) {
                                          version.qa[value.method] = {
                                            code: "",
                                            enabled: value.enabled,
                                            handler: value.handler,
                                            public: value.public,
                                          };
                                        } else {
                                          alert(
                                            "The Method " +
                                              value.method +
                                              " already exists"
                                          );
                                        }
                                      }
                                    },
                                  };
                                  showDialogMethod = true;
                                  app = app;
                                }}
                              >
                                <span class="icon is-small">
                                  <i class="fab fa-github" />
                                </span>
                                <span>New</span>
                              </button></span
                            >
                          </Level>
                          {#if version.qa}
                            <CellMethods bind:value={version.qa} />
                          {/if}
                        </div>

                        <div class="column env_class is-one-third">
                          <Level>
                            <span slot="l01">PRODUCTION</span>
                            <span slot="r01"
                              ><button
                                class="button is-small"
                                on:click={() => {
                                  methodSelectedDialog = "";
                                  paramDialogMethod = {
                                    title: "New Method - Production",
                                    values: {
                                      enabled: false,
                                      public: false,
                                      handler: "",
                                    },
                                    function: (/** @type {any} */ value) => {
                                      console.log("<Funcion>", value);

                                      if (methodValidation(value.method)) {
                                        if (!version.prd[value.method]) {
                                          version.prd[value.method] = {
                                            code: "",
                                            enabled: value.enabled,
                                            handler: value.handler,
                                            public: value.public,
                                          };
                                        } else {
                                          alert(
                                            "The Method " +
                                              value.method +
                                              " already exists"
                                          );
                                        }
                                      }
                                    },
                                  };
                                  showDialogMethod = true;
                                  app = app;
                                }}
                              >
                                <span class="icon is-small">
                                  <i class="fab fa-github" />
                                </span>
                                <span>New</span>
                              </button></span
                            >
                          </Level>
                          {#if version.prd}
                            <CellMethods bind:value={version.prd} />
                          {/if}
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<DialogModal
  bind:Show={showDialogOneField}
  on:ok={() => {
    paramDialogOneField.function(paramDialogOneField.value);
    showDialogOneField = false;
  }}
>
  <span slot="title">{paramDialogOneField.title}</span>

  <div slot="body">
    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label is-small">{paramDialogOneField.label}</label>
      <div class="control">
        {#if paramDialogOneField.inputType == "number"}
          <input
            class="input is-small"
            type="number"
            placeholder="input"
            min="0"
            step="0.01"
            bind:value={paramDialogOneField.value}
          />
        {:else}
          <input
            class="input is-small"
            type="text"
            placeholder="input"
            bind:value={paramDialogOneField.value}
          />
        {/if}
      </div>
    </div>
  </div>
</DialogModal>

<MethodDialog
  bind:Show={showDialogMethod}
  bind:title={paramDialogMethod.title}
  bind:method={methodSelectedDialog}
  on:ok={(e) => {
    console.log(e);
    paramDialogMethod.function(e.detail);
    showDialogMethod = false;
    app = app;
  }}
/>

<style>
  .env_class {
    border-left: outset;
    margin: 0.2em;
  }
</style>
