<script>
  import { onMount } from "svelte";
  import { game } from "../stores/game";

  let AgoraRTC;
  let connected = false;

  onMount(async () => {
    AgoraRTC = await import("agora-rtc-sdk");
    createClient($game);
  });

  const rtc = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    params: {}
  };

  // Options for joining a channel
  const option = {
    appID: "629756ef5ef440de9c279602f914b39c",
    channel: "video_chat",
    uid: null,
    token: null
  };

  let remoteStreamContainer, remoteStreamCanvas;

  const startVideoRenderer = () => {
    const video = remoteStreamContainer.querySelector("video");
    if (!video) {
      setTimeout(() => startVideoRenderer(), 500);
      return;
    }

    const ctx = remoteStreamCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    const cw = Math.floor(remoteStreamCanvas.clientWidth);
    const ch = Math.floor(remoteStreamCanvas.clientHeight);

    remoteStreamCanvas.width = cw;
    remoteStreamCanvas.height = ch;

    ctx.drawImage(video, 0, 0, cw, ch);

    var imageData = ctx.getImageData(
      0,
      0,
      remoteStreamCanvas.width,
      remoteStreamCanvas.height
    );
    var depth = 8;

    var data = imageData.data;

    //Matrix
    var threshold_map_4x4 = [
      [1, 9, 3, 11],
      [13, 5, 15, 7],
      [4, 12, 2, 10],
      [16, 8, 14, 6]
    ];

    //imageData
    var width = imageData.width;
    var height = imageData.height;
    var pixel = imageData.data;
    var x, y, a, b;

    //filter
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        a = (x * height + y) * 4;
        b = threshold_map_4x4[x % 4][y % 4];
        pixel[a + 0] = (((pixel[a + 0] + b) / depth) | 0) * depth;
        pixel[a + 1] = (((pixel[a + 1] + b) / depth) | 0) * depth;
        pixel[a + 2] = (((pixel[a + 2] + b) / depth) | 0) * depth;
        pixel[a + 3] = (((pixel[a + 3] + b) / depth) | 0) * depth;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    remoteStreamContainer.style.zIndex = -10;

    setTimeout(() => startVideoRenderer(), 500);
  };

  const createClient = $game => {
    if (!$game && !$game.id) return;
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    rtc.client.init(
      $game.appID,
      () => {
        console.log("Init Success");
        rtc.client.join(
          null,
          $game.id,
          null,
          uid => {
            console.log("Joined Channel " + $game.id + ". UID: " + uid);

            rtc.params.uid = uid;
            rtc.localStream = AgoraRTC.createStream({
              streamID: rtc.params.uid,
              audio: true,
              video: true,
              screen: false
            });

            rtc.localStream.init(
              () => {
                console.log("Local stream initialized");
                startVideoRenderer();
                rtc.localStream.play(
                  "local-stream",
                  { fit: "contain" },
                  errState => {
                    if (errState && errState.status !== "aborted") {
                      console.error(
                        "Error while playing local stream",
                        errState
                      );
                    }
                  }
                );
                connected = true;
                rtc.client.publish(rtc.localStream, err => {
                  console.log("Publish Failed", err);
                });
              },
              err => {
                console.error("init local stream failed ", err);
              }
            );
          },
          err => {
            console.error("Failed to join the channel", err);
          }
        );
      },
      err => {
        console.error("Failed to init client ", err);
      }
    );
    rtc.client.on("stream-added", e => {
      const remoteStream = e.stream;
      const id = remoteStream.getId();
      if (id !== rtc.params.uid) {
        rtc.client.subscribe(remoteStream, err => {
          console.log("stream subscribe failed", err);
        });
      }
      console.log("stream-added remote-uid: " + id);
    });

    rtc.client.on("stream-subscribed", e => {
      const remoteStream = e.stream;
      const id = remoteStream.getId();
      remoteStreamContainer.innerHTML = "";
      remoteStream.play("remote-stream", { fit: "contain" }, errState => {
        if (errState && errState.status !== "aborted") {
          console.error("Error while playing remote stream", errState);
        }
      });
      rtc.remoteStreams.push(remoteStream);
    });
  };

  const leaveCall = () => {
    rtc.client.leave(
      () => {
        rtc.localStream.stop();
        rtc.localStream.close();

        while (rtc.remoteStreams.length > 0) {
          const stream = rtc.remoteStreams.shift();
          const id = stream.getId();
          stream.stop();
        }
        remoteStreamContainer.innerHTML = "";
        connected = false;
      },
      err => {
        console.error("Failed to leave the channel");
      }
    );
  };
</script>

<section class="video-call">
  <div style="position: relative">
    <div id="local-stream" />
    <!-- ToDo Detect Firefox and rotate the video around if yes. -->
    <div id="remote-stream" bind:this={remoteStreamContainer} />
    <canvas bind:this={remoteStreamCanvas} />
  </div>
</section>

<style>
  canvas {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 9998;
    width: 100%;
    height: 100%;
    transform: scaleY(-1);
  }
  #local-stream {
    width: 20%;
    height: 20%;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 9999;
  }

  #remote-stream {
    transform: scaleX(-1) rotate(180deg);
    z-index: -10 !important;
  }

  #remote-stream video {
    z-index: -1000;
  }

  .video-call {
    position: relative;
    display: grid;
    margin: auto;
    width: 100%;
    height: 100%;
    grid-auto-columns: 1fr;
  }
</style>
