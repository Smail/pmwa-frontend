<template>
  <div class="calendar">
    <!-- The names of the days, i.e., Monday, Tuesday, etc. -->
    <h4 v-for="d in 7"
        :class="{ 'past-day': isPast(d, 24) }"
        :style="{ gridArea: dayStringShort(d - 1) }"
        class="day-header">
      {{ dayString(d - 1) }}</h4>
    <!-- Display time annotations, e.g., 15:00 on the left side of the calendar -->
    <template v-for="(_, h) in 24">
      <!-- Don't show 00:00 -->
      <p v-if="h > 0" :style="{ gridArea: `h${h}` }" class="time-annotation">
        {{ localeTimeString(h) }}
      </p>
    </template>
    <!-- The actual time slots -->
    <template v-for="d in 7">
      <div v-for="(_, h) in 24"
           :class="{ 'border-right': d < 7, 'border-top': h > 0 && h < 24, 'past-day': isPast(d, h) }"
           :style="{ gridArea: `d${d}${h}` }"
           class="hour"
           @click="createTask(d, h)"
      >
      </div>
    </template>
    <!-- The task layer -->
    <template v-for="task in tasks.filter(t => t.startDate != null)">
      <calendar-task :task="task"
                     @open-task="$router.push(`/tasks/${task.id}`)"
                     @move-task="moveTask"
                     @move-finished="updateServer(task.id, { startDate: task.startDate, endDate: task.endDate})"
                     @resize-timeslot="resizeTimeslot"
                     @resize-finished="updateServer(task.id, { endDate: task.endDate})"></calendar-task>
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
  },
  computed: {
    gridTemplateAreas() {
      let gridTemplateAreas;

      { // ". mon tue wed thu fri sat sun"
        gridTemplateAreas = `". `;
        for (let day = 0; day < this.numDays; day++) {
          gridTemplateAreas += `${ this.dayStringShort(day) }${ day + 1 !== this.numDays ? " " : "" }`;
        }
        gridTemplateAreas += `" `;
      }

      { // "h0 d10 d20 d30 d40 d50 d60 d70"
        for (let hour = 0; hour < this.numHours; hour++) {
          gridTemplateAreas += `"h${ hour } `;
          for (let day = 0; day < this.numDays; day++) {
            gridTemplateAreas += `d${ day + 1 }${ hour }${ day + 1 !== this.numDays ? " " : "" }`;
          }
          gridTemplateAreas += `" `;
        }
      }

      return gridTemplateAreas;
    },
  },
  methods: {
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
            const newDay = Number.parseInt(timeSlot.style.gridRowStart.substring(1, 2));
            const newStartHour = Number.parseInt(timeSlot.style.gridRowStart.substring(2));
            const newEndHour = newStartHour + duration;

            // Translate the dates by an equidistant amount
            const startHourDelta = newStartHour - startDate.hours();
            const endHourDelta = newEndHour - endDate.hours();
            const dayDelta = newDay - startDate.day();
            startDate.add(startHourDelta, "hours").add(dayDelta, "days");
            endDate.add(endHourDelta, "hours").add(dayDelta, "days");

            // Commit the changes to the model. This will only update the model locally.
            // The server will be notified of the change when the user stops moving the task around (@see updateServer).
            task.startDate = startDate.toISOString();
            task.endDate = endDate.toISOString();

            // There exists only one timeslot in the calendar for the searched date.
            // Hence, we can break the loop here.
            break;
          }
        }
      }
    },
    createTask(d, h) {
      const startDate = moment().set("day", d).set("hours", h).set("minutes", 0);
      this.$emit("createTask", {
        name: "(Missing title)",
        startDate: moment(startDate).toISOString(),
        endDate: moment(startDate).add(1, "hours").toISOString(),
      });
    },
    isPast(day, hour) {
      const currentDate = moment();
      return currentDate.day() > day || (currentDate.day() === day && currentDate.hour() > hour);
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
      numDays: 7,
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

  .days {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .hours {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
  }
}
</style>
