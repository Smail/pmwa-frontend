<template>
  <div class="fitness-tracker">
    <section class="section-header">
      <h1 class="section-title">Fitness Tracker</h1>
    </section>
    <main class="main">
      <section class="charts"
               style="/* Overflow hidden is needed, so that the chartJS chart can shrink.*/overflow: hidden">
        <h1 class="section-title">Charts</h1>
        <div style="display: flex">
          <!--          <div class="chart-nav" style="margin-bottom: 2rem">-->
          <!--            <button class="material-symbols-outlined">chevron_left</button>-->
          <!--            <button class="material-symbols-outlined">chevron_right</button>-->
          <!--          </div>-->
          <button class="material-symbols-outlined chart-nav-btn" style="margin-right: 1rem;" type="button">
            chevron_left
          </button>
          <div id="canvas-container" style="flex: 1;position: relative;">
            <canvas id="myChart">
              Your browser does not support the canvas element and therefore no charts can be displayed at this time.
              Please try updating or changing your browser
            </canvas>
            <weight-graph></weight-graph>
          </div>
          <button class="material-symbols-outlined chart-nav-btn" style="margin-left: 1rem;" type="button">
            chevron_right
          </button>
        </div>
      </section>
      <section class="inputs">
        <h1 class="section-title">Add Body Measurements</h1>
        <measurement :units="weightUnits" name="weight"></measurement>
        <measurement :units="lengthUnits" name="neck"></measurement>
        <measurement :units="lengthUnits" name="shoulders"></measurement>
        <measurement :units="lengthUnits" name="chest"></measurement>
        <measurement :units="lengthUnits" name="upper arm (left)"></measurement>
        <measurement :units="lengthUnits" name="upper arm (right)"></measurement>
        <measurement :units="lengthUnits" name="forearm (left)"></measurement>
        <measurement :units="lengthUnits" name="forearm (right)"></measurement>
        <measurement :units="lengthUnits" name="waist"></measurement>
        <measurement :units="lengthUnits" name="thigh (left)"></measurement>
        <measurement :units="lengthUnits" name="thigh (right)"></measurement>
        <measurement :units="lengthUnits" name="calf (left)"></measurement>
        <measurement :units="lengthUnits" name="calf (right)"></measurement>
      </section>
      <section class="new">
        <h1 class="section-title">Workouts</h1>

        <ul style="display: block; flex: 1;">
          <li v-for="workout in workouts">
            <span style="display: flex; align-items: center; justify-content: space-between">
            <h2 style="text-transform: capitalize">{{ workout.name }}</h2><p>{{ shortLocalDate(workout.date) }}</p>
            </span>
            <ul>
              <li v-for="exercise in workout.exercises">
                <h3>{{ exercise.name }}</h3>
                <ol class="exercise">
                  <li class="exercise">
                    <h4>Weight</h4>
                    <h4>Repetitions</h4>
                  </li>
                  <li v-for="set in sortSets(exercise.sets)" class="exercise" style="list-style-type: decimal">
                    <span>{{ set.reps }}</span><span>{{ set.weight.amount }}{{ set.weight.unit }}</span>
                  </li>
                </ol>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import moment from "moment";
import { titleizeString } from "@/util/titleizeString";

