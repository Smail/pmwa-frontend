<template>
  <div :class="[themeClass, {
          'logged-in': $store.state.isLoggedIn,
          'logged-out': !$store.state.isLoggedIn,
        }]"
       class="app-content-wrapper">
    <nav-bar id="app-navbar"></nav-bar>
    <router-view id="app-content"/>
  </div>
</template>

<script>
import NavBar from "@/components/navbar/NavBar.vue";
import { hasValidRefreshToken } from "@/services/hasValidRefreshToken";
import { logErrorAndAlert } from "@/util/logErrorAndAlert";

export default {
  components: { NavBar },
  async created() {
    // Check if already signed it, because the router also may call signIn
    if (!this.$store.state.isLoggedIn && hasValidRefreshToken()) {
      await this.$store.dispatch("signIn").catch(e => logErrorAndAlert(e.message, "Could not sign in"));
    }

    // Set theme
    this.$store.commit("setTheme", "purple");
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
    themeClass() {
      return `theme-${ this.theme }`;
    },
  },
};
</script>

<style lang="scss">
@import "@/scss/globals.scss";

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

body {
  background: linear-gradient(to top right, orange, #501010);
  //background-image: url("/public/bg2.jpg");
  //background-size: 100% 110%;
  //background-position: 120% 100%;
  // Animations kills the GPU
  //animation: animate-page-background 30s ease-in-out infinite alternate;
}

#app {
  backdrop-filter: blur(10rem);
}

::-webkit-scrollbar {
  width: 0.35vw;
  background: slategray;
}

::-webkit-scrollbar-thumb {
  background-color: $theme;
  border-radius: 1rem;
  outline: none;
}

::selection {
  background: $theme;
}

@keyframes animate-page-background {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}
</style>
