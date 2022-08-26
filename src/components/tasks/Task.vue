<template>
  <div class="task">
    <input v-model="taskModel.isDone" autocomplete="off" class="task-checkbox" type="checkbox" @input="toggleCheckbox"/>
    <input v-model="taskModel.content" autocomplete="off" class="task-input" type="text" @focusout="updateServer"/>
    <button class="delete-task-btn material-symbols-outlined" @click="deleteTask">delete</button>
  </div>
</template>

<style lang="scss">
.task {
  display: flex;
  gap: 0.5rem;

  .task-checkbox {
    cursor: pointer;
  }

  .task-input {
    flex: 1;
  }

  .delete-task-btn {
    display: flex;
    align-items: center;
    justify-items: center;
    border: none;
    background: transparent;
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
      return this.taskModel.uuid;
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
      }).catch(error => console.log(error));
      this.$emit('refreshTasks');
    },
    updateServer() {
      if (this.oldTaskContent === this.content) return;
      axios.post('tasks/update', {
        uuid: this.taskUuid,
        content: this.content,
      }).catch(error => console.log(error));
      this.$emit('refreshTasks');
    },
    deleteTask() {
      axios.delete(`tasks/${this.taskUuid}`).catch(error => console.log(error));
      this.$emit('refreshTasks');
    }
  },
  data() {
    return {
      taskModel: this.task,
      oldTaskContent: this.task.content,
    }
  },
}
</script>
