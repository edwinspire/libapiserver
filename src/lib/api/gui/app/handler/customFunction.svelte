<script>
  import { onMount } from "svelte";
  import SelectHandlers from "../../widgets/Select.svelte";
  import { listFunctionStore } from "../../utils";

  /**
   * @type {any[]}
   */
  let functions = [];

  /**
   * @type {any}
   */
  export let code;

  export function getCode() {
    //fnEditorCode.apply();
    return code;
  }

  listFunctionStore.subscribe((value) => {
    // @ts-ignore
    functions = value;
  });

  onMount(() => {
    console.log(code);
  });
</script>

<div>
  <div class="content is-small">
    Use the selected function to return a response.
  </div>

  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label is-small">Function</label>
    </div>
    <div class="field-body">
      <div class="field is-narrow">
        <SelectHandlers bind:options={functions} bind:option={code} />
      </div>
    </div>
  </div>
</div>
