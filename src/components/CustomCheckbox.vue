<template>
  <label :class="{checked: isChecked}"
         :for="name"
         :title="title"
         class="checkbox-label"
         tabindex="0"
         @click="$emit('input')"
         @focusout="$emit('focusout')"
  >
    <span class="checkmark material-symbols-outlined">done</span>
  </label>

  <input :checked="isChecked"
         :name="name"
         :title="title"
         autocomplete="off"
         class="checkbox"
         tabindex="-1"
         type="checkbox"/>
</template>

<script>
export default {
  name: "CustomCheckbox",
  emits: ["input", "focusout"],
  props: {
    isChecked: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      name: Math.random().toString().substring(2),
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/globals.scss";

.checkbox-label {
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  align-self: center;
  cursor: pointer;
  border-radius: 1.5rem;
  border: 0.1em $theme solid;
  transition: all 250ms ease-in-out;

  display: flex;
  align-items: center;
  justify-content: center;

  .checkmark {
    font-size: 1.25rem;
    color: white;
    opacity: 0;
    transition: inherit;
    user-select: none;
  }

  &.checked {
    background: $theme;

    .checkmark {
      opacity: 1;
    }
  }
}

.checkbox {
  width: 1px;
  height: 1px;
  display: none;
}
</style>
