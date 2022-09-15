<template>
  <nav class="navbar">
    <ul class="links">
      <li v-for="menuItem in menu" class="menu">
        <nav-bar-link :icon="menuItem.icon" :name="menuItem.name" :to="menuItem.routeName"></nav-bar-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import NavBarLink from "@/components/navbar/NavBarLink";
export default {
  name: "NavBarLoggedOut",
  components: { NavBarLink },
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

<style>
.logged-out {
  flex-direction: row;
  justify-content: flex-end;
}
</style>
