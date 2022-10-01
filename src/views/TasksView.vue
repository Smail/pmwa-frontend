<template>
  <div class="task-view">
    <div class="header-bar">
      <h1>Tasks</h1>
      <button v-show="activeTask != null"
              :title="`${showExtensiveTaskView ? 'Collapse' : 'Expand'} task view`"
              class="material-symbols-outlined display-extensive-task-view-btn"
              @click="showExtensiveTaskView = !showExtensiveTaskView">
        <span v-show="showExtensiveTaskView">keyboard_double_arrow_left</span>
        <span v-show="!showExtensiveTaskView">keyboard_double_arrow_right</span>
      </button>
    </div>
    <div class="content-wrapper">
      <task-list :tasks="$store.state.tasks"
                 class="task-list"
                 @task-selected="selectTask"
                 @task-deleted="$router.replace('/tasks')"
      >
      </task-list>
      <hr v-show="showExtensiveTaskView">
      <extensive-task-view v-if="activeTask != null"
                           v-show="showExtensiveTaskView"
                           :task="activeTask"
                           class="extensive-task-view">
      </extensive-task-view>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/scss/globals.scss";

.task-view {
  display: flex;
  flex-direction: column;
  margin: 0;
  gap: 0.5rem;

  .header-bar {
    display: flex;
    background: var(--primary-color-900-0\.9);
    border-radius: 1rem;
    padding: 1rem;
    justify-content: space-between;

    h1 {
      margin: 0;
      align-self: stretch;
      text-align: left;
    }

    .display-extensive-task-view-btn {
      border: none;
      background: transparent;
      transition: all 150ms linear;

      &:hover {
        color: var(--primary-color-500);
        scale: 125%;
      }
    }
  }

  .content-wrapper {
    flex: 1;
    display: flex;
    border-radius: 1rem;
    background: var(--primary-color-900-0\.9);
    padding: 1rem;
    gap: 1rem;

    .task-list {
      flex: 1;
      background-color: transparent;
    }

    hr {
      border-radius: 1rem;
      border-style: solid;
      border-color: var(--primary-color-500-0\.7);
    }

    .extensive-task-view {
      flex: 1;
      background-color: transparent;
    }
  }
}
</style>

<script>
import TaskList from "@/components/tasks/TaskList.vue";
import ExtensiveTaskView from "@/components/tasks/ExtensiveTaskView";

export default {
  name: "TaskView",
  components: { ExtensiveTaskView, TaskList },
  computed: {
    activeTask() {
      // Prioritize route params ID
      if (this.hasParamId) this.activeTaskId = this.$route.params.id;

      if (this.activeTaskId != null) {
        const task = this.$store.state.tasks.find(task => this.activeTaskId === task.id);
        if (task != null) return task;
        console.warn(`The specified task ID '${ this.activeTaskId }' could not be found`);
        this.$router.replace("/tasks");
      }

      return (this.$store.state.tasks.length > 0) ? this.$store.state.tasks[0] : null;
    },
    hasParamId() {
      return this.$route.params.id != null && this.$route.params.id.length > 0;
    },
  },
  methods: {
    selectTask(task) {
      // this.activeTaskId = task.id;
      this.$router.push(`/tasks/${ task.id }`);
    },
  },
  created() {
    this.showExtensiveTaskView = this.$route.params.id != null && this.$route.params.id.length > 0;
    this.$store.dispatch("loadTasks").catch(e => alert(e));
  },
  beforeRouteUpdate(to, from) {
    this.showExtensiveTaskView = to.params.id != null && to.params.id.length > 0;
  },
  data() {
    return {
      activeTaskId: null,
      showExtensiveTaskView: false,
    };
  },
};
</script>
