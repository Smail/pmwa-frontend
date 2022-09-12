<template>
  <section class="extensive-task-view">
    <!--    $emit('update:task', task)-->
    <h1 class="header" contenteditable="true"
        @focusout="update"
        @input="changes.name = $event.target.innerText">
      {{ task.name }}
    </h1>
    <textarea class="task-content"
              @focusout="update"
              @input="changes.content = $event.target.value"
    >{{ task.content }}</textarea>
  </section>
</template>

<script>
export default {
  name: "ExtensiveTaskView",
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async update() {
      if (Object.keys(this.changes).length === 0) return;
      await this.$store.dispatch("updateTask", { ...this.changes, id: this.task.id });
      this.changes = {};
    },
  },
  data() {
    return {
      changes: {},
    };
  },
};
</script>

<style lang="scss">
.extensive-task-view {
  display: flex;
  flex-direction: column;

  .header {
    text-align: left;
    border-radius: 1em;
    padding: 0 0.5em;

    &:focus {
      outline: 1px dashed #007AFF;
    }
  }

  .task-content {
    resize: none;
    flex: 1;
    background: transparent;
    font: inherit;
    border: none;
    margin-top: 1rem;
    padding: 0.5em;

    &:focus {
      outline: 1px dashed #007AFF;
    }
  }
}
</style>
