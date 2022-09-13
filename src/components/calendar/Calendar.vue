<template>
  <div class="calendar">
    <!-- The names of the days, i.e., Monday, Tuesday, etc. -->
    <h4 v-for="d in 7" :style="{ gridArea: dayStringShort(d - 1) }" class="day-header">{{ dayString(d - 1) }}</h4>
    <!-- Display time annotations, e.g., 15:00 on the left side of the calendar -->
    <template v-for="(_, h) in 24">
      <!-- Don't show 00:00 -->
      <p v-if="h > 0" :style="{ gridArea: `h${h}` }" class="time-annotation">
        {{ h < 10 ? ("0" + h) : h }}:00
      </p>
    </template>
    <!-- The actual time slots -->
    <template v-for="d in 7">
      <div v-for="(_, h) in 24" :class="{ 'border-right': d < 7, 'border-top': h > 0 && h < 24}"
           :style="{ gridArea: `d${d}${h}` }"
           class="hour"
           @click="createTask(d, h)"
      >
      </div>
    </template>
    <!-- The task layer -->
    <template v-for="task in tasks.filter(t => t.startDate != null)">
      <calendar-task :task="task" @move-task="moveTask" @resize-timeslot="resizeTimeslot"></calendar-task>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import CalendarTask from "@/components/calendar/CalendarTask";

export default {
  name: "Calendar",
  components: { CalendarTask },
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
    createTask(day, hour) {
      this.tasks.push({
        day: day,
        startTime: hour,
        endTime: hour + 1,
        name: "(Missing title)",
        description: null,
      });
    },
    moveTask(event, task) {
      const timeSlots = document.getElementsByClassName("hour");
      for (const timeSlot of timeSlots) {
        const clientRect = timeSlot.getBoundingClientRect();

        // Get the time slot over which the mouse (event) hovers
        if (event.clientX >= clientRect.left && event.clientX <= clientRect.right) {
          if (event.clientY >= clientRect.top && event.clientY <= clientRect.bottom) {
            // Example: d27; day 2 hour 7 => d47; day 4 hour 7
            // const day = Number.parseInt(timeSlot.style.gridRowStart.substring(1, 2));
            const newStartHour = Number.parseInt(timeSlot.style.gridRowStart.substring(2));           // hours
            const duration = moment(task.endDate).hours() - moment(task.startDate).hours();           // hours
            const newEndHour = newStartHour + duration;              // hours

            if (moment(task.startDate).hours() === newStartHour) break;

            // task.day = day;
            // Prevent task getting shorter; TODO extend into next day
            if (newEndHour <= 24) {
              const startDelta = newStartHour - moment(task.startDate).hours();
              const endDelta = newEndHour - moment(task.endDate).hours();
              const newStartDate = moment(task.startDate).add(startDelta, "hours");
              const newEndDate = moment(task.endDate).add(endDelta, "hours");

              task.startDate = newStartDate.toISOString();
              task.endDate = newEndDate.toISOString();
            }
            break;
          }
        }
      }
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
.day-header {
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  color: inherit;
  background: darken(whitesmoke, 5);
  border-radius: 2rem;
  width: 90%;
  justify-self: center;
}

.time-annotation {
  line-height: 0;
  margin-right: 0.5em;
  //border-top: 1px solid aqua;
  position: relative;
}

.time-annotation::after {
  content: "";
  // Use border-top instead of background, because the line height changes weirdly when the page is scaled up or down,
  // i.e., the line may have height 2px instead of 1px
  border-top: 1px solid #2c3e50;
  position: absolute;
  top: 0;
  height: 1px;
  right: -1.25em;
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
}

.hour:nth-child(2n) {
  background: darken(whitesmoke, 10);
}

.hour:nth-child(2n+1) {
  background: whitesmoke;
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
