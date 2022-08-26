<template>
  <ul class="task-list">
    <li v-for="(task, i) in tasks" :key="i">
      <task class="task" :task="task" @refresh-tasks="loadTasks"></task>
    </li>
    <li>
      <create-task @refresh-tasks="loadTasks"></create-task>
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

    .task, .new-task-form {
      flex: 1;
    }
  }
}

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
import Task from "@/components/tasks/Task";
import CreateTask from "@/components/tasks/CreateTask";

export default {
  name: 'TaskList',
  components: { CreateTask, Task },
  methods: {
    async loadTasks() {
      try {
        const response = await this.$http.get('tasks');
        this.tasks.splice(0, this.tasks.length);

        for (const task of response.data) {
          console.log(task);
          this.tasks.push(task);
        }
        console.log(this.tasks);
      } catch (error) {
        console.error(error);
      }
    }
  },
  created() {
    this.loadTasks();
  },
  data() {
    return {
      tasks: [],
    }
  }
}
</script>