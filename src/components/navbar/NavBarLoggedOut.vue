<template>
  <nav class="navbar">
    <ul class="links">
      <li v-for="menuItem in menu" class="menu">
        <router-link :to="menuItem.href">
          <span v-if="menuItem.icon" class="material-symbols-outlined">{{ menuItem.icon }}</span>
          {{ menuItem.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavBarLoggedOut",
  data() {
    return {
      menu: [
        { name: 'Home', href: '/', icon: 'home' },
        { name: 'Login', href: '/signin', icon: 'login' },
        { name: 'Sign Up', href: '/signup', icon: 'how_to_reg' },
      ]
    }
  },
}
</script>

<style>
.logged-out {
  flex-direction: row;
  justify-content: flex-end;
}
</style>
