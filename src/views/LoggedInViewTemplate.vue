<template>
  <div class="logged-in-view">
    <sidebar></sidebar>
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/navbar/Sidebar";

export default {
  name: "LoggedInViewTemplate",
  components: { Sidebar }
}
</script>

<style lang="scss" scoped>
.logged-in-view {
  display: flex;
  gap: 0.5rem;

  .main-content {
    flex: 1;
    display: flex;

    & > :first-child {
      flex: 1;
    }
  }
}
</style>
