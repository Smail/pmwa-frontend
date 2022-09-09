<template>
  <button :class="{ 'active': isActive }" class="material-symbols-outlined toggle-button">
    {{ isActive ? "toggle_on" : "toggle_off" }}
  </button>
</template>

<style lang="scss">
.toggle-button {
  padding: 0;
  margin: 0;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  transition: all 500ms;
  // If not active set color to red
  color: rgb(255, 59, 48);

  &.active {
    color: rgb(52, 199, 89);
  }

  &.material-symbols-outlined {
    font-variation-settings: 'FILL' 1,
    'wght' 400,
    'GRAD' 200,
    'opsz' 20;
  }
}
</style>

<script>
export default {
  name: "ToggleButton",
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
