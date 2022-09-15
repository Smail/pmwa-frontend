<template>
  <div class="calendar-view">
    <h1>Calendar</h1>
    <calendar :tasks="tasks" class="calendar-component" @create-task="createTask"></calendar>
  </div>
</template>

<style lang="scss">
.calendar-view {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h1 {
    margin: 0;
    align-self: stretch;
    text-align: left;
    background-color: whitesmoke;
    padding: 1rem;
    border-radius: 1rem;
  }

  .calendar-component {
    flex: 1;
  }
}
</style>

<script>
import Calendar from "@/components/calendar/Calendar.vue";
import axios from "axios";
import { logErrorAndAlert } from "@/util/logErrorAndAlert";

export default {
  name: "CalendarView",
  components: { Calendar },
  computed: {
    tasks() {
      return this.$store.state.tasks;
    },
  },
  methods: {
    async createTask(task) {
      try {
        const response = await axios.post("tasks/", task);
        if (response.data?.taskId == null) throw new Error(`Missing taskId in response: ${ JSON.stringify(response) }`);
      } catch (e) {
        logErrorAndAlert(e.message, "The task could not be created");
      }

      this.$store.dispatch("loadTasks")
          .catch(e => logErrorAndAlert(e.message, `Could not reload your tasks: ${ e.message }`));
    },
  },
  created() {
    this.$store.dispatch("loadTasks").catch(e => alert(e));
  },
};
</script>
