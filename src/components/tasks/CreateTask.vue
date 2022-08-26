<template>
  <form class="new-task-form" @submit.prevent="createTask">
    <input class="new-task-content" type="text" autocomplete="off" v-model="content"/>
    <button class="new-task-submit" type="submit">Add</button>
  </form>
</template>

<style lang="scss">
.new-task-form {
  display: flex;
  gap: 0.5rem;

  .new-task-content {
    flex: 1;
  }

  .new-task-submit {}
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
          content: this.content
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
      content: '',
    }
  },
}
</script>
