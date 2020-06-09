<script>
  import { tick } from "svelte";
  import { spring } from "svelte/motion";
  import { link } from "svelte-spa-router";
  import SignIn from "../components/SignIn.svelte";
  import HeroImage from "../components/HeroImage.svelte";

  let scrollY, outerHeight, video;
  let animating = false;

  let currentTime = spring(10, {
    stiffness: 0.01,
    damping: 0.1
  });

  $: (async () => {
    if (video) {
      video.currentTime = (scrollY / outerHeight) * 20;
    }
  })();
</script>

<svelte:window bind:scrollY bind:outerHeight />

<main>
  <section id="video-scroll">
    <video
      src="images/intro.webm"
      preload="auto"
      autobuffer
      bind:this={video}
    />
    <div id="scroll-indicator">
      <h1>--- Scroll to Begin ---</h1>
    </div>
  </section>
  <section id="sign-in">
    <HeroImage />
    <div class="cover">
      <div class="box">
        <div class="logo">
          <img src="images/MainLogo.svg" alt="Logo" />
        </div>
        <SignIn />
      </div>
    </div>
  </section>
</main>

<style>
  .cover {
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

  #video-scroll {
    height: 250vh;
    width: 100%;
    display: grid;
    justify-content: center;
    position: relative;
    text-align: center;
  }

  #video-scroll video {
    position: sticky;
    object-fit: cover;
    object-position: center;
    z-index: 9999998;
    top: 0;
    width: 100vw;
    height: 100vh;
  }

  #scroll-indicator {
    width: 100vw;
    height: 100vh;
    position: absolute;
  }

  #video-scroll h1 {
    z-index: 9999999;
    bottom: 10vh;
    position: absolute;
    text-align: center;
    width: 100%;
    font-family: "Press Start 2P";
    color: #ff0081;
  }

  #sign-in {
    position: relative;
    height: 100vh;
  }
</style>
