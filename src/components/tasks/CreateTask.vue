<template>
  <form class="new-task-form" @submit.prevent="createTask(); clearInputField();">
    <input v-model="name" autocomplete="off" class="task-input" placeholder="New task" required type="text"/>
    <button class="new-task-submit material-symbols-outlined" type="submit">add</button>
  </form>
</template>

<style lang="scss">
@import "@/scss/globals.scss";

.new-task-form {
  display: flex;
  gap: 0.5rem;

  .task-input {
    flex: 1;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5em;
    font-size: 1rem;
    outline: $theme solid 0.1rem;

    &:focus {
      outline: darken($theme, 10) dashed 0.1rem;
    }

    &::placeholder {
      color: darken($bg, 20);
    }
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
      color: $theme;
      background: lighten($theme, 40);
      border: none;
      border-radius: 0.5rem;
      outline: $theme solid 0.1rem;
      box-shadow: inset 0 0 0.2rem white,
      0 0 0.2rem darken($theme, 20);
      transition: all 250ms;

      &:hover, &:focus {
        //font-size: 2rem;
        background: lighten($theme, 42.5);
        transform: scale(1.05) translateZ(0);
      }
    }
  }
}
</style>

<script>
import axios from "axios";

export default {
  name: "CreateTask",
  methods: {
    clearInputField() {
      this.name = "";
    },
    async createTask() {
      try {
        const response = await axios.post("tasks/", {
          name: this.name,
        });

        if (!response.data.taskId) throw new Error(`Missing taskId in response body: ${ JSON.stringify(response) }`);

        this.$store.dispatch("loadTasks");
      } catch (error) {
        console.error(error);
        alert("Could not create the new task. Please try again or refresh the page if the error persists");
      }
    },
  },
  created() {
    // Confirm that the user doesn't want to save their changes.
    // Unsaved changes are, e.g., that the task name is not empty (falsy).
    const $this = this;
    window.addEventListener("beforeunload", function (event) {
      if (!$this.name) return;
      event.preventDefault();
      event.returnValue = "";
    });
  },
  beforeMount() {
    // Load potential unsaved changes from local storage
    if (localStorage["newTaskName"]) this.name = localStorage["newTaskName"];
  },
  beforeUnmount() {
    // Save unsaved changes to local storage
    if (this.name) localStorage["newTaskName"] = this.name;
    // There are no unsaved changes => remove key
    else delete localStorage["newTaskName"];
  },
  data() {
    return {
      name: "",
    };
  },
};
</script>
