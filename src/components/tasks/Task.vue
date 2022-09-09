<template>
  <div class="task" @focusout="update" @keydown.enter="removeFocus">
    <input v-model="taskModel.isDone" autocomplete="off" class="task-checkbox" type="checkbox"/>
    <div class="task-input-tag-wrapper">
      <input v-model="taskModel.name" autocomplete="off" class="task-input" type="text"/>
      <tag-list :task-uuid="task.uuid"></tag-list>
    </div>
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

  .task-input-tag-wrapper {
    $color: rgb(0, 122, 255);
    flex: 1;
    display: flex;
    outline: $color solid 0.1rem;
    border-radius: 0.25rem;
    padding: 0.5em;
    background: white;

    &:focus-within {
      outline: darken($color, 10) dashed 0.1rem;
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
    $color: rgb(255, 59, 48);
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 0 0.5rem;
    border: none;
    background: inherit;

    // If the button is a material icons buttons
    &.material-symbols-outlined {
      color: $color;
      background: lighten($color, 30);
      border: none;
      border-radius: 0.5rem;
      outline: $color solid 0.1rem;
      box-shadow: inset 0 0 0.2rem white,
      0 0 0.2rem darken($color, 20);
      transition: all 250ms;

      &:hover, &:focus {
        //font-size: 2rem;
        background: lighten($color, 35);
        transform: scale(1.05) translateZ(0);
      }
    }
  }
}
</style>

<script>
import axios from "axios";
import TagList from "@/components/tasks/TagList";

export default {
  name: "Task",
  components: { TagList },
  props: {
    "task": {
      type: Object,
      required: true,
      // TODO add validator
    },
  },
  emits: ["refreshTasks"],
  watch: {
    task(newTask, oldTask) {
      this.taskModel = newTask;
    },
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
    changedData() {
      const data = {};

      if (this.oldModel.name !== this.name) data["name"] = this.name;
      if (this.oldModel.isDone !== this.isDone) data["isDone"] = this.isDone;
      if (this.oldModel.content !== this.content) data["content"] = this.content;

      return data;
    },
  },
  methods: {
    removeFocus() {
      document.activeElement.blur();
    },
    async update() {
      const data = { uuid: this.uuid, ...this.changedData };

      // Check if any data was updated. Data was updated if the changedData object has more keys than one key.
      // Hence, if the length of data is 1, it means changedData has length 0: 1 + 0 = 1 => nothing has changed.
      if (Object.keys(data).length === 1) return;

      try {
        await axios.post("tasks/update", data);
        this.oldModel = structuredClone(this.taskModel);
        this.$emit("refreshTasks");
      } catch (error) {
        console.error(error);
      }
    },
    async deleteTask() {
      try {
        await axios.delete(`tasks/${ this.uuid }`);
        this.$emit("refreshTasks");
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    // Save changes when user leaves the page without unnecessarily notifying them.
    window.addEventListener("beforeunload", () => this.update());
  },
  data() {
    return {
      taskModel: structuredClone(this.task),
      oldModel: structuredClone(this.task),
    };
  },
};
</script>
