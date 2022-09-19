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
    outline: var(--primary-color-500) solid 0.1rem;
    background: var(--primary-color-900-0\.9);

    &:focus {
      outline-style: dashed;
    }

    &::placeholder {
      color: var(--primary-color-800);
    }
  }

  .new-task-submit {
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 0 0.5rem;
    border: none;

    // If the button is a material icons buttons
    &.material-symbols-outlined {
      color: var(--primary-color-500);
      background: var(--primary-color-500-0\.7);
      border: none;
      border-radius: 0.5rem;
      outline: var(--primary-color-500) solid 0.1rem;
      box-shadow: inset 0 0 0.1rem white,
      0 0 0.2rem var(--primary-color-300);
      transition: all 50ms ease-in-out;

      &:hover, &:focus {
        //font-size: 2rem;
        background: var(--primary-color-500-0\.5);
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
  emits: ["taskCreated"],
  methods: {
    clearInputField() {
      this.name = "";
    },
    async createTask() {
      let taskId;
      try {
        const response = await axios.post("tasks/", { name: this.name });
        if (response.data?.taskId == null) throw new Error(`Missing taskId in response: ${ JSON.stringify(response) }`);
        taskId = response.data.taskId;
      } catch (error) {
        console.error(error);
        alert("The task could not be created");
      }

      try {
        await this.$store.dispatch("loadTasks");
        if (taskId != null) {
          const task = this.$store.state.tasks.find(t => t.id === taskId);
          if (task != null) {
            this.$emit("taskCreated", task);
          }
        }
      } catch (e) {
        console.error(e);
        alert(`Could not reload your tasks: ${ e.message }`);
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
