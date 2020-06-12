<script>
  import Button, { Label, Icon } from "@smui/button";
  import Snackbar, { Actions } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";

  import { content } from "../stores/content";

  import { game } from "../stores/game";

  let commands = [];

  let uploading = false;
  let successMessage = false;
  const addCommand = (type, action, target, args) => {
    args
      ? commands.push({ type, action, target, args })
      : commands.push({ type, action, target });
  };

  const handleSendCommandsClicked = async () => {
    uploading = true;
    commands = [];
    let code = $game.selected.libraryCode
      ? $game.selected.libraryCode + " \n"
      : " \n";
    code += $content + " \n";

    code += $game.selected.testCode;
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
    await game.setInstructions($content, commands);
    uploading = false;
    successMessage.open();
  };
</script>

<Snackbar bind:this={successMessage}>
  <Label>Upload successful. Ask the other player to run the code in Virtual Reality.</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<div class="button">
  <Button
    on:click={handleSendCommandsClicked}
    variant="outlined"
    bind:disabled={uploading}
  >
    {#if uploading}
      <Icon class="material-icons">loading</Icon>
      <Label>Uploading...</Label>
    {:else}
      <Icon class="material-icons">cloud_upload</Icon>
      <Label>Upload Code</Label>
    {/if}
  </Button>
</div>

<style>
  .button {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }
</style>
