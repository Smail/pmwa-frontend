<template>
  <form class="new-task-form" @submit.prevent="createTask(); clearInputField();">
    <input v-model="name" autocomplete="off" class="task-input" placeholder="New task" required type="text"/>
    <button class="new-task-submit material-symbols-outlined" type="submit">add</button>
  </form>
</template>

<style lang="scss">
.new-task-form {
  display: flex;
  gap: 0.5rem;
  $color: rgb(0, 122, 255);

  .task-input {
    flex: 1;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5em;
    font-size: 1rem;
    outline: $color solid 0.1rem;

    &:focus {
      outline: darken($color, 10) dashed 0.1rem;
    }
  }

  .task-input::placeholder {
    color: white;
  }

  .new-task-submit {
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 0 0.5rem;
    border: none;
    background: inherit;

    // If the button is a material icons buttons
    &.material-symbols-outlined {
      $color: rgb(0, 122, 255);
      color: $color;
      background: lighten($color, 40);
      border: none;
      border-radius: 0.5rem;
      outline: $color solid 0.1rem;
      box-shadow: inset 0 0 0.2rem white,
      0 0 0.2rem darken($color, 20);
      transition: all 250ms;

      &:hover, &:focus  {
        //font-size: 2rem;
        background: lighten($color, 42.5);
        transform: scale(1.05) translateZ(0) ;
      }
    }
  }
}
</style>

<script>
import axios from "axios";

export default {
  name: "CreateTask",
  emits: ['refreshTasks'],
  methods: {
    clearInputField() {
      this.name = '';
    },
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
  created() {
    // Confirm that the user doesn't want to save their changes.
    // Unsaved changes are, e.g., that the task name is not empty (falsy).
    const $this = this;
    window.addEventListener('beforeunload', function (event) {
      if (!$this.name) return;
      event.preventDefault();
      event.returnValue = '';
    });
  },
  beforeMount() {
    // Load potential unsaved changes from local storage
    if (localStorage['newTaskName']) this.name = localStorage['newTaskName'];
  },
  beforeUnmount() {
    // Save unsaved changes to local storage
    if (this.name) localStorage['newTaskName'] = this.name;
    // There are no unsaved changes => remove key
    else delete localStorage['newTaskName'];
  },
  data() {
    return {
      name: '',
    }
  },
}
</script>
