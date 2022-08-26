<template>
  <div class="task">
    <input class="task-checkbox" type="checkbox" autocomplete="off" v-model="taskModel.isDone" @input="toggleCheckbox"/>
    <input class="task-content" type="text" autocomplete="off" v-model="taskModel.content" @input="updateServer"/>
  </div>
</template>

<style lang="scss">
.task {
  display: flex;
  gap: 0.5rem;

  .task-checkbox {}

  .task-content {
    flex: 1;
  }
}
</style>

<script>
import axios from "axios";

export default {
  name: 'Task',
  props: {
    'task': {
      type: Object,
      required: true,
      // TODO add validator
    }
  },
  emits: ['refreshTasks'],
  watch: {
    task(newTask, oldTask) {
      this.taskModel = newTask;
    }
  },
  computed: {
    taskUuid() {
      return this.taskModel.content;
    },
    userUuid() {
      return this.taskModel.content;
    },
    content() {
      return this.taskModel.content;
    }
  },
  methods: {
    toggleCheckbox() {
      axios.put('tasks/update', {
        uuid: this.taskUuid,
        isDone: this.taskModel.isDone,
      }).catch(_ => this.$emit['refreshTasks']);
    },
    updateServer() {
      axios.post('tasks/update', {
        uuid: this.taskUuid,
        content: this.content,
      }).catch(_ => this.$emit['refreshTasks']);
    }
  },
  data() {
    return {
      taskModel: this.task,
    }
  },
}
</script>
