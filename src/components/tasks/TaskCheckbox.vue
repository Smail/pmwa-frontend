<template>
  <custom-checkbox :is-checked="task.isDone"
                   :title="`Mark task as ${task.isDone ? 'not ' : ''}done`"
                   @focusout="emitNeedsServerUpdate"
                   @input="setIsDone(!task.isDone); $emit('input')"
  ></custom-checkbox>
</template>

<script>
import CustomCheckbox from "@/components/CustomCheckbox";

export default {
  name: "TaskCheckbox",
  components: { CustomCheckbox },
  emits: ["input", "needsServerUpdate"],
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  methods: {
    setIsDone(value) {
      this.$store.commit("updateTask", { isDone: value, id: this.task.id });
    },
    emitNeedsServerUpdate() {
      // Check if server update is necessary
      if (this.task.isDone !== this.lastServerUpdate) {
        this.$emit("needsServerUpdate");
      }
    },
  },
  data() {
    return {
      lastServerUpdate: this.task.isDone,
    };
  },
};
</script>

<style scoped>

</style>
