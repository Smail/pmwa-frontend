<template>
  <div class="calendar-view">
    <h1>Calendar</h1>
    <calendar :tasks="tasks" class="calendar-component"></calendar>
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

export default {
  name: "CalendarView",
  components: { Calendar },
  computed: {
    tasks() {
      return this.$store.state.tasks;
    },
  },
  created() {
    this.$store.dispatch("loadTasks").catch(e => alert(e));
  },
};
</script>
