<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import EditorCode from "./editorCode.svelte";

  export let code;
  let fnEditorCode;
  let instrucions = `// Predefined variables<br/>
      let RETURN_DATA = {};  // Variable that returns the return of the function<br/>
      let $_UFETCH_ = {}; // Instance of the uFetch class<br>
  let $_REQUEST_ = {}; // Represents the HTTP request received by the server. Contains information about the request made by the client, such as URL parameters, headers, body data, and more.<br>
  `;

  export function getCode() {
    //    console.log(">> getCode en JS.SVELTE ", );
    return fnEditorCode.getCode();
  }

  onMount(() => {});
</script>

<EditorCode lang="js" bind:code bind:this={fnEditorCode} {instrucions} />
