<template>
  <template v-for="(_, dayIdx) in numDays">
    <div v-if="isValidStartDate"
         :class="{ 'is-dragging': isDragging }"
         :style="{
            // Rows = hours. Columns = days
            // Start from 0 o'clock if it is a continued div/day
            gridRowStart: `d${normalizeDay(startDate.isoWeekday() + dayIdx)}${dayHourStart(dayIdx)}`,
            // Max value of hour value encoded in grid-area: 23, e.g., max. is d123 (= day 1, hour 23) and NOT d124
            // ((endDate.hours() === 0 ? 24 : endDate.hours()) - 1)
            gridRowEnd: `d${normalizeDay(startDate.isoWeekday() + dayIdx)}${dayHourEnd(dayIdx) - 1}`,
            gridColumnStart: `d${normalizeDay(startDate.isoWeekday() + dayIdx)}0`,
            gridColumnEnd: `d${normalizeDay(startDate.isoWeekday() + dayIdx)}0`,
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
           @dragend="$emit('resizeFinished')">
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
      for (let i = 0; true; i++) {
        d += 1;
        const m = moment(this.startDate).add(i, "days");
        if (this.endDate.isSame(m, "days")) {
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
  },
  methods: {
    normalizeDay(day) {
      if (day === 7) return 7;
      return (day % 7);
    },
    localeTimeString(m) {
      return m.toDate()
          .toLocaleTimeString([this.$store.state.locale], { hour: "2-digit", minute: "2-digit" });
    },
    dayHourStart(dayIdx) {
      // The only day, that doesn't start at 0 o'clock is the first one
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
  color: white;
  border: 1px solid $theme;
  background: rgba($theme, 0.6);
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  &.is-dragging {
    box-shadow: 0 0 1rem 0.5rem white;
    background: lighten(rgba($theme, 0.6), 10);
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
