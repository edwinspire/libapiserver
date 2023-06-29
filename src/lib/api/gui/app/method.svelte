<script>
  import { DialogModal } from "@edwinspire/svelte-components";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let methods = [
    { id: "CONNECT", text: `CONNECT` },
    { id: "GET", text: `GET` },
    { id: "DELETE", text: `DELETE` },
    { id: "HEAD", text: `HEAD` },
    { id: "PATCH", text: `PATCH` },
    { id: "POST", text: `POST` },
    { id: "PUT", text: `PUT` },
    { id: "WS", text: `WS` },
  ];

  let handlers = [
    { id: "fetch", text: `FETCH` },
    { id: "js", text: `JS` },
    { id: "soap", text: `SOAP` },
    { id: "sql", text: `SQL` },
  ];

  export let method = "";
  export let handler = "js";
  export let enabled = false;
  export let ispublic = false;

  export let Show = false;
  export let title = "Method";
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
          <div class="control">
            <div class="select is-fullwidth is-small">
              <select
                bind:value={method}
                disabled={method.length > 0 ? true : false}
              >
                {#each methods as m}
                  <option value={m.id}>
                    {m.text}
                  </option>
                {/each}
              </select>
            </div>
          </div>
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

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label is-small">Handler</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <div class="select is-fullwidth is-small">
              <select bind:value={handler}>
                {#each handlers as h}
                  <option value={h.id}>
                    {h.text}
                  </option>
                {/each}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

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
