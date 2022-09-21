<template>
  <div class="calendar-view">
    <div class="page-header">
      <h1 class="page-title">Calendar</h1>
      <div class="nav-button-container">
        <input :max="20"
               :min="1"
               :value="numDaysBetweenStartAndEnd"
               class="num-days-input"
               title="Number of visible days in the calendar"
               type="range"
               @input="setDaysBetweenStartAndEndDate(Math.min(20, Math.max($event.target.value, 1)) - 1)"
        />
        <button class="nav-button material-symbols-outlined"
                @click="advanceCalendarByDays(-1)"
        >chevron_left
        </button>
        <button class="nav-button material-symbols-outlined"
                @click="advanceCalendarByDays(1)"
        >chevron_right
        </button>
      </div>
    </div>
    <calendar v-model:end-date="calendarEndDate"
              v-model:start-date="calendarStartDate"
              :tasks="tasks"
              class="calendar-component"
              @create-task="createTask"></calendar>
  </div>
</template>

<style lang="scss">
@import "@/scss/globals.scss";

.calendar-view {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: $color;

  .page-header {
    display: flex;
    background: var(--primary-color-900-0\.9);
    padding: 1rem;
    border-radius: 1rem;
    justify-content: space-between;

    .nav-button-container {
      display: flex;
      gap: 0.5em;
    }

    .num-days-input {
      font-size: 1.75em;
      border: none;
      background: transparent;
    }

    .nav-button {
      font-size: 2em;
      padding: 0;
      margin: 0;
      background: transparent;
      border: none;
      transition: color 250ms ease;

      &:hover {
        color: var(--primary-color-500);
      }
    }
  }

  .page-title {
    margin: 0;
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
import moment from "moment";

export default {
  name: "CalendarView",
  components: { Calendar },
  computed: {
    tasks() {
      return this.$store.state.tasks;
    },
    numDaysBetweenStartAndEnd() {
      return moment(this.calendarEndDate).diff(this.calendarStartDate, "days") + 1;
    },
  },
  methods: {
    addDaysToStartDate(numDays) {
      console.log(numDays);
      console.log(this.calendarStartDate);
      this.calendarStartDate = moment(this.calendarStartDate).add(numDays, "days");
      console.log(this.calendarStartDate);
    },
    addDaysToEndDate(numDays) {
      this.calendarEndDate = moment(this.calendarEndDate).add(numDays, "days");
    },
    setDaysBetweenStartAndEndDate(numDays) {
      this.calendarEndDate = moment(this.calendarStartDate).add(numDays, "days");
    },
    advanceCalendarByDays(numDays) {
      this.addDaysToEndDate(numDays);
      this.addDaysToStartDate(numDays);
    },
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
  data() {
    return {
      calendarStartDate: moment().startOf("isoWeek"),
      calendarEndDate: moment().endOf("isoWeek"),
    };
  },
};
</script>
