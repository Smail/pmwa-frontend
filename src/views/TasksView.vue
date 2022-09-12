<template>
  <div class="task-view">
    <div class="header-bar">
      <h1>Tasks</h1>
      <button class="material-symbols-outlined display-extensive-task-view-btn"
              :title="`${showExtensiveTaskView ? 'Collapse' : 'Expand'} task view`"
              @click="showExtensiveTaskView = !showExtensiveTaskView"
              v-show="activeTask != null">
        <span v-show="showExtensiveTaskView">keyboard_double_arrow_left</span>
        <span v-show="!showExtensiveTaskView">keyboard_double_arrow_right</span>
      </button>
    </div>
    <div class="content-wrapper">
      <task-list class="task-list"
                 :tasks="$store.state.tasks"
                 @taskClicked="(task) => activeTaskId = task.id">
      </task-list>
      <extensive-task-view v-if="activeTask != null"
                           v-show="showExtensiveTaskView"
                           class="extensive-task-view"
                           :task="activeTask">
      </extensive-task-view>
    </div>
  </div>
</template>

<style lang="scss">
.task-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0;
  gap: 0.5rem;

  .header-bar {
    display: flex;
    background-color: whitesmoke;
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
    }
  }

  .content-wrapper {
    flex: 1;
    display: flex;
    border-radius: 1rem;
    background-color: whitesmoke;
    padding: 1rem;
    gap: 1rem;

    .task-list {
      flex: 1;
      background-color: transparent;
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
      for (const task of this.$store.state.tasks) {
        if (this.activeTaskId === task.id) return task;
      }
    }
  },
  created() {
    this.$store.dispatch("loadTasks");
  },
  data() {
    return {
      activeTaskId: null,
      showExtensiveTaskView: false,
    };
  },
};
</script>
