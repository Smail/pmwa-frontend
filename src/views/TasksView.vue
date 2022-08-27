<template>
  <div class="task-view">
    <h1>Tasks</h1>
    <task-list class="task-list"></task-list>
  </div>
</template>

<style lang="scss">
.task-view {
  display: flex;
  flex-direction: column;
  margin: 0;
  gap: 0.5rem;

  h1 {
    margin: 0;
    align-self: stretch;
    text-align: left;
    background-color: whitesmoke;
    padding: 1rem;
    border-radius: 1rem;
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
  name: "TaskView",
  components: { TaskList },
}
</script>
