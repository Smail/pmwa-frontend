<template>
  <div class="sidebar-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "SidebarItem",
}
</script>

<style lang="scss">
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em;
  border-radius: 0.5em;
  background: var(--primary-color-500);
}
</style>
