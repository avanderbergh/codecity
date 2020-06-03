<script>
  import Button, { Label, Icon } from "@smui/button";

  import { content } from "../stores/content";

  import { game } from "../stores/game";

  let commands = [];
  const addCommand = (type, action, target, args) => {
    args
      ? commands.push({ type, action, target, args })
      : commands.push({ type, action, target });
  };

  const handleSendCommandsClicked = async () => {
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
    await game.setInstructions(commands);
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
