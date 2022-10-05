<template>
  <div class="debug-overlay">
    <label>
      <input v-model="showDebugOverlay" type="checkbox"/>
    </label>
    <div v-if="showDebugOverlay">
      <label>
        Backdrop filter: {{ backdrop }}
        <input v-model="backdrop"
               max="15"
               min="0"
               type="range"
               @input="setAppBackdropFilter($event.target.value)"/>
      </label>
      <label v-for="theme in $store.state.themes">
        {{ theme }}
        <input :checked="theme === this.$store.state.settings.theme" type="radio" @input="setTheme(theme)"/>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "DebugOverlay",
  methods: {
    setAppBackdropFilter(value) {
      document.body.style.backdropFilter = `blur(${ value }rem)`;
    },
    setTheme(theme) {
      this.$store.commit("setTheme", theme);

      // Transition all elements smoothly into new theme
      const elements = Array.from(document.body.getElementsByTagName("*"));
      elements.push(document.body);
      elements.forEach(el => el.classList.add("when-bg-img-transitions"));

      // Count the number of ongoing transitions and only remove the animation class if all transitions are done.
      // This prevents the theme from suddenly and abruptly changing into the latest set theme
      // if the user changes between multiple themes fast enough.
      this.numTrans += 1;

      setTimeout(() => {
        this.numTrans = Math.max(this.numTrans - 1, 0);
        if (this.numTrans === 0) elements.forEach(el => el.classList.remove("when-bg-img-transitions"));
      }, 1000 /* Timeout must be synced with transition duration of .when-bg-img-transitions! */);
    },
  },
  data() {
    return {
      showDebugOverlay: true,
      backdrop: 10,
      theme: "pink",
      numTrans: 0,
    };
  },
};
</script>

<style lang="scss">
@import "@/scss/globals.scss";

.debug-overlay {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 9999;

  padding: 1rem;

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;

    input[type="radio"] {
      zoom: 3;
    }
  }
}
</style>
