<template>
  <div class="todo">
    <h1>Tasks</h1>
    <task-list></task-list>
  </div>
</template>

<style lang="scss">
.todo {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;

  h1 {
    align-self: flex-start;
  }
}
</style>

<script>
import TaskList from "@/components/TaskList.vue";
export default {
    name: "TodoView",
    components: { TaskList }
}
</script>
