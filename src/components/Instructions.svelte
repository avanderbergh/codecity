<script>
  import { game } from "../stores/game";
</script>

<div class="container">
  {#if $game && $game.selected}
    <h1>{$game.selected.name}</h1>
    <p>{$game.selected.methods}</p>
    
  {/if}
</div>

<style>
  .container {
    font-family: "Press Start 2P", cursive;
  }
</style>
