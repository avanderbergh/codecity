<script>
  import { onMount } from "svelte";

  let AgoraRTC;
  let connected = false;

  onMount(async () => {
    AgoraRTC = await import("agora-rtc-sdk");
    createClient();
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

  let remoteStreamContainer;

  const createClient = () => {
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    rtc.client.init(
      option.appID,
      () => {
        console.log("Init Success");
        rtc.client.join(
          null,
          option.channel,
          null,
          uid => {
            console.log("Joined Channel " + option.channel + ". UID: " + uid);

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
  </div>
</section>

<style>
  #local-stream {
    width: 20%;
    height: 20%;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 9999;
  }

  #remote-stream {
    width: 100%;
    height: 100%;
    transform: scaleX(-1);
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
