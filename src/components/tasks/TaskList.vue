<template>
  <ul class="task-list">
    <li>
      <create-task class="new-task-wrapper"></create-task>
    </li>
    <li v-for="task in tasks" :key="task.id">
      <task :task="task" class="task-wrapper" @click="$emit('taskClicked', task)"></task>
    </li>
  </ul>
</template>

<style lang="scss">
.task-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  $color: rgb(0, 122, 255);

  li {
    display: flex;
    align-items: stretch;

    .task-wrapper, .new-task-wrapper {
      flex: 1;
    }

    .task-checkbox {
      zoom: 1.5;
      accent-color: $color;
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
  props: {
    tasks: {
      type: Array,
      required: true,
    }
  }
};
</script>
