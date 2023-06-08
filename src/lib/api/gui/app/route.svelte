<script>
  import Method from "./method.svelte";

  /**
   * @type {{ route: any; method: any; }}
   */
  export let route;
  let showMethods = false;
</script>

<div class="box">
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <span class="navbar-item">
        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field is-expanded">
              <div class="field has-addons">
                <p class="control">
                  <a class="button is-primary is-small"> Route </a>
                </p>
                <p class="control is-expanded">
                  <input
                    class="input is-small"
                    type="text"
                    placeholder="Route name"
                    bind:value={route.route}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </span>

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
      <div class="navbar-start">
        <span class="navbar-item">
          <label class="checkbox">
            <input type="checkbox" />
            Enabled
          </label>
        </span>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons is-small">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a class="button is-primary is-small">
              <strong>New Method</strong>
            </a>
          </div>
        </div>
        <div class="navbar-item">
          <div class="buttons is-small">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="button is-primary is-small"
              on:click={() => {
                showMethods = !showMethods;
              }}
            >
              <strong>Show Methods</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <div class={showMethods ? "" : "is-hidden"}>
    <div class="table-container is-size-7">
      <table
        class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
      >
        <tr>
          <th>Development</th>
          <th>Quality</th>
          <th>Producction</th>
        </tr>

        {#each route.method as method}
          <tr>
            <td
              >{#if method.env == "dev"}
                <Method bind:method />
              {/if}
            </td>

            <td
              >{#if method.env == "qa"}
                <Method bind:method />
              {/if}</td
            >

            <td
              >{#if method.env == "prd"}
                <Method bind:method />
              {/if}</td
            >
          </tr>
        {/each}
      </table>
    </div>
  </div>
</div>
