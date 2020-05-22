<script>
  import { onMount } from "svelte";
  import * as firebaseui from "firebaseui";
  import firebase from "firebase";
  import { auth } from "../lib/firebase";

  const uiConfig = {
    signInSuccessUrl: "#/join",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],

    tosUrl: "<your-tos-url>",
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
      window.location.assign("<your-privacy-policy-url>");
    }
  };

  onMount(async () => {
    const ui = new firebaseui.auth.AuthUI(auth);
    ui.start("#firebase-auth-ui", uiConfig);
  });
</script>

<div id="firebase-auth-ui" />
