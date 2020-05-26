<script>
  import { onMount } from "svelte";
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon/index";
  import { firestore } from "../lib/firebase";
  import { push, pop, replace } from "svelte-spa-router";
  import { game } from "../stores/game";

  let code = "";
  let loaded = false;
</script>

<div class="join-backdrop">
  <div class="join-container">
    <div class="box">
      <div class="code">
        <ol class="steps-list">
          <li>Download the Oculus Quest App from SideQuest.</li>
          <li>Launch the App and start a new game.</li>
          <li>Read the code.</li>
        </ol>
        <a
          href="https://sdq.st/a/1054"
          target="_blank"
          style="text-align: center; display: block;"
        >
          <img
            src="images/sidequest.png"
            alt="SideQuest Button"
            class="sidequest"
          />
        </a>
      </div>
      <input
        class="code-input code"
        type="text"
        name="code"
        bind:value={code}
        placeholder="enter code"
      />
      <div class="button-container">
        <button class="button code" on:click={push(`/play/${code}`)}>
          Join Game
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .steps-list {
    line-height: 3vw;
    font-size: 1.5vw;
  }
  .join-backdrop {
    width: 100%;
    height: 100%;
    position: relative;
    background: url("images/cover.jpg");
    background-size: cover;
    background-position: center;
    display: grid;
  }
  .join-container {
    backdrop-filter: blur(10px) brightness(50%);
    width: 80%;
    height: 80%;
    display: grid;
    padding: 2rem;
    margin: auto;
  }

  .box {
    margin: auto;
    padding: 2rem;
  }

  .code {
    font-family: "Press Start 2P";
  }

  .code-input {
    background: transparent;
    border: none;
    border-bottom: solid var(--theme-primary) 3px;
    color: var(--theme-secondary);
    font-size: 5vw;
    text-align: center;
    width: 100%;
    caret-color: var(--theme-on-secondary);
    outline: none;
    transition: border-bottom 2s;
  }

  .code-input:focus {
    border-bottom: solid var(--theme-primary) 6px;
  }

  .button-container {
    text-align: center;
  }

  .button {
    padding: 1em 0.5em;
    font-size: 2.5vw;
    background: linear-gradient(var(--theme-primary), var(--theme-secondary));
    color: var(--theme-on-primary);
    border: none;
    transition: box-shadow 0.5s;
    cursor: pointer;
  }

  .button:hover {
    box-shadow: 0 0 10px var(--theme-on-secondary);
  }

  .sidequest {
    width: 20vw;
  }
</style>
