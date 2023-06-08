<script>
  import { onMount } from "svelte";
  import EditorCode from "./editorCode.svelte";
  import EditorCode2 from "./editorCode.svelte";

  /**
   * @type {any}
   */
  export let code;
  /**
   * @type {EditorCode}
   */
  let fnEditorCode;

  /**
   * @type {EditorCode}
   */
  let fnEditorCode2;

  let params_code = "{}";
  let query_code = "SELECT 1+1;";
  $: code, ParseCode;

  function ParseCode() {
    try {
      let params = JSON.parse(code);

      if (params && params.query) {
        query_code = params.query;
        // @ts-ignore
        delete params.query;
      }

      params_code = JSON.stringify(params);
    } catch (error) {
      params_code = "{}";
      query_code = "SELECT 1;";
      console.error("Error", error);
    }
  }

  export function getCode() {
    //fnEditorCode.apply();
    let p = fnEditorCode.getCode();
    let q = fnEditorCode2.getCode();

    try {
      let c = JSON.parse(p);
      c.query = q;
      return JSON.stringify(c, null, 2);
    } catch (error) {
      console.error("No se pudo parsear", error);
      return code;
    }
  }

  onMount(() => {
    console.log(code);
    ParseCode();
  });
</script>

<div>
  Parametros:
  <EditorCode lang="json" bind:code={params_code} bind:this={fnEditorCode} />
</div>

<div>
  Query:
  <EditorCode2 lang="sql" bind:code={query_code} bind:this={fnEditorCode2} />
</div>
