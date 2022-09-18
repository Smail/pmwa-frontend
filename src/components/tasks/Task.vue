<template>
  <div class="task" @focusout="update" @keydown.enter="removeFocus">
    <task-checkbox :task="task"
                   @input="$emit('taskSelected', task)"
                   @needs-server-update="changes.isDone = task.isDone"></task-checkbox>
    <div class="task-input-tag-wrapper"
         @click="$emit('taskSelected', task)">
      <input :value="task.name" autocomplete="off" class="task-input" type="text"
             @input="changes.name = $event.target.value"/>
      <tag-list :tags="tags"></tag-list>
    </div>
    <button class="delete-task-btn material-symbols-outlined"
            type="button"
            @click="deleteTask(); $emit('taskDeleted', task)"
    >delete
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import "@/scss/globals.scss";

.task {
  display: flex;
  gap: 0.5rem;

  .task-input-tag-wrapper {
    flex: 1;
    display: flex;
    outline: $theme solid 0.1rem;
    border-radius: 0.25rem;
    padding: 0.5em;
    background: $bg;

    &:focus-within {
      outline: darken($theme, 10) dashed 0.1rem;
    }

    .task-input {
      outline: none;
      background: transparent;
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

    // If the button is a material icons buttons
    &.material-symbols-outlined {
      color: $red;
      background: transparentize($red, 0.7);
      border: none;
      border-radius: 0.5rem;
      outline: $red solid 0.1rem;
      box-shadow: inset 0 0 0.1rem white,
      0 0 0.2rem darken($red, 20);
      transition: all 50ms ease-in-out;

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
  emits: ["taskSelected", "taskDeleted"],
  props: {
    task: {
      type: Object,
      required: true,
      // TODO add validator
    },
  },
  methods: {
    async requestTags() {
      const response = await this.$http.get(`tasks/${ this.task.id }/tags`);
      // Sort array lexicographically based on property "name"
      response.data.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()));
      response.data.forEach(tag => this.tags.push(tag));
    },
    removeFocus() {
      document.activeElement.blur();
    },
    update() {
      if (Object.keys(this.changes).length === 0) return;
      this.$store.dispatch("updateTaskOnlyServer", { ...this.changes, id: this.task.id }).catch(e => {
        alert(e);
        this.$store.dispatch("loadTasks", { ...this.changes, id: this.task.id })
            .catch(e => alert(`Could not reload tasks: ${ e.message }`));
      });
      this.changes = {};
    },
    deleteTask() {
      this.$store.dispatch("deleteTask", this.task.id).catch(e => {
        alert(e);
        this.$store.dispatch("loadTasks", { ...this.changes, id: this.task.id })
            .catch(e => alert(`Could not reload tasks: ${ e.message }`));
      });
    },
  },
  async created() {
    await this.requestTags().catch(e => console.error("Could not load tags: %s\n%s",
        e.message + (e.response?.data != null ? (". " + e.response.data) : ""), JSON.stringify(e)));
    // Save changes when user leaves the page without unnecessarily notifying them.
    window.addEventListener("beforeunload", () => this.update());
  },
  data() {
    return {
      changes: {},
      tags: [],
    };
  },
};
</script>
