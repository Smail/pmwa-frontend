<template>
  <div v-if="$store.state.isLoggedIn" class="app-content-wrapper">
    <nav-bar id="app-navbar" :menus="menus"></nav-bar>
    <router-view id="app-content"/>
  </div>
  <div v-else class="app-content-wrapper" style="flex-direction: column;">
    <nav-bar id="app-navbar" :menus="menus" style="flex-direction: row; justify-content: flex-end"></nav-bar>
    <router-view id="app-content"/>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  components: { NavBar },
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
  async created() {
    // Try to log in via tokens
    const accessToken = localStorage['accessToken'];
    const refreshToken = localStorage['refreshToken'];
    if (accessToken || refreshToken) {
      this.$store.dispatch('signInViaToken').catch(error => console.error(error));
    } else {
      console.debug('No tokens available');
    }
  }
}
</script>

<style lang="scss">
* {
  list-style: none;
  margin: 0;
  padding: 0;
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
}

// a {
//   color: inherit;
//   text-decoration: none;
// }

body {
  margin: 0;
  min-height: 100vh;
  height: 100vh;
  // Let flexbox deal with width
  // min-width: 100vw;
  // width: 100vw;
  display: flex;

  #app {
    display: flex;
    flex: 1;

    .app-content-wrapper {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      display: flex;
      margin: 0.5rem;
      gap: 1rem;
      flex: 1;

      // .navbar {}

      #app-content {
        flex: 1;
      }
    }
  }
}
</style>
