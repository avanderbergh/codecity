<script>
  import Router from "svelte-spa-router";

  import UserObserver from "./components/UserObserver.svelte";

  import home from "./routes/home.svelte";
  import join from "./routes/join.svelte";
  import play from "./routes/play.svelte";
  import notFound from "./routes/notFound.svelte";

  const routes = {
    "/": home,
    "/join": join,
    "/play/:code": play,
    "*": notFound
  };
</script>

<UserObserver />

<Router {routes} />
