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

    <context-menu>
      <ul class="context-menu-content_task">
        <li style="display: flex; flex-direction: column;">
          <h5 style="align-self: flex-start; cursor: default;">Priority</h5>
          <ul class="priority-list">
            <li>
              <button type="button" class="priority_none" @click="setPriority('none')">-</button>
            </li>
            <li>
              <button type="button" class="priority_low" @click="setPriority('low')">!</button>
            </li>
            <li>
              <button type="button" class="priority_medium" @click="setPriority('medium')">!!</button>
            </li>
            <li>
              <button type="button" class="priority_high" @click="setPriority('high')">!!!</button>
            </li>
          </ul>
        </li>

        <li>
          <span class="material-symbols-outlined">star</span>
        </li>

        <li>
          <button class="delete-task-btn"
                  type="button"
                  @click="deleteTask(); $emit('taskDeleted', task)"
          >
            Delete
            <span class="material-symbols-outlined">delete</span>
          </button>

        </li>
      </ul>
    </context-menu>
  </div>
</template>

<style lang="scss" scoped>
@import "@/scss/globals.scss";

.priority-list {
  display: flex;
  justify-content: space-between;
  flex: 1;
  gap: 0.5em;

  @mixin priority($color) {
    color: $color;
    background: transparentize($color, 0.8);
    border: thin solid $color;
    transition: background 50ms linear;

    &:hover {
      background: transparentize($color, 0.6);
    }
  }

  li {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;;

    button {
      @include priority(white);
      flex: 1;
      border-radius: 1em;
    }
  }

  .priority_low {
    @include priority(yellow);
  }

  .priority_medium {
    @include priority(orange);
  }

  .priority_high {
    @include priority(red);
  }
}

.task {
  display: flex;
  gap: 0.5rem;

  .task-input-tag-wrapper {
    flex: 1;
    display: flex;
    outline: var(--primary-color-500) solid 0.1rem;
    border-radius: 0.25rem;
    transition: background $bg-transition-params;
    padding: 0.5em;
    background: var(--primary-color-900-0\.9);

    &:focus-within {
      outline-style: dashed;
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
    justify-content: center;
    padding: 0 0.5rem;
    border: none;
    color: $red;
    background: transparentize($red, 0.7);
    border-radius: 0.5rem;
    outline: $red solid 0.1rem;
    transition: all 50ms ease-in-out;

    &:hover, &:focus {
      //font-size: 2rem;
      background: transparentize($red, 0.5);
      transform: scale(1.05) translateZ(0);
    }
  }
}

.context-menu-content_task {
  display: flex;
  padding: 0.5rem;
  flex-direction: column;

  .delete-task-btn {
    flex: 1;
    justify-content: space-between;
    padding: 0.5em;

    &:hover {
      transform: none;
    }
  }
}
</style>

<script>
import TagList from "@/components/tasks/TagList";
import TaskCheckbox from "@/components/tasks/TaskCheckbox";
import ContextMenu from "@/components/ContextMenu";

export default {
  name: "Task",
  components: { ContextMenu, TaskCheckbox, TagList },
  emits: ["taskSelected", "taskDeleted"],
  props: {
    task: {
      type: Object,
      required: true,
      // TODO add validator
    },
  },
  methods: {
    setPriority(priority) {
      this.priority = priority;
    },
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
      priority: "none",
    };
  },
};
</script>
