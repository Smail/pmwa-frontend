<template>
  <ul class="tags">
    <li v-for="tag in tags" class="tag">
      <tag :tag="tag" @delete-tag="removeTag(tag)" :key="tag.id"></tag>
    </li>
    <li class="add-tag">
      <form class="add-tag"
            tabindex="-1"
            @focusout="formFocusOut"
            @submit.prevent="createNewTag(); showNewTagInput = false">
        <input v-model="newTagName"
               :style="{ width: !showNewTagInput ? '0' : null }"
               maxlength="30"
               name="name"
               placeholder="New tag name"
               title="New tag name"
               type="text">
        <button v-show="!showNewTagInput"
                class="add-tag"
                type="button"
                @click="showNewTagInput = true; focusNewTagNameInput($event)">
          <span class="material-symbols-outlined">add</span>
        </button>
      </form>
    </li>
  </ul>
</template>

<script>
import Tag from "@/components/tasks/Tag";

export default {
  name: "TagList",
  components: { Tag },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tags() {
      return this.task.tags;
    },
  },
  methods: {
    focusNewTagNameInput(event) {
      event.target.parentElement.parentElement.elements.name.focus();
    },
    formFocusOut(event) {
      if (event.relatedTarget != null && event.target != null &&
          event.relatedTarget.parentElement === event.target.parentElement) return;
      this.showNewTagInput = false;
    },
    createNewTag() {
      this.newTagName = this.newTagName.replaceAll("\n", "").substring(0, 30);
      this.$store.dispatch("createTag", {
        taskId: this.task.id,
        tag: { id: Math.ceil(Math.random() * 9000000), name: this.newTagName },
      });
      this.newTagName = "";
    },
    removeTag(tag) {
      this.$store.dispatch("removeTaskTag", { taskId: this.task.id, tagId: tag.id });
    },
  },
  data() {
    return {
      showNewTagInput: false,
      newTagName: "",
    };
  },
};
</script>

<style lang="scss">
.tags {
  display: flex;
  align-items: center;
  font-size: 0.65rem;
  flex-wrap: wrap;

  form.add-tag {
    padding: 0.1rem 0.25rem;
    border-radius: 1rem;
    background: darken(white, 50);
    display: flex;

    input[type="text"] {
      font-size: inherit;
      font-family: monospace;
      background: transparent;
      border: none;
      outline: none;
      margin: 0;
      padding: 0;

      &::placeholder {
        color: lightgray;
      }
    }
  }

  button.add-tag {
    border: none;
    display: flex;
    font-size: inherit;
    align-items: center;
    background: transparent;

    &:focus {
      outline: thin dashed black;
      border-radius: 1rem;
    }

    .material-symbols-outlined {
      font-size: 1.25em;
    }
  }
}
</style>
