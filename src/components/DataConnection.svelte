<script>
  import { onMount } from "svelte";
  import { firestore } from "../lib/firebase";
  import Button, { Label, Icon } from "@smui/button";

  import { content } from "../stores/content";
  import { selectedObject } from "../stores/selectedObject.js";

  let commands = [];
  const addCommand = (type, action, target, args) => {
    args
      ? commands.push({ type, action, target, args })
      : commands.push({ type, action, target });
  };

  const door = {
    locked: true,
    open: () => {
      addCommand("door", "open", "Door");
    }
  };

  const drone = {
    move: (direction, distance) => {
      const args = "" + direction + "," + distance;
      addCommand("drone", "move", "Drone", args);
    },
    aim: target => {
      addCommand("drone", "aim", "Drone", target);
    },
    fire: force => {
      addCommand("drone", "fire", "Drone", force + "");
    }
  };

  onMount(async () => {
    firestore
      .collection("instructions")
      .doc("object")
      .onSnapshot(doc => {
        console.log("hello", doc.data());
        if (doc.exists) {
          const instructions = { id: doc.id, ...doc.data() };
          selectedObject.set(instructions);
          content.set(instructions.currentCode);
          console.log("content set to ", $content);
        }
      });
  });

  const handleSendCommandsClicked = async () => {
    commands = [];
    let code = $selectedObject.libraryCode
      ? $selectedObject.libraryCode + " \n"
      : " \n";
    code += $content + " \n";

    code += $selectedObject.testCode;
    console.log("Executing", code);
    const oldConsole = console;
    console = {
      log: arg => {
        addCommand("monitor", "log", "Monitor", arg);
      }
    };
    eval(code);
    console = oldConsole;
    console.log("commands", commands);
    await firestore
      .collection("instructions")
      .doc("test")
      .set({ instructions: commands });
    console.log("Instructions set");
  };
</script>

<div class="button">
  <Button on:click={handleSendCommandsClicked} variant="outlined">
    <Icon class="material-icons">cloud_upload</Icon>
    <Label>Upload Code</Label>
  </Button>
</div>

<style>
  .button {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }
</style>
