<template>
  <div class="task" @focusout="update" @keydown.enter="removeFocus">
    <task-checkbox :task="task"
                   @input="$emit('taskSelected', task)"
                   @needs-server-update="changes.isDone = task.isDone"></task-checkbox>
    <div class="task-input-tag-wrapper">
      <input :value="task.name" autocomplete="off" class="task-input" type="text"
             @input="changes.name = $event.target.value"/>
      <tag-list :task-id="task.id"></tag-list>
    </div>
    <button class="delete-task-btn material-symbols-outlined" @click="deleteTask">delete</button>
  </div>
</template>

<style lang="scss" scoped>
@import "@/scss/globals.scss";

.task {
  display: flex;
  gap: 0.5rem;

  .task-checkbox {
    cursor: pointer;
  }

  .task-input-tag-wrapper {
    $color: rgb(0, 122, 255);
    flex: 1;
    display: flex;
    outline: $theme solid 0.1rem;
    border-radius: 0.25rem;
    padding: 0.5em;
    background: white;

    &:focus-within {
      outline: darken($theme, 10) dashed 0.1rem;
    }

    .task-input {
      outline: none;
      background: inherit;
      flex: 1;
      border: none;
      font-size: 1rem;
    }
  }

  .delete-task-btn {
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 0 0.5rem;
    border: none;
    background: inherit;

    // If the button is a material icons buttons
    &.material-symbols-outlined {
      color: $red;
      background: lighten($red, 30);
      border: none;
      border-radius: 0.5rem;
      outline: $red solid 0.1rem;
      box-shadow: inset 0 0 0.2rem white,
      0 0 0.2rem darken($red, 20);
      transition: all 250ms;

      &:hover, &:focus {
        //font-size: 2rem;
        background: lighten($red, 35);
        transform: scale(1.05) translateZ(0);
      }
    }
  }
}
</style>

<script>
import TagList from "@/components/tasks/TagList";
import TaskCheckbox from "@/components/tasks/TaskCheckbox";

export default {
  name: "Task",
  components: { TaskCheckbox, TagList },
  emits: ["taskSelected"],
  props: {
    task: {
      type: Object,
      required: true,
      // TODO add validator
    },
  },
  methods: {
    removeFocus() {
      document.activeElement.blur();
    },
    async update() {
      if (Object.keys(this.changes).length === 0) return;
      await this.$store.dispatch("updateTask", { ...this.changes, id: this.task.id });
      this.changes = {};
    },
    async deleteTask() {
      await this.$store.dispatch("deleteTask", this.task.id);
    }
  },
  created() {
    // Save changes when user leaves the page without unnecessarily notifying them.
    window.addEventListener("beforeunload", () => this.update());
  },
  data() {
    return {
      changes: {},
    };
  },
};
</script>
