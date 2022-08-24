<template>
  <div v-if="isSequential" class="calendar-sequential">
    <div v-for="day in numberOfDaysShowing" class="calendar-sequential-day">
      <span class="calendar-sequential-day-short">{{ shortDayString(iterateDays(today, day - 1)) }}</span>

      <div class="hours-wrapper">
        <hour v-for="h in 24" :numMinuteSegments="4" :show-border-bottom="h === 24"
              :show-border-left="true" :show-border-right="day === numberOfDaysShowing" :show-border-top="true"
        ></hour>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.calendar-sequential {
  background-color: red;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);

  .calendar-sequential-day {
    display: flex;
    flex-direction: column;
  }

  .calendar-sequential-day-short {
    text-transform: uppercase;
    font-weight: bold;
  }

  .hours-wrapper {
    flex: 1;
    display: grid;
    grid-auto-rows: minmax(0, 24fr);
  }
}
</style>

<script>
import Hour from "@/components/calendar/Hour";

export default {
  name: 'Calendar',
  components: { Hour },
  computed: {
    isSequential() {
      return this.viewType === 'sequential';
    }
  },
  methods: {
    iterateDays(from, by) {
      return (from + by) % 7;
    },
    dayString(day) {
      switch (day) {
        case 0:
          return 'monday';
        case 1:
          return 'tuesday';
        case 2:
          return 'wednesday';
        case 3:
          return 'thursday';
        case 4:
          return 'friday';
        case 5:
          return 'saturday';
        case 6:
          return 'sunday';
        default:
          throw new Error('Invalid day value: ' + day);
      }
    },
    shortDayString(day) {
      switch (day) {
        case 0:
          return 'mon';
        case 1:
          return 'tue';
        case 2:
          return 'wed';
        case 3:
          return 'thu';
        case 4:
          return 'fri';
        case 5:
          return 'sat';
        case 6:
          return 'sun';
        default:
          throw new Error('Invalid day value: ' + day);
      }
    }
  },
  data() {
    return {
      // day, sequential (week, but not fixed to 7 days), month, (year)
      viewType: 'sequential',
      numberOfDaysShowing: 7,
      today: 0,
    }
  }
}
</script>
