<template>
  <nav class="navbar">
    <user-avatar></user-avatar>

    <hr v-if="$store.state.showClock">
    <clock v-if="$store.state.showClock"></clock>

    <hr v-if="menus.length > 0">

    <ul v-for="menu in menus" class="links">
      <li v-for="menuItem in menu" class="menu">
        <router-link :to="menuItem.href" class="menu-content">
          <span v-if="menuItem.icon" class="material-symbols-outlined">{{ menuItem.icon }}</span>
          {{ menuItem.name }}
        </router-link>
      </li>

      <!-- Log out button -->
      <li class="menu" style="margin-top: auto">
        <router-link class="menu-content" to="/signin" @click="$store.dispatch('logOut')">
          <span class="material-symbols-outlined">logout</span>
          Log out
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import UserAvatar from "@/components/navbar/UserAvatar";
import Clock from "@/components/navbar/Clock";

export default {
  name: "NavBarLoggedIn",
  components: { Clock, UserAvatar },
  data() {
    return {
      menus: [
        // Menu 1
        [
          { name: 'Dashboard', href: '/dashboard', icon: 'space_dashboard' },
          { name: 'Todo', href: '/todo', icon: 'check' },
          { name: 'Calendar', href: '/calendar', icon: 'calendar_month' },
          { name: 'Flashcards', href: '/flashcards', icon: 'school' },
          { name: 'Projects', href: '/projects', icon: 'view_kanban' },
          { name: 'Settings', href: '/settings', icon: 'settings' },
        ],
      ]
    }
  },
}
</script>

<style>
.logged-in {
  flex-direction: column;
}
</style>
