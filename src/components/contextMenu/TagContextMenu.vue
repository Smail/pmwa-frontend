<template>
  <context-menu>
    <ul class="context-menu_tag">
      <li class="edit-name">
        <h1 class="name" contenteditable="true" spellcheck="false" @input="updateTagName">{{ tag.name }}</h1>
      </li>
      <li class="edit-color">
        <label>
          <span class="material-symbols-outlined">palette</span>
          <input :style="{ background: 'transparent', border: 'none' }"
                 :value="tag.color"
                 type="color"
                 @input="updateTagColor"/>
        </label>
      </li>
      <li>
        <button class="properties-btn" type="button" @click="showRenameModal = true">
          <span class="material-symbols-outlined">build</span>
          <span>Properties</span>
        </button>
      </li>
      <li>
        <delete-button title="Delete Tag"
                       @click="$emit('deleteTag')">
          Delete Tag
        </delete-button>
      </li>
    </ul>
  </context-menu>

  <modal v-if="showRenameModal" :is-showing="showRenameModal" @hide-modal="showRenameModal = false">
    <form class="modal_rename-tag-form" @submit.prevent="submitModalForm">
      <h1>Update Tag</h1>
      <label>
        Name
        <input :value="tag.name" maxlength="30" name="name" type="text"/>
      </label>

      <label>
        Color
        <input :style="{ background: tag.color }" :value="tag.color" name="color" type="color"/>
      </label>
      <button title="Update tag" type="submit">Update</button>
    </form>
  </modal>
</template>

<script>
import ContextMenu from "@/components/contextMenu/ContextMenu";
import DeleteButton from "@/components/common/DeleteButton";
import Modal from "@/components/modal/Modal";

export default {
  name: "TagContextMenu",
  components: { Modal, DeleteButton, ContextMenu },
  emits: ["deleteTag"],
  props: {
    tag: {
      type: Object,
      required: true,
    },
  },
  methods: {
    submitModalForm(event) {
      this.$store.commit("updateTag", {
        id: this.tag.id,
        name: event.target.elements["name"].value,
        color: event.target.elements["color"].value,
      });
    },
    updateTagName(event) {
      const name = event.target.innerText;
      const data = event.data?.replaceAll("\n", "");

      if (data != null && name.length + data.length >= 30) {
        // Reset inner text to last text
        event.target.innerText = this.tag.name;
      } else {
        this.$store.commit("updateTag", { id: this.tag.id, name });
      }
    },
    updateTagColor(event) {
      console.log(this.tag);
      this.$store.commit("updateTag", {
        id: this.tag.id,
        color: event.target.value,
      });
    },
  },
  data() {
    return {
      showRenameModal: false,
    };
  },
};
</script>

<style lang="scss" scoped>
ul.context-menu_tag {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  gap: 0.5em;
  padding: 0.5em;

  li {
    display: flex;
    font-size: inherit;
    //transition: background 100ms linear;

    //&:hover {
    //  background: var(--primary-color-400);
    //}
  }

  li.edit-name {
    .name {
      flex: 1;
      border: none;
      padding: 0.25em;
      font-weight: bold;
      font-size: inherit;
      background: transparent;
      text-align: left;

      &:focus {
        outline: thin dashed var(--primary-color-500);
      }
    }
  }

  li.edit-color {
    label {
      flex: 1;
      display: flex;
      justify-content: space-between;
    }
  }

  .properties-btn {
    flex: 1;
    display: flex;
    align-items: center;
    background: transparent;
    justify-content: space-between;
    border: none;
    padding: 0 0.5em;
  }
}

.modal_rename-tag-form {
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  padding: 2em;
  background: var(--primary-color-200-0\.2);
  border-radius: 1em;
  position: relative;
  backdrop-filter: blur(20rem);
  box-shadow: 0 0 1rem 0 var(--primary-color-100);

  h1 {
    margin: 0 auto 1em 0;
  }

  label {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 5fr;
    white-space: nowrap;
    gap: inherit;
    font-size: 1rem;
  }

  input, button {
    background: var(--primary-color-300);
    outline: none;
    padding: 0.5em;
    border-radius: 0.25rem;
    border: none;
    transition: 100ms background linear;

    &:hover {
      background: var(--primary-color-500);
    }
  }

  input[type="color"] {
    cursor: pointer;
    display: flex;
    flex: 1;
    border: none;
    width: 100%;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
    }
  }

  input[type="text"]:focus {
    background: var(--primary-color-100);
  }

  button:active {
    background: var(--primary-color-100);
  }
}
</style>
