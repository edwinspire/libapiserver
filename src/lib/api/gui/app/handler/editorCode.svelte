<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { EditorView, basicSetup } from "codemirror";
  import { Compartment } from "@codemirror/state";
  import { javascript } from "@codemirror/lang-javascript";
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
  export let lang = "txt";
  //let internalCode;

  $: code, setCode();

  // Obtener los cambios del código
  export function getCode() {
    code = editor.state.doc.toString();
    console.warn(editor.state.doc, code);
    return code;
  }

  function setCode() {
    //  console.log("setCode >>> ");
    let c = code;
    if (lang == "json") {
      c = FormatJson(code);
    }

    if (editor) {
      const transaction = editor.state.update({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: c,
        },
      });
      editor.dispatch(transaction);
    }
  }

  function FormatJson() {
    if (lang == "json") {
      try {
        return JSON.stringify(JSON.parse(code), null, 2);
      } catch (error) {
        return JSON.stringify({}, null, 2);
      }
    } else {
      return code;
    }
  }

  onMount(() => {
    let extensions = [basicSetup];
    let internalCode = FormatJson();

    if (lang == "sql") {
      //internalCode = FormatJson(code);
      extensions = [basicSetup, languageConf.of(sql())];
    } else if (lang == "json") {
      // internalCode = FormatJson(code);
      extensions = [basicSetup, languageConf.of(json())];
    } else if (lang == "js") {
      extensions = [
        basicSetup,
        languageConf.of(javascript()),
        //    linter(esLint()),
      ];
    }

    //    console.log("onMount: ", code, internalCode);

    editor = new EditorView({
      doc: internalCode,
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

{#if $$slots.message}
  <slot name="message" />
{/if}

<div class="box" bind:this={txta} />
