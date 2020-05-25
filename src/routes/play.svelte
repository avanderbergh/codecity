<script>
  import Nav from "../components/Nav.svelte";
  import MonacoEditor from "../components/MonacoEditor.svelte";
  import VideoCall from "../components/VideoCall.svelte";
  import Instructions from "../components/Instructions.svelte";
  import DataConnection from "../components/DataConnection.svelte";
  import { game } from "../stores/game";
  export let params;
  let currentObject;
</script>

<Nav />

<div class="layout">
  <div class="editor">
    <MonacoEditor />
  </div>
  <div class="video">
    <VideoCall />
  </div>
  <div class="instructions">
    <Instructions {currentObject} />
    <p>{JSON.stringify($game)}</p>
  </div>
</div>
<DataConnection {currentObject} />

<style>
  .layout {
    display: grid;
    height: calc(100% - 49px);
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
    border-left: solid #42c6ff 1px;
  }

  .video {
    grid-area: video;
    border-bottom: solid #42c6ff 1px;
  }

  .instructions {
    grid-area: instructions;
  }
</style>
