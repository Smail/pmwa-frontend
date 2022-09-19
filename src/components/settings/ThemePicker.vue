<template>
  <div class="theme-picker">
    <ul>
      <li v-for="(theme, i) in themes">
        <label :class="theme">
          <h4 :class="theme">{{ theme }}</h4>
          <input :checked="theme === $store.state.settings.theme" type="radio" @input="setTheme(theme)"/>
          <!-- Only for prefetch. Doesn't actually show -->
          <img :src="preloadedImages[i]"/>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ThemePicker",
  computed: {
    themes() {
      return this.$store.state.themes;
    },
  },
  methods: {
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
  created() {
    // Prefetch background images
    this.$store.state.themes.forEach(t => this.preloadedImages.push(new Image().src = require(`/public/${ t }.png`)));
  },
  data() {
    return {
      numTrans: 0,
      preloadedImages: [],
    };
  },
};
</script>

<style lang="scss" scoped>
@use "sass:map";
@import "@/scss/globals.scss";

.theme-picker {
  font: inherit;

  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  img {
    display: none;
  }

  label {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    text-transform: capitalize;

    input[type="radio"] {
      cursor: pointer;
      zoom: 2;
    }

    padding: 1rem;
    border-radius: 1rem;
    @each $name, $color in $colors {
      &.#{$name} {
        $c: hsl(hue($color), saturation($color), 50%);
        background: $c;

        input[type="radio"] {
          accent-color: $c;
        }
      }
    }
  }
}
</style>
