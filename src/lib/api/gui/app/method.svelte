<script>
  import { DialogModal } from "@edwinspire/svelte-components";
  import { createEventDispatcher } from "svelte";
  import { listHandlerStore, listMethodStore } from "../utils.js";
  import SelectMethods from "../widgets/Select.svelte";
  import SelectHandlers from "../widgets/Select.svelte";

  const dispatch = createEventDispatcher();

  /**
   * @type {any[]}
   */
  let methods = [];

  /**
   * @type {any[]}
   */
  let handlers = [];

  export let method = "";
  export let handler = "js";
  export let enabled = false;
  export let ispublic = false;

  export let Show = false;
  export let title = "Method";

  listMethodStore.subscribe((value) => {
    console.log("listMethodStore ->>>>", value);
    // @ts-ignore
    methods = value;
  });

  listHandlerStore.subscribe((value) => {
    console.log("listHandlerStore ->>>>", value);
    // @ts-ignore
    handlers = value;
  });
</script>

<DialogModal
  bind:Show
  on:ok={() => {
    if (method && method.length) {
      dispatch("ok", {
        method: method,
        handler: handler,
        enabled: enabled,
        public: ispublic,
      });
    } else {
      alert("You must select a method");
    }
  }}
>
  <span slot="title">{title}</span>

  <div slot="body">
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label is-small">Method</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <SelectMethods bind:options={methods} bind:option={method} />
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-small">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">Enabled</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" bind:checked={enabled} />
            </label>
          </div>
        </div>
      </div>
    </div>

    {#if method !== "WS" && method !== "MQTT"}
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label is-small">Handler</label>
        </div>
        <div class="field-body">
          <div class="field is-narrow">
            <SelectHandlers bind:options={handlers} bind:option={handler} />
          </div>
        </div>
      </div>
    {/if}

    <div class="field is-horizontal">
      <div class="field-label">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label is-small">Public</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" bind:checked={ispublic} />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</DialogModal>
