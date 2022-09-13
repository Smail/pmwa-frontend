<template>
  <section class="extensive-task-view" @focusout="update">
    <div class="meta-input-wrapper">
      <input :checked="task.isDone" class="task-is-done-checkbox"
             type="checkbox"
             @input="changes.isDone = $event.target.checked"/>
      <!--
      Use focusout instead of input,
      because otherwise inputValueStartDate throws invalid date errors when entering the date via keyboard.
      The date value is only updated when the user has finished typing it in and is validated by the browser,
      when done with focusout.
      -->
      <input :value="inputValueStartDate" class="date-picker" title="Task start date"
             type="datetime-local"
             @focusout="changes.startDate = $event.target.value"/>
      <input :value="inputValueEndDate" class="date-picker" title="Task end date"
             type="datetime-local"
             @focusout="changes.endDate = $event.target.value"/>
    </div>
    <h1 class="header" contenteditable="true"
        @input="changes.name = $event.target.innerText">
      {{ task.name }}
    </h1>
    <textarea class="task-content"
              @input="changes.content = $event.target.value"
    >{{ task.content }}</textarea>
  </section>
</template>

<script>
import moment from "moment";

export default {
  name: "ExtensiveTaskView",
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    inputValueStartDate() {
      if (this.startDate == null) return null;
      return moment(this.startDate).format(moment.HTML5_FMT.DATETIME_LOCAL);
    },
    inputValueEndDate() {
      if (this.endDate == null) return null;
      return moment(this.endDate).format(moment.HTML5_FMT.DATETIME_LOCAL);
    },
    startDate() {
      if (this.changes.startDate != null) return moment(this.changes.startDate);
      return this.task.startDate != null ? moment(this.task.startDate) : null;
    },
    endDate() {
      if (this.changes.endDate != null) return moment(this.changes.endDate);
      return this.task.endDate != null ? moment(this.task.endDate) : null;
    },
    hasStartDate() {
      return this.startDate != null;
    },
    hasEndDate() {
      return this.changes.endDate != null || this.task.endDate != null;
    },
  },
  methods: {
    async update() {
      if (Object.keys(this.changes).length === 0) return;

      if (this.changes.startDate != null) this.changes.startDate = moment(this.changes.startDate);
      if (this.changes.endDate != null) this.changes.endDate = moment(this.changes.endDate);

      // If start date has changed, redo the end date computation
      // to avoid scenarios where the end date is before the start date.
      if (this.changes.startDate != null && this.changes.endDate == null) {
        // Create end date by adding the duration of the task to its start date.
        this.changes.endDate = moment(this.changes.startDate);
      }

      if (this.changes.startDate != null && this.changes.startDate.toDate().toString() === "Invalid Date") {
        alert("An error occurred: Invalid start date");
        throw new Error("Invalid start date");
      } else if (this.changes.startDate != null) {
        this.changes.startDate = this.changes.startDate.toISOString();
      }

      if (this.changes.endDate != null && this.changes.endDate.toDate().toString() === "Invalid Date") {
        alert("An error occurred: Invalid end date");
        throw new Error("Invalid end date");
      } else if (this.changes.endDate != null) {
        this.changes.endDate = this.changes.endDate.toISOString();
      }

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
