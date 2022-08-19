<template>
  <div v-if="isSequential" class="calendar-sequential">
    <div v-for="(_, i) in numberOfDaysShowing" class="calendar-sequential-day">
      <span class="calendar-sequential-day-short">{{ shortDayString(iterateDays(today, i)) }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.calendar-sequential {
  background-color: red;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);

  *:nth-child(even) {
    background-color: aqua;
  }

  .calendar-sequential-day-short {
    text-transform: uppercase;
    font-weight: bold;
  }
}
</style>

<script>
export default {
  name: 'Calendar',
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
