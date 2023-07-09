<script>
  import { createEventDispatcher } from "svelte";

  // Crea el despachador de eventos
  const dispatch = createEventDispatcher();

  function handleClick() {
    // Despacha el evento personalizado con los datos deseados
    dispatch("select", { value: option });
  }
export let options = [{ id: "TEST", value: `TEST`, enabled: true }];

  export let option = "";
</script>

<div class="control">
  <div class="select is-fullwidth is-small">
    <select bind:value={option} on:select={handleClick}>
      {#each options as h}
        <option value={h.id}>
          {h.value}
        </option>
      {/each}
    </select>
  </div>
</div>
