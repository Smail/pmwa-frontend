<template>
  <div class="calendar">
    <h1>Calendar</h1>
    <calendar class="calendar-component"></calendar>
  </div>
</template>

<style lang="scss">
.calendar {
  display: flex;
  flex-direction: column;

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
import Calendar from "@/components/Calendar.vue";

export default {
  name: 'CalendarView',
  components: { Calendar }
}
</script>