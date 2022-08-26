<template>
  <div class="todo">
    <h1>Tasks</h1>
    <task-list class="task-list"></task-list>
  </div>
</template>

<style lang="scss">
.todo {
  display: flex;
  flex-direction: column;
  margin: 0;
  gap: 0.5rem;

  h1 {
    align-self: flex-start;
  }

  .task-list {
    background-color: whitesmoke;
    padding: 1rem;
    border-radius: 1rem;
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
