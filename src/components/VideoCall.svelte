<script>
  import { onMount } from "svelte";

  let AgoraRTC;
  onMount(async () => {
    AgoraRTC = await import("agora-rtc-sdk");
  });
</script>

<div class="container">
  <h1>AgoraRTC</h1>
</div>
