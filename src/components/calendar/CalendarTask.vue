<template>
  <template v-for="(_, dayIdx) in numDays">
    <div v-if="isDateVisible(createMoment(startDate).add(dayIdx, 'days'))"
         :class="{ 'is-dragging': isDragging }"
         :style="{
            // Rows = hours. Columns = days
            // Start from 0 o'clock if it is a continued div/day
            gridRowStart: `d${normalizeDay(startDate.isoWeekday() + dayIdx)}${dayHourStart(dayIdx)}-${weekSegment(createMoment(startDate).add(dayIdx, 'days'))}`,
            // Max value of hour value encoded in grid-area: 23, e.g., max. is d123 (= day 1, hour 23) and NOT d124
            // ((endDate.hours() === 0 ? 24 : endDate.hours()) - 1)
            gridRowEnd: `d${normalizeDay(startDate.isoWeekday() + dayIdx)}${dayHourEnd(dayIdx) - 1}-${weekSegment(createMoment(startDate).add(dayIdx, 'days'))}`,
            gridColumnStart: `d${normalizeDay(startDate.isoWeekday() + dayIdx)}0-${weekSegment(createMoment(startDate).add(dayIdx, 'days'))}`,
            gridColumnEnd: `d${normalizeDay(startDate.isoWeekday() + dayIdx)}0-${weekSegment(createMoment(startDate).add(dayIdx, 'days'))}`,
          }"
         class="task"
         draggable="true"
         @dblclick="$emit('open-task')"
         @drag="$emit('moveTask', $event, task)"
         @dragend="isDragging = false; $emit('moveFinished')"
         @dragstart="isDragging = true"
    >
      <div v-if="dayIdx === 0" class="task-content">
        <h4 class="task-header">{{ task.name }}</h4>
        <h5 class="task-header-time-annotation">
          {{ localeTimeString(startDate) }} - {{ localeTimeString(endDate) }}
        </h5>
        <p class="task-description">{{ task.description }}</p>
      </div>
      <div v-if="dayIdx === numDays - 1"
           :data-end="endDate" :data-start="startDate"
           class="drag-div"
           draggable="true"
           @drag="$emit('resizeTimeslot', $event, task)"
           @dragend="isDragging = false; $emit('resizeFinished')"
           @dragstart="isDragging = true"
      >
      </div>
    </div>
  </template>
</template>

<script>
import moment from "moment";

export default {
  name: "CalendarTask",
  emits: ["moveTask", "resizeTimeslot", "resizeFinished", "moveFinished", "open-task"],
  props: {
    task: {
      type: Object,
      required: true,
    },
    // List of String encoded dates
    weekDistributionDates: {
      type: Array,
      required: true,
    },
  },
  computed: {
    firstVisibleDay() {
      return this.weekDistributionDates[0];
    },
    lastVisibleDay() {
      return this.weekDistributionDates[this.weekDistributionDates.length - 1];
    },
    numDays() {
      let d = 0;
      // Prevent infinite loop.
      // Set a safe upper bound, i.e., one that won't interfere with the rendering/user experience, to prevent
      // a stack overflow or hung up.
      // It is irrelevant if the numDays are larger than the displayable length of the week.
      // The 5 is arbitrary.
      for (let i = 0; d < this.weekDistributionDates.length + 5; i++) {
        const m = moment(this.startDate).add(i, "days");
        d += 1;
        if (this.endDate.isSame(m, "days")) {
          // Check if the tasks ends at midnight.
          // If so, prevent drawing another full next day or rather switch to the next day.
          // If this is removed, then the application will interpret 0:00 as the time for the next day at 24 o'clock.
          if (moment(this.endDate).hour() === 0) d -= 1;
          break;
        }
      }

      return d;
    },
    startDate() {
      return moment(this.task.startDate);
    },
    endDate() {
      return moment(this.task.endDate);
    },
    dates() {
      const dates = [];
      const currDate = moment(this.startDate).startOf("day");
      const lastDate = moment(this.endDate).startOf("day");

      while (currDate.add(1, "days").diff(lastDate) < 0) {
        dates.push(currDate.clone().toDate());
      }

      return dates;
    },
    weekNrs() {
      const weekNrs = [];
      for (let i = 0; i < this.weekDistributionDates.length; i += 7) {
        console.log(`week = ${ Math.floor(i / 7) }`);
      }

      for (const date of this.dates) {

      }

      return weekNrs;
    },
  },
  methods: {
    weekSegment(date) {
      const weeks = [];
      for (let i = 0; i < this.weekDistributionDates.length; i += 7) {
        const week = [];
        for (let j = 0; j < 7; j++) {
          if (i + j >= this.weekDistributionDates.length) break;
          week.push(this.weekDistributionDates[i + j]);
        }
        weeks.push(week);
      }

      // for (let i = 0; i < this.weekDistributionDates.length; i += 7) {
      //   for (let j = 0; j < Math.min(this.weekDistributionDates.length, 6); j++) {
      //     let a = moment(this.weekDistributionDates[j]).startOf("day");
      //     let b = a.isSame(date, "day");
      //
      //     if (b) return i;
      //   }
      // }

      // console.log(weeks);

      for (let weekNr = 0; weekNr < weeks.length; weekNr++) {
        for (const day of weeks[weekNr]) {
          let a = moment(day).startOf("day");
          let b = a.isSame(date, "day");
          if (b) {
            return weekNr;
          }
        }
      }
      throw new Error("");
    },
    createMoment(v) {
      return moment(v);
    },
    isDateVisible(m) {
      return m.isBetween(moment(this.firstVisibleDay), moment(this.lastVisibleDay), "days", "[]");
    },
    normalizeDay(day) {
      if (day === 7) return 7;
      return (day % 7);
    },
    localeTimeString(m) {
      return m.toDate()
          .toLocaleTimeString([this.$store.state.locale], { hour: "2-digit", minute: "2-digit" });
    },
    dayHourStart(dayIdx) {
      // The task segment, that doesn't necessarily start at 0:00h is the first one,
      // because it inherits the task's start time.
      return dayIdx === 0 ? this.startDate.hours() : 0;
    },
    dayHourEnd(dayIdx) {
      if (dayIdx < 0 || dayIdx >= this.numDays) throw new Error("Out of bounds: day index");
      if (dayIdx === this.numDays - 1) return this.endDate.hours() === 0 ? 24 : this.endDate.hours();
      if (dayIdx < this.numDays) return 24;
    },
  },
  data() {
    return {
      isDragging: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/globals.scss";

.task {
  cursor: pointer;
  color: $color;
  border: 1px solid var(--primary-color-500);
  background: var(--primary-color-500-0\.4);
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  &.is-dragging {
    box-shadow: 0 0.5rem 0.75rem -0.5rem black;
    background: var(--primary-color-600-0\.3);
  }

  .task-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    flex: 1;
    padding: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    text-align: left;

    * {
      cursor: text;
      user-select: text;
      margin-right: auto;
    }

    .task-header {
      font-size: 11pt;
      font-weight: bold;
    }

    .task-header-time-annotation {
      font-weight: normal;
      font-size: 9pt;
    }

    .task-description {
      font-size: 10pt;
    }
  }

  .drag-div {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1em;
    cursor: n-resize;
    user-select: none;
    white-space: nowrap;
    text-wrap: none;
    //background: lime;
    //color: transparent;
  }
}
</style>
