<template>
  <form class="new-task-form" @submit.prevent="createTask">
    <input id="new-task" class="task-input" type="text" autocomplete="off" v-model="name" placeholder="New task"/>
    <button class="new-task-submit" type="submit">Add</button>
  </form>
</template>

<style lang="scss">
.new-task-form {
  display: flex;
  gap: 0.5rem;

  .task-input {
    flex: 1;
  }

  .task-input::placeholder {
    color: white;
  }

  .new-task-submit {
    padding: 0 0.5rem;
  }
}
</style>

<script>
import axios from "axios";

export default {
  name: "CreateTask",
  emits: ['refreshTasks'],
  methods: {
    async createTask() {
      try {
        const response = await axios.post('tasks/create', {
          name: this.name,
        });

        if (!response.data.uuid) throw new Error('Property UUID was not found in response: ' +
            JSON.stringify(response));

        this.$emit('refreshTasks');
      } catch (error) {
        console.error(error);
        alert('Could not create the new task. Please try again or refresh the page if the error persists');
      }
    }
  },
  data() {
    return {
      name: '',
    }
  },
}
</script>
