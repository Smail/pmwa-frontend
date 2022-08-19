<template>
  <ul class="task-list">
    <li></li>
  </ul>
</template>

<style lang="scss">
.todo {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;

  h1 {
    align-self: flex-start;
  }
}
</style>

<script>
export default {
  name: 'TaskList',
  methods: {
    loadTasks() {
      this.$http.get('http://localhost:8090/tasks/', {
        headers: {
          Authorization: localStorage.getItem('accessToken'),
        }
      }).then(response => {
        this.tasks.splice(0, this.tasks.length);
        for (const task of response.data.tasks) {
          this.tasks.push(task);
        }
      }).catch(error => {
        console.error(error);
      });
    }
  },
  data() {
    return {
      tasks: [],
    }
  }
}
</script>