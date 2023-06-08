<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { EditorView, basicSetup } from "codemirror";
  import { Compartment } from "@codemirror/state";
  import { javascript, esLint } from "@codemirror/lang-javascript";
  import { sql } from "@codemirror/lang-sql";
  import { json } from "@codemirror/lang-json";
  //import { linter } from "@codemirror/lint";
  
  const languageConf = new Compartment();

  /**
   * @type {EditorView}
   */
  let editor;

  /**
   * @type {HTMLTextAreaElement}
   */
  let txta;
  /**
   * @type {any}
   */
  export let code;
  export let lang = "js";

  // Obtener los cambios del código
  export function apply() {
    code = editor.state.doc.toString();
    console.log(editor.state.doc, code);
  }

  onMount(() => {
    let extensions = [basicSetup];

    if (lang == "sql") {
      extensions = [basicSetup, languageConf.of(sql())];
    } else if (lang == "json") {
      extensions = [basicSetup, languageConf.of(json())];
    } else if (lang == "js") {
      extensions = [
        basicSetup,
        languageConf.of(javascript()),
    //    linter(esLint()),
      ];
    }

    editor = new EditorView({
      doc: code,
      extensions: extensions,
      parent: txta,
    });

    /*
      editor.contentDOM.addEventListener("input", () => {
        console.log("Contenido actualizado:");
      });
      */

    // console.log(editor.contentDOM);
  });
</script>

<div bind:this={txta} />
