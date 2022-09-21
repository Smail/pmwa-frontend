<template>
  <div class="home">
    <h1>Tasks. Simple. Fast.</h1>
    <span class="scroll-down-notification material-symbols-outlined">keyboard_double_arrow_down</span>
    <section>
      <img alt="Preview of tasks management view" src="@/../public/tasks.png">
      <h2 style="font-family: monospace"># Markdown support</h2>
    </section>
    <section>
      <img alt="Preview of tasks management view" src="@/../public/calendar_simple.png">
      <h2>Link your tasks to a calendar</h2>
    </section>
    <section>
      <img alt="Preview of tasks management view" src="@/../public/calendar_large.png">
      <h2>Give me more days!</h2>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  components: {},
};
</script>

<style lang="scss">
@import "@/scss/globals.scss";

.home {
  color: $color;

  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70vh;
    font-size: 6rem;
    filter: drop-shadow(0 0 0.2em lighten(black, 50));
  }

  .scroll-down-notification {
    user-select: none;
    font-size: 4rem;
    filter: drop-shadow(0 0 0.5rem lighten(black, 20));
    animation: animation-bounce ease-in-out 1.5s infinite alternate;
  }

  section {
    display: flex;
    align-items: center;
    padding: 5rem;

    h2 {
      font-weight: bold;
      font-size: 3rem;
      filter: drop-shadow(0 0 1rem lighten(black, 30));
    }

    img {
      user-select: none;
      cursor: pointer;
      width: 50vw;
      border-radius: 0.5rem;
      margin: 3rem;
      transition: transform 1s ease-in-out;
      animation: animation-bounce ease-in-out 2.4s infinite alternate;

      &:hover {
        transform: none !important;
      }
    }
  }

  section:nth-of-type(2n+1) {
    flex-direction: row;

    img {
      transform: rotate3d(0.5, 3, -0.5, 45deg);
      filter: drop-shadow(-1rem 1rem 2rem lighten(black, 20));
    }
  }

  section:nth-of-type(2n) {
    flex-direction: row-reverse;

    img {
      transform: rotate3d(0.5, 3, 0.5, 45deg);
      filter: drop-shadow(1rem 1rem 2rem lighten(black, 20));
    }
  }
}

@keyframes animation-bounce {
  0% {
    translate: 0 1vh;
  }
}
</style>
