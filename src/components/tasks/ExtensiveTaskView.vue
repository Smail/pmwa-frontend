<template>
  <section class="extensive-task-view" @focusout="update">
    <div class="meta-input-wrapper">
      <task-checkbox :task="task" @needs-server-update="changes.isDone = task.isDone"></task-checkbox>
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
import TaskCheckbox from "@/components/tasks/TaskCheckbox";

export default {
  name: "ExtensiveTaskView",
  components: { TaskCheckbox },
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
    update() {
      if (Object.keys(this.changes).length === 0) return;

      // Add an end date if there is a start date set, but no end date.
      if (this.changes.startDate != null && this.changes.endDate == null) {
        // Create end date by adding the duration of the task to its start date.
        this.changes.endDate = moment(this.changes.startDate).add(1, "hours").toISOString();
      }

      this.$store.dispatch("updateTaskOnlyServer", { ...this.changes, id: this.task.id })
          .then(_ => this.$store.commit("updateTask", { ...this.changes, id: this.task.id }))
          .catch(e => alert(e));
      this.changes = {};
    },
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

<style lang="scss">
@import "@/scss/globals.scss";

.extensive-task-view {
  $border-color: darken($bg, 10);
  border-left: 0.1rem solid $border-color;
  display: flex;
  flex-direction: column;
  // Because of outline-offset of context and header
  padding-left: 1rem;

  // When using gap, the spellchecker extension causes the all elements to move, because it injects a hidden element
  // Resort to margin-top on each individual item
  .header, .task-content {
    margin-top: 1rem;
    $border-color: $theme;
  }

  .meta-input-wrapper {
    font-size: smaller;
    display: flex;
    gap: 0.5em;

    * {
      font: inherit;
    }

    .task-is-done-checkbox {
      // Increase size; set to same value as in .task-checkbox, i.e., checkbox in Task.vue component
      zoom: 1.5;
      // Background checkbox color when checked
      accent-color: rgb(0, 122, 255);
    }

    .date-picker,
    .duration-input-field {
      border: none;
      outline: 0.1em solid $border-color;
      padding: 0.5em;
      border-radius: 1em;
      background: white;
    }

    .date-picker:focus,
    .duration-input-field:focus {
      outline-style: dashed;
    }

    .duration-input-field {
      width: 4em;
      appearance: textfield;
    }
  }

  .header {
    text-align: left;
    border-radius: 0.5rem;
    outline-offset: 0.25em;

    &:focus {
      outline: 1px dashed $border-color;
    }
  }

  .task-content {
    resize: none;
    flex: 1;
    background: transparent;
    font: inherit;
    outline: none;
    margin-top: 1rem;
    padding: 0.5em;
    border-radius: 0.25em;
    border: 0.1rem solid $border-color;

    &:focus {
      border-style: dashed;
    }
  }
}
</style>
