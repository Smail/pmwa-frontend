<template>
  <context-menu ref="context-menu"
                class="context-menu_calendar-task"
                @opened="$emit('opened')"
                @closed="$emit('closed')">
    <input class="" type="text" :value="task.name" @input="updateTaskName($event.target.value)">
    <ul>
      <li>
        <delete-button title="Delete task" @click="$emit('deleteTask')">
          Delete
        </delete-button>
      </li>
    </ul>
  </context-menu>
</template>

<script>
import ContextMenu from "@/components/contextMenu/ContextMenu";
import DeleteButton from "@/components/common/DeleteButton";

export default {
  name: "CalendarTaskContextMenu",
  components: { DeleteButton, ContextMenu },
  emits: ["update:taskName", "opened", "closed", "deleteTask"],
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    contextMenuRef() {
      return this.$refs["context-menu"];
    },
    isHidden() {
      return this.contextMenuRef.isHidden;
    },
  },
  methods: {
    updateTaskName(name) {
      this.$store.commit("updateTask", { id: this.task.id, name });
    },
  },
  mounted() {
  },
  beforeUnmount() {
  },
};
</script>

<style lang="scss">
@import "@/scss/globals.scss";

.context-menu_calendar-task {
  padding: 0.5em;

  input[type=text] {
    background: transparent;
    border: none;
    font-size: inherit;
    padding: 0.25em;
    font-weight: bold;

    &:focus {
      outline: thin dashed var(--primary-color-500);
    }
  }

  ul {
    display: flex;
    flex-direction: column;

    li {
      display: flex;
    }
  }

  .delete-btn {
    flex: 1;
    justify-content: space-between;
  }
}
</style>
