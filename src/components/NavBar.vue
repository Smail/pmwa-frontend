<template>
  <nav-bar-logged-in v-if="$store.state.isLoggedIn" class="logged-in"></nav-bar-logged-in>
  <nav-bar-logged-out v-else class="logged-out"></nav-bar-logged-out>
</template>

<style lang="scss">
.navbar {
  display: inline-flex;
  background-color: whitesmoke;
  border-radius: 1rem;
  padding: 1rem;

  hr {
    height: 1px;
    background-color: currentColor;
    border-radius: 1rem;
    border: none;
    margin: 0.5rem 0;
  }

  .links {
    flex: 1;
    list-style: none;
    display: flex;
    // Inherit values so that we can easily change the direction of the flexbox.
    flex-direction: inherit;
    justify-content: inherit;
    align-items: stretch;
    margin: 0;
    padding: 0;
    gap: 0.25rem;

    .menu {
      text-transform: capitalize;
      display: flex;

      & .router-link-exact-active {
        color: white;
        background-color: rgb(0, 122, 255);
        box-shadow: 0 0 0.1rem black;
      }

      a {
        flex: 1;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: all 200ms;
      }

      a:hover {
        color: white;
        background-color: rgb(106, 178, 255);
        box-shadow: 0 0 0.25rem black;
      }
    }
  }
}
</style>

<script>
import NavBarLoggedIn from "@/components/navbar/NavBarLoggedIn";
import NavBarLoggedOut from "@/components/navbar/NavBarLoggedOut";

export default {
  name: "NavBar",
  components: { NavBarLoggedOut, NavBarLoggedIn },
}
</script>
