<template>
  <ul class="task-list">
    <li>
      <create-task class="new-task-wrapper" @task-created="$emit('taskSelected', $event)"></create-task>
    </li>
    <li v-for="task in tasks" :key="task.id">
      <task :task="task" class="task-wrapper"
            @task-selected="$emit('taskSelected', $event)"
            @task-deleted="$emit('taskDeleted', $event)"></task>
    </li>
  </ul>
</template>

<style lang="scss">
@import "@/scss/globals.scss";

.task-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;

  li {
    display: flex;
    align-items: stretch;

    .task-wrapper, .new-task-wrapper {
      flex: 1;
    }

    .checkbox {
      zoom: 1.5;
      accent-color: $theme;
      height: 100%;
    }
  }
}
</style>

<script>
import Task from "@/components/tasks/Task";
import CreateTask from "@/components/tasks/CreateTask";

export default {
  name: "TaskList",
  components: { CreateTask, Task },
  emits: ["taskSelected", "taskDeleted"],
  props: {
    tasks: {
      type: Array,
      required: true,
    }
  }
};
</script>
