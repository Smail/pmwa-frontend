<template>
  <nav-bar-logged-in v-if="$store.state.isLoggedIn" class="logged-in"></nav-bar-logged-in>
  <nav-bar-logged-out v-else class="logged-out"></nav-bar-logged-out>
</template>

<style lang="scss">
@import "@/scss/globals.scss";

.navbar {
  display: inline-flex;
  background: $bg;
  border-radius: 1rem;
  padding: 1rem;
  color: $color;

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
};
</script>
