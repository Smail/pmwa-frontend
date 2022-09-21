<template>
  <sidebar-item class="sidebar-item">
    <router-link :to="{ name: routeName }" class="sidebar-link">
      <span class="material-symbols-outlined">{{ icon }}</span>
      <span class="name">{{ name }}</span>
    </router-link>
  </sidebar-item>
</template>

<script>
import SidebarItem from "@/components/navbar/SidebarItem";

export default {
  name: "SidebarLink",
  components: { SidebarItem },
  props: {
    routeName: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    icon: {
      type: String,
      require: true,
    },
  }
}
</script>

<style lang="scss" scoped>
.sidebar-item {
  padding: 0;
  background-color: transparent;
}

.sidebar-link {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.5em;
  gap: inherit;
  border-radius: inherit;

  &.router-link-active {
    box-shadow: 0 0 0.5em var(--primary-color-500);
    background: var(--primary-color-500);
  }

  &:hover {
    box-shadow: 0 0 0.5em var(--primary-color-600);
    background: var(--primary-color-600);
  }

  &:active {
    background: var(--primary-color-400);
  }
}
</style>
