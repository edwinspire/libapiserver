<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { EditorView, basicSetup } from "codemirror";
  import { Compartment } from "@codemirror/state";
  import { javascript } from "@codemirror/lang-javascript";
  import { sql } from "@codemirror/lang-sql";
  import { json } from "@codemirror/lang-json";

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
    let c = FormatJson(editor.state.doc.toString());
    //console.warn('>>> getCode >>>>>>>', editor.state.doc, c, editor.state.doc.toString());
    return c;
  }

  function setCode() {
    if (!editor) {
      createEditor();
    }

    let c = FormatJson(code);

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

  function FormatJson(c) {
    if (lang == "json") {
      try {
        return JSON.stringify(JSON.parse(c), null, 2);
      } catch (error) {
        console.error(error, c);
        return JSON.stringify({}, null, 2);
      }
    } else {
      return c;
    }
  }

  function createEditor() {
    let extensions = [basicSetup];
    let internalCode = FormatJson(code);

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

    editor = new EditorView({
      doc: internalCode,
      extensions: extensions,
      parent: txta,
    });
  }

  onMount(() => {
    createEditor();
  });
</script>

{#if $$slots.message}
  <slot name="message" />
{/if}

<div class="box" bind:this={txta} />
