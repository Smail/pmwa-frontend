<template>
  <ul class="tags">
    <li v-for="tag in tags" class="tag">
      <tag :color="tag.color" :name="tag.name"></tag>
    </li>
  </ul>
</template>

<script>
import Tag from "@/components/tasks/Tag";
import axios from "axios";

export default {
  name: "TagList",
  components: { Tag },
  props: {
    taskUuid: {
      type: String,
      required: true,
    },
  },
  methods: {
    async requestTags() {
      if (!this.taskUuid) throw new Error("No task UUID was provided to the component");
      try {
        const response = await axios.get(`tasks/tags/${ this.taskUuid }`);
        // Sort array lexicographically based on property "name"
        response.data.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()));
        for (const tag of response.data) this.tags.push(tag);
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.requestTags();
  },
  data() {
    return {
      tags: [],
    };
  },
};
</script>

<style>
.tags {
  display: flex;
  align-items: center;
  font-size: 0.65rem;
}
</style>
