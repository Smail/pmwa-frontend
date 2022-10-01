<template>
  <form class="auth-form" @reset="$emit('reset')" @submit.prevent="$emit('submit')">
    <h2 v-if="title" class="title">{{ title }}</h2>
    <p v-if="description" class="desc">{{ description }}</p>
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: "AuthCommonComponent",
  emits: ["submit", "reset"],
  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
    }
  }
}
</script>

<style lang="scss">
@import "@/scss/globals.scss";

.auth-form {
  color: $color;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 2rem 3rem;
  background: var(--primary-color-500-0\.8);
  border-radius: 1rem;
  position: relative;
  backdrop-filter: blur(20rem);
  box-shadow: 0 0 1rem -0.75rem black;

  .title {
    align-self: flex-start;
  }

  .desc {
    align-self: flex-start;
    color: #d9d9d9;
    margin-bottom: 1rem;
  }

  input, button {
    background: transparent;
    outline: none;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: none;
  }

  button {
    cursor: pointer;
    margin-top: 1rem;
    background: var(--primary-color-500);
    transition: all 150ms ease-in-out;

    &:hover {
      background: var(--primary-color-600);
    }

    &:active {
      background: var(--primary-color-400);
    }
  }

  label, button {
    border: 1px solid var(--primary-color-500);
  }

  label {
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-weight: normal;
    background: var(--primary-color-400);
    border-radius: 0.25rem;
    padding-left: 0.5rem;
    transition: all 50ms ease-in-out;

    input {
      padding: 0.75rem;
    }

    &:hover {
      background-color: var(--primary-color-500);
    }

    &:focus-within {
      box-shadow: 0 0 0.25rem white;
    }
  }
}
</style>