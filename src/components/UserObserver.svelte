<script>
  import { auth } from "../lib/firebase";
  import { user } from "../stores/user";

  auth.onAuthStateChanged(authResponse => {
    authResponse
      ? user.set({
          name: authResponse.displayName,
          email: authResponse.email
        })
      : user.set(null);
  });
</script>
