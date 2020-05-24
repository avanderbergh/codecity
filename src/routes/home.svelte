<script>
  import { link } from "svelte-spa-router";
  import SignIn from "../components/SignIn.svelte";
</script>

<div class="cover">
  <div class="box">
    <h1 class="logo-text">code<br/>city</h1>
    <SignIn />
  </div>
</div>

<style>
  .cover {
    background-image: url("/images/cover3.jpg");
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    display: grid;
  }

  .box {
    margin: auto;
    display: block;
    text-align: center;
  }

  .logo-text {
    font-family: "Press Start 2P";
    font-size: 8vw;
    color: var(--theme-primary);
  }
</style>
