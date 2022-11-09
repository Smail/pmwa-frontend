<template>
  <context-menu>
    <ul class="context-menu-content_task">
      <li style="display: flex; flex-direction: column; gap: inherit">
        <h5 style="align-self: flex-start;">Priority</h5>
        <ul class="priority-list">
          <li v-for="(p, i) in ['none', 'low', 'medium', 'high']">
            <button :class="[`priority_${p}`, { active: priority === p }]"
                    type="button"
                    @click="setPriority(p)"
            >
              <template v-if="i > 0">{{ "!".repeat(i) }}</template>
              <template v-else>-</template>
            </button>
          </li>
        </ul>
      </li>

      <li class="divider">
        <hr>
      </li>

      <li class="favorite-task">
        <button :class="{ active: isFavorite }" class="favorite-task"
                type="button"
                @click="toggleIsFavorite">
          Favor task
          <span class="material-symbols-outlined">star</span>
        </button>
      </li>

      <li>
        <button class="delete-task-btn"
                type="button"
                @click="deleteTask(); $emit('taskDeleted', task)"
        >
          Delete
          <span class="material-symbols-outlined">delete</span>
        </button>

      </li>
    </ul>
  </context-menu>
</template>

<script>
import ContextMenu from "@/components/contextMenu/ContextMenu";

export default {
  name: "TaskContextMenu",
  components: { ContextMenu },
};
</script>

<style scoped>

</style>
