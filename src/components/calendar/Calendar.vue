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
        <h5>{{ task.name }}</h5>
        <p>{{ task.description }}</p>
        <div class="drag-div"></div>
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
  cursor: pointer;
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

  h5 {
    display: flex;
    padding: 0.5em;
    align-items: flex-start;
  }

  p {
    flex: 5;
    padding: 0.5em;
  }

  .drag-div {
    flex: 1;
    cursor: n-resize;
  }
}

.calendar {
  display: grid;
  grid-template-areas: v-bind("gridTemplateAreas");
  grid-template-columns: 1fr repeat(7, 7fr);

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
