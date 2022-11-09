<template>
  <div :style="style"
       class="modal"
       tabindex="-1"
       @click="handleModalClick"
       @keydown.esc="$emit('hideModal')">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  emits: ["hideModal"],
  props: {
    isShowing: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    style() {
      return {
        display: !this.isShowing ? "none" : null,
      };
    },
  },
  methods: {
    handleModalClick(event) {
      if (this.$el === event.target) {
        this.$emit("hideModal");
      }
    },
  },
  mounted() {
    this.$el.focus();
  },
};

</script>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 100;

  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}
</style>
