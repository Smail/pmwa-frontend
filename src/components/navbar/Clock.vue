<template>
  <span class="material-symbols-outlined">schedule</span>
  <span>{{ time }}</span>
</template>

<style lang="scss">
@import "@/scss/globals.scss";

.clock {
  margin: 0;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  font-weight: normal;
  gap: 0.5rem;

  color: white;
  background-color: var(--primary-color-500);
  border-radius: 0.5rem;
}
</style>

<script>
export default {
  name: "Clock",
  data() {
    return {
      time: null,
      interval: null,
    };
  },
  methods: {
    setTime() {
      // Concise way to format time according to system locale.
      // In my case this returns "3:48:00 am"
      const options = {
        hour: "numeric",
        minute: "numeric",
      };

      if (this.$store.state.showClockSeconds) {
        options.second = "numeric";
      }

      this.time = Intl.DateTimeFormat(this.$store.state.locale, options).format();
    },
  },
  created() {
    this.setTime();
    // Update the time every second
    this.interval = setInterval(() => {
      this.setTime();
    }, 1000);
  },
  unmounted() {
    // Prevent memory leak
    clearInterval(this.interval);
  },
};
</script>
