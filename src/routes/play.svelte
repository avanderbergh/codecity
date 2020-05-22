<script>
  import MonacoEditor from "../components/MonacoEditor.svelte";
  import VideoCall from "../components/VideoCall.svelte";
  import Instructions from "../components/Instructions.svelte";
  export let params;
  let content;
</script>

<div class="layout">
  <div class="editor">
    <MonacoEditor {content} />
  </div>
  <div class="video">
    <VideoCall />
  </div>
  <div class="instructions">
    <Instructions />
  </div>
</div>

<style>
  .layout {
    display: grid;
    height: 100%;
    grid-template-areas:
      "video        editor"
      "instructions editor";
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  .layout > div {
    height: 100%;
  }

  .editor {
    grid-area: editor;
  }

  .video {
    grid-area: video;
  }

  .instructions {
    grid-area: instructions;
  }
</style>
