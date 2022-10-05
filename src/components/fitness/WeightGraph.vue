<template>
  <canvas id="weight-chart">
    Your browser does not support the canvas element and therefore no charts can be displayed at this time.
    Please try updating or changing your browser
  </canvas>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "WeightGraph",
  methods: {
    canvas() {
      return document.getElementById("weight-chart");
    },
    reset() {
      // Reset the chart canvas element by replacing it with a new canvas.
      // This is a hacky way to fix the bug, where the chart would shrink to a tiny value, like 29px,
      // after revisiting this route
      const textContent = this.canvas().textContent;
      this.canvas().remove();

      const chartCanvas = document.createElement("canvas");
      chartCanvas.id = "weight-chart";
      chartCanvas.textContent = textContent;

      document.getElementById("canvas-container").appendChild(chartCanvas);
    },
    data() {
      let measurements = localStorage["bodyMeasurements"];
      if (measurements == null) return;

      measurements = JSON.parse(measurements).filter(m => m.name === "weight");
      measurements.sort((a, b) => new Date(a.date) - new Date(b.date));

      const data = [];
      for (let i = 0; i < measurements.length; i++) {
        const m = measurements[i];
        data.push({
          x: i + 1,
          y: m.value,
        });
      }

      return {
        datasets: [
          {
            label: "Weight",
            data: data,
            borderColor: "hsl(107,68%,60%)",
            backgroundColor: "hsl(107,68%,60%)",
          },
        ],
      };
    },
  },
  beforeMount() {
    if (this.canvas() == null) return;
    this.canvas().remove();

    document.getElementById("canvas-container").appendChild(canvas);
  },
  mounted() {
    console.log(this.data());
    this.reset();
    const config = {
      type: "line",
      data: this.data(),
      options: {
        layout: {
          padding: {
            left: 50
          }
        },
        responsive: true,
        // backgroundColor: "rgba(0, 255, 0, 0.5)",
        // borderColor: "rgba(0, 255, 0, 0.5)",
        tension: 0.25,
        pointRadius: 5,
        pointHitRadius: 10,
        scales: {
          y: {
            type: "linear",
            title: {
              display: true,
              text: "Weight", // + (units.length > 0 ? ` [${ units[0] }]` : ""),
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
    this.chart = new Chart(this.canvas(), config);
  },
  unmounted() {
    this.chart = null;
  },
  data() {
    return {
      chart: null,
    };
  },
};
</script>

<style scoped>

</style>
