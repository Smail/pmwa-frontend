<template>
  <div class="dashboard-view">
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
    </div>

    <div class="content">
      <p>
        <span>{{ currentSentence }}</span>
        <span v-if="randChar.length > 0" style="color: slategray">{{ randChar }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardView",
  mounted() {
    const createRandChar = () => {
      if (this.currentSentence === this.fullSentence) {
        this.randChar = "";
        return;
      }

      this.randChar = Math.random().toString(36).substring(3,4);
      setTimeout(createRandChar, 150);
    };

    const animateText = () => {
      if (this.currentSentence.length === this.fullSentence.length) return;
      this.currentSentence = this.fullSentence.substring(0, this.currentSentence.length + 1);

      setTimeout(animateText, 100);
    };

    animateText();
    createRandChar();
  },
  data() {
    return {
      idx: 0,
      currentSentence: "",
      fullSentence: "Wow, it's so empty here... 😨",
      randChar: "",
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/globals.scss";

.dashboard-view {
  color: $color;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.content {
  flex: 1;

  p {
    align-self: center;
    margin-left: auto;
    margin-right: auto;
    font-size: xx-large;
  }

  display: flex;
  background: var(--primary-color-900-0\.9);
  padding: 1rem;
  border-radius: 1rem;
  justify-content: space-between;
}

.page-header {
  display: flex;
  background: var(--primary-color-900-0\.9);
  padding: 1rem;
  border-radius: 1rem;
  justify-content: space-between;
}

.page-title {
  margin: 0;
}
</style>
