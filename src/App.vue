<template>
  <div :class="{
          'logged-in': this.$store.state.isLoggedIn,
          'logged-out': !this.$store.state.isLoggedIn
        }"
       class="app-content-wrapper">
    <nav-bar id="app-navbar"></nav-bar>
    <router-view id="app-content"/>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  components: { NavBar },
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

      &.logged-out {
        flex-direction: column;
      }

      &.logged-in {
        flex-direction: row;
      }

      #app-content {
        flex: 1;
      }
    }
  }
}
</style>
