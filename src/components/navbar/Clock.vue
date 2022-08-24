<template>
  <h4 class="clock">
    <span class="material-symbols-outlined">schedule</span>
    {{ time }}
  </h4>
</template>

<style lang="scss">
.clock {
  margin: 0;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  font-weight: normal;
  gap: 0.5rem;

  color: white;
  background-color: rgb(0, 122, 255);
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
    }
  },
  methods: {
    setTime() {
      // Concise way to format time according to system locale.
      // In my case this returns "3:48:00 am"
      const options = {
        hour: 'numeric',
        minute: 'numeric',
      };

      if (this.$store.state.showClockSeconds) {
        options.second = 'numeric';
      }

      this.time = Intl.DateTimeFormat(this.$store.state.locale, options).format();
    }
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
}
</script>
