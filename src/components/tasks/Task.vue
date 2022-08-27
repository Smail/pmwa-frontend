<template>
  <div class="task" @focusout="update" @submit="update">
    <input v-model="taskModel.isDone" autocomplete="off" class="task-checkbox" type="checkbox"/>
    <input v-model="taskModel.name" autocomplete="off" class="task-input" type="text"/>
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
    uuid() {
      return this.taskModel.uuid;
    },
    name() {
      return this.taskModel.name;
    },
    content() {
      return this.taskModel.content;
    },
    isDone() {
      return this.taskModel.isDone;
    },
  },
  methods: {
    async update() {
      const data = { uuid: this.uuid };

      if (this.oldModel.name !== this.name) data['name'] = this.name;
      if (this.oldModel.isDone !== this.isDone) data['isDone'] = this.isDone;
      if (this.oldModel.content !== this.content) data['content'] = this.content;
      // Check if any data was updated. Data was updated if the object has more keys than initially.
      if (Object.keys(data).length === 1) return;

      try {
        await axios.post('tasks/update', data);
        this.oldModel = this.taskModel;
        this.$emit('refreshTasks');
      } catch (error) {
        console.error(error);
      }
    },
    async deleteTask() {
      try {
        await axios.delete(`tasks/${this.uuid}`);
        this.$emit('refreshTasks');
      } catch (error) {
        console.error(error);
      }
    }
  },
  data() {
    return {
      taskModel: structuredClone(this.task),
      oldModel: structuredClone(this.task),
    }
  },
}
</script>
