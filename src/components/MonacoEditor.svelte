<script>
  let container, section, editor, monaco;
  import Button from "@smui/button";
  import("monaco-editor").then(module => {
    monaco = module;

    editor = monaco.editor.create(container, {
      value: "//Hello",
      language: "javascript"
    });
    editor.layout();
  });
  const handleResize = () => {
    console.log("Resize");
    if (editor) {
      section.style.height = "0px";
      editor.layout();
      section.style.height = "";
      editor.layout();
    }
  };
</script>

<style>
  h1 {
    color: blue;
  }
  .section {
    height: 50%;
  }
  .monaco-container {
    height: 100%;
  }
</style>

<svelte:window on:resize={handleResize} />

<h1>Monaco</h1>
<Button>Hello</Button>
<section class="section" bind:this={section}>
  <div class="monaco-container" bind:this={container} />
</section>