export default {
  name: "FitnessTrackerView",
  components: {},
  computed: {
    latestWorkout() {
      this.sortWorkouts();
      return this.workouts[this.workouts.length - 1];
    },
  },
  methods: {
    shortLocalDate(date) {
      date = date.clone();
      date.locale(this.$store.state.locale);
      return date.format("LL");
    },
    sortWorkouts() {
      this.workouts.sort((a, b) => moment(a.date).isBefore(moment(b.date)) ? 1 : -1);
    },
    sortSets(sets) {
      sets = Array.from(sets);
      sets.sort((a, b) => a.order - b.order);
      return sets;
    },
    exercisesSetToRepsChartData(workout) {
      const datasets = workout.exercises.map(e => ({
        label: e.name,
        data: e.sets.map(set => ({ x: set.order, y: set.reps })),
      }));

      return { datasets };
    },
    exercisesSetToWeightChartData(workout) {
      const datasets = workout.exercises.map(e => ({
        label: e.name,
        data: e.sets.map(set => ({ x: set.order, y: set.weight.amount })),
      }));

      return { datasets };
    },
    exercisesVolumeChartData(workout) {
      const datasets = workout.exercises.map(e => ({
        label: e.name,
        data: e.sets.map(set => ({ x: set.order, y: set.weight.amount * set.reps })),
      }));

      return { datasets };
    },
    crossWorkoutExerciseVolumeChartData(workouts) {
      // List of exercise volumes across multiple workouts.
      // Example: exerciseVolumes = [
      // { name: "Bench Press", exerciseVolumes: [2500, 2600, 2700]},
      // { name: "Squat", exerciseVolumes: [5500, 5600, 5700]},
      // ]
      const exerciseVolumes = [];
      for (const workout of workouts) {
        // Calc volume of an exercise during this workout TODO check for duplicates
        const evs = workout.exercises.map(exercise => ({
          name: exercise.name,
          volume: exercise.sets.map(s => s.weight.amount * s.reps).reduce((p, c) => p + c, 0),
        }));

        // Append this workout volume to the overall workout volume timeline
        for (const ev of evs) {
          const name = ev.name;

          // Initialize if not exists
          if (exerciseVolumes.findIndex(x => x.name === name) === -1) {
            exerciseVolumes.push({
              name: name,
              volumes: [],
            });
          }

          // Add exercise volume
          exerciseVolumes.find(x => x.name === name).volumes.push(ev.volume);
        }
      }

      const datasets = exerciseVolumes.map(exercise => ({
        label: exercise.name,
        data: exercise.volumes.map((v, i) => ({ x: i, y: v })),
      }));

      return { datasets };
    },
    colorDatasets(datasets) {
      for (let i = 0; i < datasets.length; i++) {
        let color = `hsla(${ (i * 73) % 360 }, 100%, 50%, 0.5)`;
        color = `hsl(${ (280 + (i * 41)) % 360 }, 68%, 60%)`;
        // color = `hsl(${(131 + (i * 41)) % 360}, 59%, 49%)`;

        datasets[i].borderColor = color;
        datasets[i].backgroundColor = color;
      }
    },
  },
  created() {
    // Titleize all exercise names
    this.workouts.flatMap(w => w.exercises).forEach(e => e.name = titleizeString(e.name));

    let chartCanvas = document.getElementById("myChart");

    if (chartCanvas == null) return;
    console.log("Hallo");
  },
  updated() {
    console.log("updated");
  },
  beforeMount() {
    let chartCanvas = document.getElementById("myChart");

    if (chartCanvas == null) return;
    console.log("Hallo");
    chartCanvas.remove();

    document.getElementById("canvas-container").appendChild(canvas);
  },
  mounted() {
    {
      // Reset the chart canvas element by replacing it with a new canvas.
      // This is a hacky way to fix the bug, where the chart would shrink to a tiny value, like 29px,
      // after revisiting this route
      let chartCanvas = document.getElementById("myChart");
      const textContent = chartCanvas.textContent;

      chartCanvas.remove();

      chartCanvas = document.createElement("canvas");
      chartCanvas.id = "myChart";
      chartCanvas.textContent = textContent;

      document.getElementById("canvas-container").appendChild(chartCanvas);
    }

    this.sortWorkouts();
    const func = this.exercisesVolumeChartData;

    const exercises = this.workouts[0].exercises;
    const data = func(this.workouts[0]);
    // const data = this.crossWorkoutExerciseVolumeChartData(this.workouts);
    const units = exercises.flatMap(e => e.sets).map(s => s.weight.unit);
    const allUnitsSame = (units.length > 0) ? (units.every(unit => unit === units[0])) : true;
    const maxWeight = exercises.flatMap(e => e.sets).map(s => s.weight.amount).reduce((p, c) => Math.max(p, c));

    // TODO normalize units
    if (!allUnitsSame) console.warn("Workout weight units differ");

    this.colorDatasets(data.datasets);

    const config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        // backgroundColor: "rgba(0, 255, 0, 0.5)",
        // borderColor: "rgba(0, 255, 0, 0.5)",
        tension: 0,
        pointRadius: 5,
        pointHitRadius: 10,
        scales: {
          y: {
            type: "linear",
            title: {
              display: true,
              text: "Weight" + (units.length > 0 ? ` [${ units[0] }]` : ""),
            },
            color: "white",
            ticks: {
              color: "white",
              font: {
                size: 15,
              },
              // stepSize: 1, // TODO some datasets need this, some don't. Caution: This messes up autoSkip = false
              autoSkip: false,
            },
          },
          x: {
            type: "linear",
            title: {
              display: true,
              text: "Set",
            },
            ticks: {
              color: "white",
              font: {
                size: 14,
              },
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                family: "inherit",
                size: 14,
              },
            },
          },
        },
      },
    };
    Chart.defaults.color = "#fff";
    this.chart = new Chart(document.getElementById("myChart"), config);
  },
  unmounted() {
    this.chart = null;
  },
  data() {
    const workoutDataMock = [
      {
        name: "full body",
        date: moment("2022-09-18"),
        exercises: [
          {
            name: "bench press",
            order: 1,
            sets: [
              { order: 1, weight: { amount: 20, unit: "kg" }, reps: 12 },
              { order: 2, weight: { amount: 40, unit: "kg" }, reps: 12 },
              { order: 3, weight: { amount: 60, unit: "kg" }, reps: 6 },
              { order: 4, weight: { amount: 70, unit: "kg" }, reps: 1 },
              { order: 5, weight: { amount: 60, unit: "kg" }, reps: 3 },
              { order: 6, weight: { amount: 40, unit: "kg" }, reps: 11 },
              { order: 7, weight: { amount: 40, unit: "kg" }, reps: 10 },
            ],
          },
          {
            name: "rows",
            order: 2,
            sets: [
              { order: 1, weight: { amount: 33, unit: "kg" }, reps: 12 },
              { order: 2, weight: { amount: 40, unit: "kg" }, reps: 12 },
              { order: 3, weight: { amount: 47, unit: "kg" }, reps: 11 },
              { order: 4, weight: { amount: 40, unit: "kg" }, reps: 13 },
              { order: 5, weight: { amount: 40, unit: "kg" }, reps: 7 },
            ],
          },
          {
            name: "triceps press",
            order: 3,
            sets: [
              { order: 1, weight: { amount: 15, unit: "kg" }, reps: 20 },
              { order: 2, weight: { amount: 15, unit: "kg" }, reps: 20 },
              { order: 3, weight: { amount: 20, unit: "kg" }, reps: 12 },
              { order: 4, weight: { amount: 20, unit: "kg" }, reps: 6 },
              { order: 5, weight: { amount: 20, unit: "kg" }, reps: 6 },
            ],
          },
          {
            name: "reverse butterflies",
            order: 4,
            sets: [
              { order: 1, weight: { amount: 35, unit: "kg" }, reps: 11 },
              { order: 2, weight: { amount: 27.5, unit: "kg" }, reps: 16 },
              { order: 3, weight: { amount: 27.5, unit: "kg" }, reps: 12 },
              { order: 4, weight: { amount: 20, unit: "kg" }, reps: 13 },
            ],
          },
        ],
      },
      {
        name: "legs",
        date: moment("2022-09-19"),
        exercises: [
          {
            name: "squats",
            order: 1,
            sets: [
              { order: 1, weight: { amount: 80, unit: "kg" }, reps: 12 },
              { order: 2, weight: { amount: 90, unit: "kg" }, reps: 12 },
              { order: 3, weight: { amount: 120, unit: "kg" }, reps: 6 },
              { order: 4, weight: { amount: 150, unit: "kg" }, reps: 1 },
              { order: 5, weight: { amount: 120, unit: "kg" }, reps: 3 },
            ],
          },
          {
            name: "leg press",
            order: 2,
            sets: [
              { order: 1, weight: { amount: 20, unit: "kg" }, reps: 12 },
              { order: 2, weight: { amount: 40, unit: "kg" }, reps: 12 },
              { order: 3, weight: { amount: 60, unit: "kg" }, reps: 6 },
              { order: 4, weight: { amount: 70, unit: "kg" }, reps: 1 },
              { order: 5, weight: { amount: 60, unit: "kg" }, reps: 3 },
              { order: 6, weight: { amount: 40, unit: "kg" }, reps: 11 },
              { order: 7, weight: { amount: 40, unit: "kg" }, reps: 10 },
            ],
          },
          {
            name: "bench press",
            order: 3,
            sets: [
              { order: 1, weight: { amount: 20, unit: "kg" }, reps: 12 },
              { order: 2, weight: { amount: 40, unit: "kg" }, reps: 12 },
              { order: 3, weight: { amount: 60, unit: "kg" }, reps: 8 },
              { order: 4, weight: { amount: 70, unit: "kg" }, reps: 4 },
              { order: 5, weight: { amount: 60, unit: "kg" }, reps: 3 },
              { order: 6, weight: { amount: 40, unit: "kg" }, reps: 11 },
              { order: 7, weight: { amount: 40, unit: "kg" }, reps: 10 },
            ],
          },
        ],
      },
    ];

    return {
      chart: null,
      workouts: workoutDataMock,
    };
  },
};
</script>

<style lang="scss">
li.exercise {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  //list-style-type: decimal
}

.chart-nav-btn {
  background: var(--primary-color-400);
  padding: 0.125em;
  border: none;
  transition: color 100ms ease-in-out;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 100%;

  &:hover {
    color: var(--primary-color-800);
  }
}

.new {
  box-sizing: border-box;

  &::-webkit-scrollbar {
    background: transparent;
  }
}

.fitness-tracker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  section {
    border-radius: 1rem;
    padding: 1rem;
    background: var(--primary-color-900-0\.9);
  }

  .section-header {
  }

  .section-title {
    text-align: left;
  }

  .main {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    grid-template-areas: "charts new"
                         ". new";
    gap: 0.5em;
    min-width: 0;
    min-height: 0;

    .charts {
      grid-area: charts;
    }

    .new {
      grid-area: new;
      min-width: 0;
      min-height: 0;
      overflow: auto;
    }
  }
}

@media only screen and (max-width: 1500px) {
  body {
    overflow: auto;
    max-height: initial;
    height: initial;
  }

  .fitness-tracker {
    .main {
      grid-template-columns: 1fr;
      grid-template-areas: "charts" "new";
    }
  }
}

#myChart {
  min-width: 0;
}
</style>
