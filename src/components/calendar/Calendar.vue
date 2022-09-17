<template>
  <div class="calendar">
    <!-- The names of the days, i.e., Monday, Tuesday, etc. -->
    <h4 v-for="(d, i) in weekDistributionWeekDays"
        :class="{ 'past-day': hasDatePast(weekDistributionDates[i]) }"
        :style="{ gridArea: dayStringShort(d - 1) }"
        class="day-header">
      {{ dayString(d - 1) }}
    </h4>
    <!-- Display time annotations, e.g., 15:00 on the left side of the calendar -->
    <template v-for="(_, h) in 24">
      <!-- Don't show 00:00 -->
      <p v-if="h > 0" :style="{ gridArea: `h${h}` }" class="time-annotation">
        {{ localeTimeString(h) }}
      </p>
    </template>
    <!-- The actual time slots -->
    <template v-for="(d, i) in weekDistributionWeekDays">
      <div v-for="(_, h) in 24"
           :class="{
              // Check if the current day is the last element of the array
              'border-right': d !== weekDistributionWeekDays.slice(-1)[0],
              'border-top': h > 0 && h < 24,
              'past-day': hasDatePast(createMoment(weekDistributionDates[i]).add(h, 'hour')),
              // Rounded corners for the time slot grid
              'border-top-left-radius': i === 0 && h === 0,
              'border-top-right-radius': i === weekDistributionWeekDays.length - 1 && h === 0,
              'border-bottom-left-radius': i === 0 && h === 23,
              'border-bottom-right-radius': i === weekDistributionWeekDays.length - 1 && h === 23,
            }"
           :style="{ gridArea: `d${d}${h}` }"
           class="hour"
           @click="createTask(createMoment(weekDistributionDates[i]).add(h, 'hour').toISOString())"
      >
      </div>
    </template>
    <!-- The task layer -->
    <template v-for="task in visibleTasks">
      <calendar-task :task="task"
                     :week-distribution-dates="weekDistributionDates"
                     @open-task="$router.push(`/tasks/${task.id}`)"
                     @move-task="moveTask"
                     @move-finished="updateServer(task.id, { startDate: task.startDate, endDate: task.endDate})"
                     @resize-timeslot="resizeTimeslot"
                     @resize-finished="updateServer(task.id, { endDate: task.endDate})"
      ></calendar-task>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import CalendarTask from "@/components/calendar/CalendarTask";

