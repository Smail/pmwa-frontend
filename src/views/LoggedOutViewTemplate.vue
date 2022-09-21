<template>
  <div class="logged-out-view">
    <nav-bar></nav-bar>
    <div class="content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/navbar/NavBar";

export default {
  name: "LoggedOutViewTemplate",
  components: { NavBar }
}
</script>

<style lang="scss" scoped>
.logged-out-view {
  display: flex;
  flex-direction: column;

  .content-wrapper {
    flex: 1;
    display: flex;

    & > :first-child {
      flex: 1;
    }
  }
}
</style>
