<template>
  <button class="delete-btn"
          type="button"
          :title="title"
          @click="$emit('click')"
  >
    <slot></slot>
    <span class="material-symbols-outlined">delete</span>
  </button>
</template>

<script>
export default {
  name: "DeleteButton",
  emits: ["click"],
  props: {
    title: {
      type: String,
      required: true,
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/globals.scss";

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  border: none;
  color: $red;
  background: transparentize($red, 0.7);
  border-radius: 0.5rem;
  outline: $red solid 0.1rem;
  transition: all 50ms ease-in-out;

  &:hover {
    background: transparentize($red, 0.5);
  }

  &:active {
    background: darken(transparentize($red, 0.7), 20%);
  }
}
</style>
