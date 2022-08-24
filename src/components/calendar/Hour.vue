<template>
  <div
    :class="{borderTop: showBorderTop, borderRight: showBorderRight, borderLeft: showBorderLeft, borderBottom: showBorderBottom}"
    :style="{'grid-template-columns': `minmax(0, ${numMinuteSegments}fr)` }" class="hour">
    <div v-for="segment in numMinuteSegments" class="segment"></div>
  </div>
</template>

<script>
export default {
  name: "Hour",
  props: {
    showBorderTop: {
      type: Boolean,
      default: false,
    },
    showBorderRight: {
      type: Boolean,
      default: false,
    },
    showBorderLeft: {
      type: Boolean,
      default: false,
    },
    showBorderBottom: {
      type: Boolean,
      default: false,
    },
    numMinuteSegments: {
      type: Number,
      default: 1,
      validator(value) {
        if (!value || value < 1) throw new Error('Invalid number of segments');
        return value;
      }
    },
    dates: {
      type: [Date],
      default: [],
    },
  },

  computed: {
    myDates: function () {
      return [new Date()]
    }
  },

  methods: {
    markSegment() {

    },
  },
}
</script>

<style lang="scss">
.hour {
  background: green;
  display: grid;
}

.segment {
  background: red;
  cursor: pointer;
}

.borderTop {
  border-top: 1px solid black;
}

.borderRight {
  border-right: 1px solid black;
}

.borderLeft {
  border-left: 1px solid black;
}

.borderBottom {
  border-bottom: 1px solid black;
}
</style>