<template>
  <div class="calendar">
    <!-- The names of the days, i.e., Monday, Tuesday, etc. -->
    <h4 class="day-header" v-for="d in 7" :style="{ gridArea: dayStringShort(d - 1) }">{{ dayString(d - 1) }}</h4>
    <!-- Display time annotations, e.g., 15:00 on the left side of the calendar -->
    <template v-for="(_, h) in 24">
      <!-- Don't show 00:00 -->
      <p v-if="h > 0" class="time-annotation" :style="{ gridArea: `h${h}` }">
        {{ h < 10 ? ("0" + h) : h }}:00
      </p>
    </template>
    <!-- The actual time slots -->
    <template v-for="d in 7">
      <div v-for="(_, h) in 24" class="hour" :style="{ gridArea: `d${d}${h}` }"
           :class="{ 'border-right': d < 7, 'border-top': h > 0 && h < 24}">
        {{ h }}
      </div>
    </template>
    <!-- The task layer -->
    <template v-for="task in tasks">
      <div
          class="task"
          :style="{
            gridRowStart: `d${task.day}${task.startTime}`,
            gridColumnStart: `d${task.day}${0}`,
            gridRowEnd: `d${task.day}${task.endTime - 1}`,
          }"

      >
        <div class="task-header-desc-wrapper">
          <h5>{{ task.name }}</h5>
          <p>{{ task.description }}</p>
        </div>
        <div class="drag-div" draggable="true" @drag="resizeTimeslot($event, task)"></div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Calendar",
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
      const timeSlots = document.getElementsByClassName("hour");
      // TODO filter for the timeslots that are in the future by grid row/column start/end
      for (const timeSlot of timeSlots) {
        const clientRect = timeSlot.getBoundingClientRect();

        // Get the time slot over which the mouse (event) hovers
        if (event.clientX >= clientRect.left && event.clientX <= clientRect.right) {
          if (event.clientY >= clientRect.top && event.clientY <= clientRect.bottom) {
            // Example: d27; day 2 hour 7
            // Add 1, because it's an exclusive range
            const endTime = Number.parseInt(timeSlot.style.gridRowEnd.substring(2)) + 1;
            // Clip bounds: Don't allow negative time and clip at the end of a day
            // TODO extend on next day
            task.endTime = Math.max(task.startTime, Math.min(endTime, 24));
          }
        }
      }
    },
  },
  data() {
    return {
      numDays: 7,
      numHours: 24,
      tasks: [
        {
          day: 2,
          startTime: 4,
          endTime: 7,
          name: "Hello World",
          description: "Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.day-header {
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  color: inherit;
}

.time-annotation {
  line-height: 0;
  text-align: right;
  margin-right: 0.5em;
}

.hour {
  background: rebeccapurple;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  user-select: none;

  &.border-top {
    border-top: 1px solid aqua;
  }

  &.border-right {
    border-right: 1px solid aqua;
  }
}

.task {
  cursor: pointer;
  color: white;
  border: 1px solid red;
  background: rgba(255, 0, 0, 0.5);
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  .task-header-desc-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    flex: 1;
    padding: 0.5em;
    cursor: text;
    user-select: text;

    h5, p {
      text-align: left;
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

.calendar {
  display: grid;
  grid-template-areas: v-bind("gridTemplateAreas");
  grid-template-rows: repeat(v-bind("numHours + 1"), minmax(0, 1fr));
  grid-template-columns: 0.2fr repeat(v-bind("numDays"), minmax(0, 1fr));

  .time-annotations {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    grid-area: times;
    background: red;
  }

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
