<template>
  <div class="context-menu" :style="style" v-show="!isHidden" tabindex="-1">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ContextMenu",
  emits: ["opened", "closed"],
  computed: {
    style() {
      return {
        top: this.y + "px",
        left: this.x + "px",
      };
    },
  },
  methods: {
    handler(event) {
      const target = event.target;
      if (this.$el == null) return;
      event.preventDefault();

      if (this.$el === target || this.$el.contains(target)) {
        // A right-click on the context menu itself (or anything inside it) will NOT reposition it
        return;
      }

      this.x = event.clientX;
      this.y = event.clientY;

      // We must remove the display: none property or
      // otherwise the offset width/height will be 0 when retrieved.
      // This is safe, since the element will be visible anyway after this function.
      this.$el.style.display = null;
      const width = this.$el.offsetWidth;
      const height = this.$el.offsetHeight;

      // Prevent page overflow
      if (this.x + width > window.innerWidth) {
        this.x = window.innerWidth - width;
      }
      if (this.y + height > window.innerHeight) {
        this.y = window.innerHeight - height;
      }

      this.show();
    },
    show() {
      this.isHidden = false;
      this.$emit("opened");
    },
    hide() {
      this.isHidden = true;
      this.$emit("closed");
    },
    eventStopPropagation(e) {
      e.stopPropagation();
    },
    focusOutHandler(e) {
      if (!this.$el.contains(e.relatedTarget)) {
        this.hide();
      }
    }
  },
  mounted() {
    this.$el.parentElement.addEventListener("contextmenu", this.handler);
    window.addEventListener("blur", this.hide);
    document.addEventListener("mousedown", this.hide);
    // We don't want this click to close the context menu, so we stop its propagation:
    this.$el.addEventListener("mousedown", this.eventStopPropagation);

    // Hide context menu when it loses focus (within).
    this.$el.addEventListener("focusout", this.focusOutHandler);
  },
  beforeUnmount() {
    this.$el.parentElement.removeEventListener("contextmenu", this.handler);
    window.removeEventListener("blur", this.hide);
    document.removeEventListener("mousedown", this.hide);
    this.$el.removeEventListener("mousedown", this.eventStopPropagation);
    this.$el.removeEventListener("focusout", this.focusOutHandler);
  },
  data() {
    return {
      x: 0,
      y: 0,
      isHidden: true,
    };
  },
};
</script>

<style scoped>
.context-menu {
  box-sizing: border-box;
  position: fixed;
  background: linear-gradient(75deg, var(--primary-color-300-0\.1), var(--primary-color-400-0\.1));
  z-index: 10;
  overflow: hidden;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  backdrop-filter: blur(1rem);
  border: 0.1em solid var(--primary-color-400);
}
</style>
