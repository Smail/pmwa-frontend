<template>
  <nav class="navbar">
    <user-avatar></user-avatar>

    <hr v-if="$store.state.showClock">
    <clock v-if="$store.state.showClock"></clock>

    <hr>

    <ul class="links">
      <li v-for="menuItem in menu" class="menu">
        <nav-bar-link :icon="menuItem.icon" :name="menuItem.name" :sub-menu="menuItem.subMenu" :to="menuItem.routeName"
                      class="wrapper"></nav-bar-link>
      </li>

      <!-- Log out button -->
      <li class="menu" style="margin-top: auto">
        <nav-bar-link class="wrapper" icon="logout" name="Log out" to="sign-out"
                      @click="$store.dispatch('logOut')"></nav-bar-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import UserAvatar from "@/components/navbar/UserAvatar";
import Clock from "@/components/navbar/Clock";
import NavBarLink from "@/components/navbar/NavBarLink";

export default {
  name: "NavBarLoggedIn",
  components: { NavBarLink, Clock, UserAvatar },
  data() {
    const tasks = {
      name: "Todo", href: "/tasks", icon: "check", routeName: "tasks"
    };

    const data = {
      menu: [
        { name: "Dashboard", href: "/dashboard", icon: "space_dashboard", routeName: "dashboard" },
        tasks,
        { name: "Calendar", href: "/calendar", icon: "calendar_month", routeName: "calendar" },
        { name: "Flashcards", href: "/flashcards", icon: "school", routeName: "flashcards" },
        { name: "Projects", href: "/projects", icon: "view_kanban", routeName: "projects" },
        { name: "Settings", href: "/settings", icon: "settings", routeName: "settings" },
      ],
    };
    return data;
  },
};
</script>

<style scoped>
.wrapper {
  flex: 1;
}

.logged-in {
  flex-direction: column;
}

.menu-link {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.menu-title {
  display: flex;
  align-items: center;
  justify-items: center;
  gap: 0.5rem;
}

.sub-menu-list {

}
</style>
