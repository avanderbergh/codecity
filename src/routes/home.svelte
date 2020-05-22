<script>
  import { link } from "svelte-spa-router";
  import SignIn from "../components/SignIn.svelte";
</script>

<h1>Home</h1>

<a use:link href="/editor">Editor</a>
<a use:link href="/call">Call</a>

<SignIn/>