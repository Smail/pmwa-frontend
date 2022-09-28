<template>
  <div :id="id" class="context-menu" :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ContextMenu",
  computed: {
    style() {
      return {
        top: this.y + "px",
        left: this.x + "px",
        display: this.isHidden ? "none" : "",
      };
    },
    contextMenu() {
      return document.getElementById(this.id);
    },
    parent() {
      return this.contextMenu.parentElement;
    }
  },
  methods: {
    handler(event) {
      const target = event.target;
      if (this.contextMenu == null) return;
      event.preventDefault();

      if (this.contextMenu === target || this.contextMenu.contains(target)) {
        // A right-click on the context menu itself (or anything inside it) will NOT reposition it
        return;
      }

      this.x = event.clientX;
      this.y = event.clientY;

      if (!this.isHidden) {
      }

      this.isHidden = !this.isHidden;

      // Prevent page overflow
      if (this.x + this.width > window.innerWidth) {
        this.x = window.innerWidth - this.width;
      }
      if (this.y + this.height > window.innerHeight) {
        this.y = window.innerHeight - this.height;
      }
    },
    hide() {
      this.isHidden = true;
    },
    eventStopPropagation(e) {
      e.stopPropagation();
    },
  },
  mounted() {
    this.parent.addEventListener("contextmenu", this.handler);
    window.addEventListener("blur", this.hide);
    document.addEventListener("mousedown", this.hide);
    // We don't want this click to close the context menu, so we stop its propagation:
    this.contextMenu.addEventListener("mousedown", this.eventStopPropagation);
  },
  unmounted() {
    this.parent.removeEventListener("contextmenu", this.handler);
    window.removeEventListener("blur", this.hide);
    document.removeEventListener("mousedown", this.hide);
    this.contextMenu.removeEventListener("mousedown", this.eventStopPropagation);
  },
  data() {
    return {
      id: Math.random().toString(36).substring(2),
      x: 0,
      y: 0,
      width: 300,
      height: 500,
      isHidden: true,
    };
  },
};
</script>

<style scoped>
.context-menu {
  box-sizing: border-box;
  position: fixed;
  width: v-bind("width + 'px'");
  height: v-bind("height + 'px'");
  background: linear-gradient(75deg, var(--primary-color-300-0\.1), var(--primary-color-400-0\.1));
  z-index: 9999;
  overflow: hidden;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  backdrop-filter: blur(1rem);
  border: 0.1em solid var(--primary-color-400);
}
</style>
