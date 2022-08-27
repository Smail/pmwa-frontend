<template>
  <ul class="task-list">
    <li>
      <create-task class="new-task-wrapper" @refresh-tasks="loadTasks"></create-task>
    </li>
    <li v-for="(task, i) in $store.state.tasks.slice().reverse()" :key="i">
      <task :task="task" class="task-wrapper" @refresh-tasks="loadTasks"></task>
    </li>
  </ul>
</template>

<style lang="scss">
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

    .task-checkbox {
      zoom: 1.5;
    }

    .task-input {
      background: red;
      border: none;
      border-radius: 0.25rem;
      padding: 0.5em;
      font-size: 1rem;
      outline: #860000 solid 1px;
    }

    .task-input:focus {
      outline: aqua solid 1px;
    }
  }
}
</style>

<script>
import Task from "@/components/tasks/Task";
import CreateTask from "@/components/tasks/CreateTask";

export default {
  name: 'TaskList',
  components: { CreateTask, Task },
  methods: {
    loadTasks() {
      this.$store.dispatch('loadTasks');
    }
  },
  created() {
    this.loadTasks();
  }
}
</script>