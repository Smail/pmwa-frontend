<template>
  <form @submit.prevent="submit">
    <label :for="id" class="name-label">{{ name }}</label>

    <div class="a">
      <input :id="id"
             v-model="value"
             :placeholder="(Math.random() * 50).toFixed(2)"
             :title="`${name} Circumference`"
             max="1000"
             min="0"
             step="0.1"
             type="number"
      >

      <div class="b">
        <template v-for="(unit, i) in units">
          <input v-if="i === 0" :id="unit" :name="unitRadioGroupName" :value="unit" checked type="radio">
          <input v-else :id="unit" :name="unitRadioGroupName" :value="unit" type="radio">
          <label :for="unit">{{ unit }}</label>
        </template>
      </div>

      <button class="material-symbols-outlined" type="submit">add</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "Measurement",
  props: {
    name: {
      type: String,
      require: true,
    },
    units: {
      type: Array,
      required: true,
    },
  },
  computed: {
    id() {
      return `${ name }-input`;
    },
  },
  methods: {
    submit() {
      if (this.value == null) return;

      console.log(this.value);
      let measurements = localStorage["bodyMeasurements"];
      measurements = (measurements != null) ? JSON.parse(measurements) : [];
      measurements.push({ name: this.name, value: this.value, unit: this.unit(), date: new Date().toJSON() });
      localStorage["bodyMeasurements"] = JSON.stringify(measurements);

      this.value = null;
    },
    unit() {
      return document.querySelector(`input[name="${ this.unitRadioGroupName }"]:checked`).value;
    },
  },
  data() {
    return {
      value: null,
      unitRadioGroupName: Math.random().toString().substring(2),
    };
  },
};
</script>

<style lang="scss" scoped>
form {
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  grid-auto-columns: 1fr 1fr;
  gap: 0.5em;

  .name-label {
    text-transform: capitalize;
    text-align: left;
  }

  .a {
    display: flex;
    gap: inherit;
    align-items: center;
    justify-content: space-between;
  }

  .b {
    display: flex;
    gap: inherit;
    margin-right: auto;
  }

  input[type="number"],
  button[type="submit"] {
    border: thin solid var(--primary-color-500);
    border-radius: 1rem;
    background: var(--primary-color-400);
    transition: all 50ms linear;
    padding: 0.25em;

    &:hover {
      background: var(--primary-color-500);
    }
  }

  input[type="number"] {
    padding: 0.5em;

    &:focus {
      outline: medium solid var(--primary-color-700);
    }
  }

  button[type="submit"] {
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>
