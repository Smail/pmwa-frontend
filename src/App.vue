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
import DebugOverlay from "@/components/DebugOverlay";
import LoggedInViewTemplate from "@/views/LoggedInViewTemplate";
import LoggedOutViewTemplate from "@/views/LoggedOutViewTemplate";

export default {
  components: { LoggedOutViewTemplate, LoggedInViewTemplate, DebugOverlay, NavBar },
  async created() {
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

$font-weight: 300;

:root {
  color: $color;
  font-family: Poppins, Avenir, Helvetica, Arial, sans-serif;
  font-size: 0.75rem;
}

* {
  list-style: none;
  margin: 0;
  padding: 0;
  color: inherit;
  text-decoration: none;
}

h1, h2, h3, h4, h5, h6 {
  cursor: default;
}

button {
  cursor: pointer;
}

body {
  margin: 0;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  background-size: 100% 100%;
  backdrop-filter: blur(10rem);

  // Allow overflow in CSS grid cells
  height: 100vh;
  padding: 0.5em;
  // Keep page not scrollable when adding padding
  box-sizing: border-box;

  #app {
    flex: 1;
    display: flex;
    gap: 1rem;

    & > :first-child {
      flex: 1;
    }

    font-weight: $font-weight;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
}

.material-symbols-outlined {
  font-size: 1.5rem;
  font-variation-settings: 'FILL' 0,
  'wght' $font-weight,
  'GRAD' 0,
  'opsz' 48
}

button, input {
  font-size: 0.9rem;
}

::-webkit-scrollbar {
  width: 0.35vw;
  background: var(--primary-color-200);
  border-radius: 1rem;
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

@media (prefers-color-scheme: dark) {
  input {
    color-scheme: dark;
  }
}
</style>
