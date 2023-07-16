<script>
  // @ts-nocheck

  import FetchCode from "./handler/fetch.svelte";
  import JsCode from "./handler/js.svelte";
  import SoapCode from "./handler/soap.svelte";
  import SqlCode from "./handler/sql.svelte";

  /**
   * @type {any}
   */
  export let value;
  export const row = {};
  export let props = {};
  let methodSelected = "";

  const classMap = {
    GET: "tag is-success",
    POST: "tag is-info",
    DELETE: "tag is-danger",
    PUT: "tag is-warning",
    PATCH: "tag is-link",
    HEADER: "tag is-primary",
  };
</script>

<td>
  <div class="field is-grouped is-grouped-multiline space">
    {#if value}
      {#each Object.keys(value) as attr}
        <div class="control">
          <div class="tags has-addons">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class={value[attr]
                ? "tag is-dark has-text-success"
                : "tag is-dark has-text-danger"}
              on:click={() => {
                value[attr] = !value[attr];
              }}
              ><i
                class={value[attr] ? "fa-solid fa-check" : "fa-solid fa-xmark"}
              /></a
            >
            <span class="tag is-link">{attr}</span>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</td>

<style>
  .space {
    margin: 0.5em;
  }
</style>
