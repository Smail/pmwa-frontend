<template>
  <nav class="navbar">
    <ul class="links">
      <li v-for="{ icon, name, routeName } in menu" class="menu">
        <sidebar-link :icon="icon" :name="name" :route-name="routeName"></sidebar-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import SidebarLink from "@/components/navbar/SidebarLink";

export default {
  name: "NavBar",
  components: { SidebarLink },
  data() {
    return {
      menu: [
        { name: "Home", href: "/", icon: "home", routeName: "home" },
        { name: "Sign in", href: "/signin", icon: "login", routeName: "signin" },
        { name: "Sign Up", href: "/signup", icon: "how_to_reg", routeName: "signup" },
      ],
    };
  },
};
</script>

<style lang="scss">
@import "@/scss/globals.scss";

.navbar {
  display: inline-flex;
  border-radius: 1rem;
  padding: 1rem;
  color: $color;
  justify-content: flex-end;
  background: transparent;

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
