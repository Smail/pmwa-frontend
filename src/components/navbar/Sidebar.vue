<template>
  <nav class="sidebar">
    <user-avatar></user-avatar>

    <hr v-if="showClock">
    <sidebar-item v-if="showClock">
      <clock></clock>
    </sidebar-item>

    <hr>

    <ul class="menubar">
      <li v-for="{ routeName, icon, name } in menu" class="menu">
        <sidebar-link :icon="icon"
                      :name="name"
                      :route-name="routeName"
        ></sidebar-link>
      </li>
    </ul>

    <sidebar-link class="menu"
                  icon="logout"
                  name="Sign out"
                  route-name="sign-out"
                  @click="signOut"
    ></sidebar-link>
  </nav>
</template>

<script>
import NavBarLink from "@/components/navbar/NavBarLink";
import Clock from "@/components/navbar/Clock";
import UserAvatar from "@/components/navbar/UserAvatar";
import SidebarLink from "@/components/navbar/SidebarLink";
import SidebarItem from "@/components/navbar/SidebarItem";

export default {
  name: "Sidebar",
  components: { SidebarItem, SidebarLink, NavBarLink, Clock, UserAvatar },
  computed: {
    showClock() {
      return this.$store.state.showClock && this.screenWidth > 1500;
    },
  },
  methods: {
    signOut() {
      this.$store.dispatch("logOut");
    },
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
    },
  },
  mounted() {
    window.addEventListener("resize", this.updateScreenWidth);
  },
  unmounted() {
    window.removeEventListener("resize", this.updateScreenWidth);
  },
  data() {
    return {
      screenWidth: screen.width,
      menu: [
        // { name: "Dashboard", href: "/dashboard", icon: "space_dashboard", routeName: "dashboard" },
        { name: "Todo", href: "/tasks", icon: "check", routeName: "tasks" },
        { name: "Calendar", href: "/calendar", icon: "calendar_month", routeName: "calendar" },
        { name: "Fitness", icon: "fitness_center", routeName: "fitness" },
        // { name: "Flashcards", href: "/flashcards", icon: "school", routeName: "flashcards" },
        // { name: "Projects", href: "/projects", icon: "view_kanban", routeName: "projects" },
        { name: "Settings", href: "/settings", icon: "settings", routeName: "settings" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/globals.scss";

.sidebar {
  display: flex;
  flex-direction: column;

  padding: 1rem;
  border-radius: 1rem;
  background: var(--primary-color-900-0\.9);

  hr {
    height: 1px;
    border: none;
    margin: 0.5rem 0;
    border-radius: 1rem;
    background: var(--primary-color-900-0\.7);
  }

  .menubar {
    flex: 1;
    list-style: none;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    gap: 0.25rem;
  }

  .menu {
    text-transform: capitalize;
  }
}
</style>
