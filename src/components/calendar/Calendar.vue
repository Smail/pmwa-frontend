<template>
  <div class="calendar">
    <!-- The names of the days, i.e., Monday, Tuesday, etc. -->
    <h4 v-for="(d, i) in weekDistributionWeekDays"
        :class="{
            'past-day': hasDayPast(weekDistributionDates[i]),
            'multiselect': isDayMultiselectActive,
            'selected': isSelected(weekDistributionDates[i]),
          }"
        :style="{ gridArea: `${dayStringShort(d - 1)}-${Math.floor(i / 7)}` }"
        class="day-header"
        @click="isDayMultiselectActive && multiselectDay(weekDistributionDates[i])"
    >
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
              'past-day': hasHourPast(createMoment(weekDistributionDates[i]).add(h, 'hour')),
              // Rounded corners for the time slot grid
              'border-top-left-radius': i === 0 && h === 0,
              'border-top-right-radius': i === weekDistributionWeekDays.length - 1 && h === 0,
              'border-bottom-left-radius': i === 0 && h === 23,
              'border-bottom-right-radius': i === weekDistributionWeekDays.length - 1 && h === 23,
            }"
           :data-date="createMoment(weekDistributionDates[i]).add(h, 'hour').toISOString()"
           :style="{ gridArea: `d${d}${h}-${Math.floor(i / 7)}` }"
           class="hour"
           @click="createTask(createMoment(weekDistributionDates[i]).add(h, 'hour').toISOString())"
      >
      </div>
    </template>
    <!-- The task layer -->
    <template v-for="task in visibleTasks">
      <calendar-task :task="task"
                     :week-distribution-dates="weekDistributionDates.map(d => d.toISOString())"
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
  emits: ["createTask", "update:startDate", "update:endDate"],
  props: {
    tasks: {
      type: Array,
      required: true,
    },
    startDate: {
      type: Object /* moment */,
      required: true,
    },
    endDate: {
      type: Object /* moment */,
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

      return dates;
    },
    gridTemplateAreas() {
      let gridTemplateAreas;

      { // ". mon-0 tue-0 wed-0 thu-0 fri-0 sat-0 sun-0 mon-1 tue-2"
        gridTemplateAreas = `". `;
        for (let i = 0; i < this.weekDistributionWeekDays.length; i++) {
          const day = this.weekDistributionWeekDays[i];
          gridTemplateAreas += `${ this.dayStringShort(day - 1) }-${ Math.floor(i / 7) } `;
        }
        gridTemplateAreas += `" `;
      }

      { // "h0 d10-0 d20-0 d30-0 d40-0 d50-0 d60-0 d70-0 d10-1 d20-2"
        let current = moment(this.startDate);
        for (let hour = 0; hour < this.numHours; hour++) {
          gridTemplateAreas += `"h${ hour } `;
          for (let i = 0; i < this.weekDistributionWeekDays.length; i++) {
            const day = this.weekDistributionWeekDays[i];
            gridTemplateAreas += `d${ day }${ hour }-${ Math.floor(i / 7) } `;
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
            const timeSlotDate = timeSlot.dataset.date;
            if (timeSlotDate == null) throw new Error("No dataset attribute 'date' set on timeslot");

            const currentEndDate = moment(task.endDate);
            const newEndDate = moment(timeSlotDate).add(1, "hour");

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
            if (timeSlot.dataset.date == null) throw new Error("No dataset attribute 'date' set on timeslot");
            const newStartDate = moment(timeSlot.dataset.date);
            const duration = (moment(task.endDate).diff(moment(task.startDate), "hours"));
            const newEndDate = moment(newStartDate.toISOString()).add(duration, "hour");

            const newStartDateString = newStartDate.toISOString();
            const newEndDateString = newEndDate.toISOString();

            if (task.startDate === newStartDateString && task.endDate === newEndDateString) break;
            if (newEndDate.isBefore(newStartDate)) {
              console.warn("End date before start date. Not moving the task");
              return;
            }
            // Commit the changes to the model. This will only update the model locally.
            // The server will be notified of the change when the user stops moving the task around (@see updateServer).
            task.startDate = newStartDateString;
            task.endDate = newEndDateString;

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
    hasHourPast(date) {
      return moment(date).isBefore(moment(), "hour");
    },
    hasDayPast(date) {
      return moment(date).isBefore(moment(), "day");
    },
    localeTimeString(h) {
      return moment()
          .set("hours", h)
          .set("minutes", 0)
          .toDate()
          .toLocaleTimeString([this.$store.state.locale], { hour: "2-digit", minute: "2-digit" });
    },
    keyPress(evt) {
      if (evt.key === "Control") {
        if (evt.type === "keydown" && !this.isDayMultiselectActive) {
          this.isDayMultiselectActive = true;
          console.log("multiselect on");
        } else if (evt.type === "keyup" && this.isDayMultiselectActive) {
          this.isDayMultiselectActive = false;
          this.applyMultiselect(this.selectedDays);
          while (this.selectedDays.length > 0) this.selectedDays.pop();
          console.log("multiselect off");
        }
      }
    },
    applyMultiselect(dates) {
      if (dates == null || dates.length === 0) return;
      const newStartDate = dates.reduce((p, c) => c.isSameOrBefore(p) ? c : p);
      const newEndDate = dates.reduce((p, c) => c.isSameOrAfter(p) ? c : p);

      this.$emit("update:startDate", newStartDate);
      this.$emit("update:endDate", newEndDate);
    },
    multiselectDay(d) {
      const i = this.selectedDays.indexOf(d);
      if (i >= 0) {
        this.selectedDays.splice(i, 1);
        console.log(`Remove ${ d }`);
      } else {
        console.log(`Add = ${ d }`);
        this.selectedDays.push(d);
      }
    },
    isSelected(d) {
      return this.selectedDays.indexOf(d) >= 0;
    },
  },
  mounted() {
    window.addEventListener("keydown", this.keyPress);
    window.addEventListener("keyup", this.keyPress);
  },
  unmounted() {
    window.removeEventListener("keydown", this.keyPress);
    window.removeEventListener("keyup", this.keyPress);
  },
  data() {
    return {
      isDayMultiselectActive: false,
      selectedDays: [],
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
  background: var(--primary-color-600) linear-gradient(to top right, var(--primary-color-400), var(--primary-color-600));
  border-radius: 2rem;
  width: 90%;
  justify-self: center;
  margin-bottom: 0.5em;

  &.past-day {
    color: #2c3e50;
    background: $bg;
  }

  &.multiselect {
    user-select: none;
    cursor: pointer;
    outline: 0.1em dashed var(--primary-color-700);
    color: white;
    background: var(--primary-color-300) linear-gradient(to top right, var(--primary-color-300), var(--primary-color-400));
    transition: color 200ms ease-in-out,
    background 200ms ease-in-out,
    scale 200ms ease-in-out,
    translate 200ms ease-in-out;

    // Order of hover, selected and active is important!
    &:hover {
      scale: 105%;
      translate: 0 -0.08em;
      background: var(--primary-color-700);
    }

    &.selected {
      background: var(--primary-color-500);
    }

    &:active {
      background: var(--primary-color-400);
    }
  }
}

.time-annotation {
  line-height: 0;
  margin-right: 1em;
  //border-top: 1px solid aqua;
  position: relative;
  color: var(--primary-color-900);
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
    background: var(--primary-color-400-0\.8);

    &.past-day {
      background: var(--primary-color-000-0\.8);
    }
  }

  &:nth-child(2n+1) {
    background: var(--primary-color-600-0\.8);

    &.past-day {
      background: var(--primary-color-100-0\.8);
    }
  }

  &.border-top-left-radius {
    border-top-left-radius: 0.5em;
  }

  &.border-top-right-radius {
    border-top-right-radius: 0.5em;
  }

  &.border-bottom-left-radius {
    border-bottom-left-radius: 0.5em;
  }

  &.border-bottom-right-radius {
    border-bottom-right-radius: 0.5em;
  }
}

.calendar {
  display: grid;
  grid-template-areas: v-bind("gridTemplateAreas");
  grid-template-rows: repeat(v-bind("numHours + 1"), minmax(0, 1fr));
  grid-template-columns: 0.2fr repeat(v-bind("numDays"), minmax(0, 1fr));
  background: var(--primary-color-900-0\.9);
  border-radius: 1rem;
  padding: 0.5rem;
}
</style>
