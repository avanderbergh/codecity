<script>
  import { selectedObject } from "../stores/selectedObject.js";
</script>

<div class="container">
  {#if $selectedObject}
    <h1>{$selectedObject.name}</h1>
    <p>{$selectedObject.methods}</p>
  {/if}
</div>

<style>
  .container {
    font-family: "Press Start 2P", cursive;
  }
</style>
