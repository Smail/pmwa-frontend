<template>
  <span class="material-symbols-outlined">schedule</span>
  <span>{{ time }}</span>
</template>

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
