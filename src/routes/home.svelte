<script>
  import { link } from "svelte-spa-router";
  import SignIn from "../components/SignIn.svelte";
</script>

<div class="cover">
  <div class="box">
    <div class="logo">
      <h1 class="logo-text" data-text="code city">code<br/>city</h1>
    </div>
    <SignIn />
  </div>
</div>

<style>
  .cover {
    background-image: url("/images/cover.jpg");
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
    position: relative;
    width: 100%;
  }

  .logo {
    position: relative;
    height: 50vh;
    width: 100%;
    text-align: center;
  }

  .logo-text {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    font-size: 8vw;
    font-family: "Press Start 2P", cursive;
    color: #ffd319;
    animation-name: logo-animation;
    animation-duration: 4s;
    animation-iteration-count: infinite;
  }

  .logo-text:hover {
    animation-duration: 2ms;
    animation-name: logo-animation-hover;
  }

  @keyframes logo-animation-hover {
    0% {
      text-shadow: 0.5vw 0.5vw 0 #ff0081, -0.5vw -0.5vw 0 #42c6ff;
    }
    25% {
      text-shadow: 0 0.5vw 0 #ff0081, 0.5vw -0.5vw 0 #42c6ff;
    }
    50% {
      text-shadow: 0 0 0 #ff0081, 0 0 0 #42c6ff;
    }
    75% {
      text-shadow: -0.5vw 0 0 #ff0081, 0.5vw 0 0 #42c6ff;
    }
    100% {
      text-shadow: -0.5vw -0.5vw 0 #ff0081, 0.5vw 0.5vw 0 #42c6ff;
    }
  }

  @keyframes logo-animation {
    0% {
      text-shadow: none;
    }
    96% {
      text-shadow: none;
    }
    97% {
      text-shadow: 0 0.5vw 0 #ff0081, 0.5vw -0.5vw 0 #42c6ff;
    }
    98% {
      text-shadow: 0 0 0 #ff0081, 0 0 0 #42c6ff;
    }
    99% {
      text-shadow: -0.5vw 0 0 #ff0081, 0.5vw 0 0 #42c6ff;
    }
    100% {
      text-shadow: -0.5vw -0.5vw 0 #ff0081, 0.5vw 0.5vw 0 #42c6ff;
    }
  }
</style>
