<script>
  import { onMount } from "svelte";
  import Button from "@smui/button";
  import { themeData, editorOptions } from "../config/monaco";
  import { content } from "../stores/content";
  let monaco, attach, monacoContainer, editor;

  onMount(async () => {
    monaco = await import("monaco-editor");
    monaco.editor.defineTheme("codecity", themeData);
    editor = monaco.editor.create(attach, editorOptions);
    editor.layout();
    editor.getModel().onDidChangeContent(handleContentsChanged);
    content.subscribe($content => {
      console.log("$content", $content);
      if ($content) editor.getModel().setValue($content);
    });
  });

  const handleContentsChanged = e => {
    const code = editor.getModel().getValue();
    if ($content != code) content.set(code);
  };

  const handleResize = () => {
    console.log("Resize");
    if (editor) {
      monacoContainer.style.height = "0";
      monacoContainer.style.width = "0";
      editor.layout();
      monacoContainer.style.height = "";
      monacoContainer.style.width = "";
      editor.layout();
    }
  };
</script>

<svelte:window on:resize={handleResize} />

<section class="monaco-container" bind:this={monacoContainer}>
  <div class="monaco" bind:this={attach} />
</section>

<style>
  .monaco-container {
    height: 100%;
    overflow: hidden;
  }
  .monaco {
    height: 100%;
  }
</style>