export default {
  name: "Calendar",
  components: { CalendarTask },
  emits: ["createTask"],
  props: {
    tasks: {
      type: Array,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
      // TODO Validator is end after/same start
    },
  },
  computed: {
    visibleTasks() {
      return this.tasks
          .filter(t => t.startDate != null)
          .filter(t => moment(t.endDate).isAfter(moment(this.startDate).startOf("day")))
          .filter(t => moment(t.startDate).isBefore(moment(this.endDate).endOf("day")));
    },
    numDays() {
      return this.weekDistributionWeekDays.length;
    },
    weekDistributionWeekDays() {
      return this.weekDistributionDates.map(date => date.isoWeekday());
    },
    weekDistributionDates() {
      const dates = [];
      // TODO clip small/large values

      for (let i = moment(this.startDate); i.isSameOrBefore(this.endDate); i.add(1, "days")) {
        dates.push(moment(i.toISOString()));
      }

      console.log(dates);

      return dates;
    },
    gridTemplateAreas() {
      let gridTemplateAreas;

      { // ". mon tue wed thu fri sat sun"
        gridTemplateAreas = `". `;
        for (const day of this.weekDistributionWeekDays) {
          console.log(day);
          gridTemplateAreas += `${ this.dayStringShort(day - 1) } `;
        }
        gridTemplateAreas += `" `;
      }

      { // "h0 d10 d20 d30 d40 d50 d60 d70"
        let current = moment(this.startDate);
        for (let hour = 0; hour < this.numHours; hour++) {
          gridTemplateAreas += `"h${ hour } `;
          for (const day of this.weekDistributionWeekDays) {
            gridTemplateAreas += `d${ day }${ hour } `;
          }
          gridTemplateAreas += `" `;
        }
      }

      return gridTemplateAreas.trim();
    },
  },
  methods: {
    createMoment(v) {
      return moment(v);
    },
    updateServer(id, changes) {
      if (id == null) throw new Error("Invalid argument: ID is null");
      if (changes == null) throw new Error("Invalid argument: changes is null");
      if (Object.keys(changes).length === 0) {
        console.warn("Argument 'changes' has no keys stored and hence an update is unnecessary");
        return;
      }
      this.$store.dispatch("updateTaskOnlyServer", { ...changes, id }).catch(e => alert(e));
    },
    dayString(day) {
      switch (day) {
        case 0:
          return "monday";
        case 1:
          return "tuesday";
        case 2:
          return "wednesday";
        case 3:
          return "thursday";
        case 4:
          return "friday";
        case 5:
          return "saturday";
        case 6:
          return "sunday";
        default:
          throw new Error("Invalid day value: " + day);
      }
    },
    dayStringShort(day) {
      switch (day) {
        case 0:
          return "mon";
        case 1:
          return "tue";
        case 2:
          return "wed";
        case 3:
          return "thu";
        case 4:
          return "fri";
        case 5:
          return "sat";
        case 6:
          return "sun";
        default:
          throw new Error("Invalid day value: " + day);
      }
    },
    resizeTimeslot(event, task) {
      // Prevents also calling moveTask
      event.stopPropagation();
      const timeSlots = document.getElementsByClassName("hour");
      // TODO filter for the timeslots that are in the future by grid row/column start/end
      for (const timeSlot of timeSlots) {
        // There can only be one correct timeslot
        const clientRect = timeSlot.getBoundingClientRect();

        // Get the time slot over which the mouse (event) hovers
        if (event.clientX >= clientRect.left && event.clientX <= clientRect.right) {
          if (event.clientY >= clientRect.top && event.clientY <= clientRect.bottom) {
            // Example: d123 = day 1, hour 23
            // Add one, because the day hours start with 0 and go to 23 (inclusive), but we want 1-24
            const hour = Number.parseInt(timeSlot.style.gridRowEnd.substring(2)) + 1;
            const day = Number.parseInt(timeSlot.style.gridRowStart.substring(1, 2));

            const currentEndDate = moment(task.endDate);
            const newEndDate = moment(task.endDate);
            let currentEndDay = currentEndDate.day();
            let currentEndHour = currentEndDate.hour();
            // We must treat 0 o'clock as 24 o'clock.
            if (currentEndDay === 0) currentEndDay = 7;
            if (currentEndHour === 0) currentEndHour = 24;
            const diffHours = hour - currentEndHour;
            const diffDays = day - currentEndDay;

            if (diffDays !== 0) newEndDate.add(diffDays, "day");
            if (diffHours !== 0) newEndDate.add(diffHours, "hours");
            // Prevent the end date happening before the start date
            if (newEndDate < moment(task.startDate)) return;
            if (newEndDate === currentEndDate) return;

            task.endDate = newEndDate.toISOString();
            break;
          }
        }
      }
    },
    moveTask(event, task) {
      const timeSlots = document.getElementsByClassName("hour");
      for (const timeSlot of timeSlots) {
        const clientRect = timeSlot.getBoundingClientRect();

        // Get the time slot over which the mouse (event) hovers
        if (event.clientX >= clientRect.left && event.clientX <= clientRect.right) {
          if (event.clientY >= clientRect.top && event.clientY <= clientRect.bottom) {
            // Example: d27; day 2 hour 7 => d47; day 4 hour 7
            const startDate = moment(task.startDate);
            const endDate = moment(task.endDate);
            const duration = endDate.hours() - startDate.hours();

            // Get new data from the CSS grid data
            const newWeekDay = Number.parseInt(timeSlot.style.gridRowStart.substring(1, 2));
            const newStartHour = Number.parseInt(timeSlot.style.gridRowStart.substring(2));
            const newEndHour = newStartHour + duration;

            // Translate the dates by an equidistant amount
            const startHourDelta = newStartHour - startDate.hours();
            const endHourDelta = newEndHour - endDate.hours();
            const dayDelta = newWeekDay - startDate.isoWeekday();
            startDate.add(startHourDelta, "hours").add(dayDelta, "days");
            endDate.add(endHourDelta, "hours").add(dayDelta, "days");

            const newStartDayString = startDate.toISOString();
            const newEndDayString = endDate.toISOString();
            // Don't update if nothing has changed
            if (task.startDate === newStartDayString && task.endDate === newEndDayString) break;

            // Commit the changes to the model. This will only update the model locally.
            // The server will be notified of the change when the user stops moving the task around (@see updateServer).
            task.startDate = newStartDayString;
            task.endDate = newEndDayString;

            // There exists only one timeslot in the calendar for the searched date.
            // Hence, we can break the loop here.
            break;
          }
        }
      }
    },
    createTask(startDate) {
      this.$emit("createTask", {
        name: "(Missing title)",
        startDate: moment(startDate).toISOString(),
        endDate: moment(startDate).add(1, "hours").toISOString(),
      });
    },
    hasDatePast(date) {
      return date.isBefore(moment(), "hour");
    },
    localeTimeString(h) {
      return moment()
          .set("hours", h)
          .set("minutes", 0)
          .toDate()
          .toLocaleTimeString([this.$store.state.locale], { hour: "2-digit", minute: "2-digit" });
    },
  },
  data() {
    return {
      numHours: 24,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/globals.scss";

.day-header {
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  color: white;
  background: linear-gradient(to top right, $theme, lighten($theme, 10));
  border-radius: 2rem;
  width: 90%;
  justify-self: center;
  margin-bottom: 0.5em;

  &.past-day {
    color: #2c3e50;
    background: $bg;
  }
}

.time-annotation {
  line-height: 0;
  margin-right: 1em;
  //border-top: 1px solid aqua;
  position: relative;
  color: darken($theme, 35);
  font-size: 0.7rem;
  text-align: right;
}

.time-annotation::after {
  content: "";
  // Use border-top instead of background, because the line height changes weirdly when the page is scaled up or down,
  // i.e., the line may have height 2px instead of 1px
  border-top: 1px solid #2c3e50;
  position: absolute;
  top: 0;
  height: 1px;
  right: -2.25em;
  width: 1.25rem;
}

.hour {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  user-select: none;
  $border: 1px solid #2c3e50;

  &.border-top {
    border-top: $border;
  }

  &.border-right {
    border-right: $border;
  }

  &:nth-child(2n) {
    background: $bg;

    &.past-day {
      background: darken($bg, 20);
    }
  }

  &:nth-child(2n+1) {
    background: lighten($bg, 10);

    &.past-day {
      background: darken($bg, 10);
    }
  }
}

.calendar {
  display: grid;
  grid-template-areas: v-bind("gridTemplateAreas");
  grid-template-rows: repeat(v-bind("numHours + 1"), minmax(0, 1fr));
  grid-template-columns: 0.2fr repeat(v-bind("numDays"), minmax(0, 1fr));
  background: whitesmoke;
  border-radius: 1rem;
  padding: 0.5rem;
}
</style>
