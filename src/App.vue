<template>
  <logged-in-view-template v-if="isLoggedIn" :class="themeClass">
    <router-view/>
  </logged-in-view-template>
  <logged-out-view-template v-else :class="themeClass">
    <router-view/>
  </logged-out-view-template>
  <!--  <debug-overlay></debug-overlay>-->
</template>

<script>
import NavBar from "@/components/navbar/NavBar.vue";
import { hasValidRefreshToken } from "@/services/hasValidRefreshToken";
import { logErrorAndAlert } from "@/util/logErrorAndAlert";
import DebugOverlay from "@/components/DebugOverlay";
import LoggedInViewTemplate from "@/views/LoggedInViewTemplate";
import LoggedOutViewTemplate from "@/views/LoggedOutViewTemplate";

export default {
  components: { LoggedOutViewTemplate, LoggedInViewTemplate, DebugOverlay, NavBar },
  async created() {
    // Check if already signed it, because the router also may call signIn
    if (!this.$store.state.isLoggedIn && hasValidRefreshToken()) {
      await this.$store.dispatch("signIn").catch(e => logErrorAndAlert(e.message, "Could not sign in"));
    }

    // Set theme
    let theme = this.themes[0];
    // Set user's preferred theme TODO save this on server and not in local storage
    if (this.themes.includes(localStorage["userPreferredTheme"])) {
      theme = localStorage["userPreferredTheme"];
    }
    this.$store.commit("setTheme", theme);
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    themes() {
      return this.$store.state.themes;
    },
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

:root {
  font-family: Poppins, Avenir, Helvetica, Arial, sans-serif;
}

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
  background-size: 100% 100%;
  backdrop-filter: blur(10rem);

  #app {
    flex: 1;
    display: flex;
    padding: 0.5rem;
    gap: 1rem;

    & > :first-child {
      flex: 1;
    }

    $font-weight: 300;
    font-weight: $font-weight;

    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0,
      'wght' $font-weight,
      'GRAD' 0,
      'opsz' 48
    }

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
}

::-webkit-scrollbar {
  width: 0.35vw;
  background: var(--primary-color-200);
}

::-webkit-scrollbar-thumb {
  background-color: var(--primary-color-500);
  border-radius: 1rem;
  outline: none;
}

::selection {
  background: var(--primary-color-500);
}

::placeholder {
  color: var(--primary-color-800);
}
</style>
