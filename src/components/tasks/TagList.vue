<template>
  <ul class="tags">
    <li v-for="tag in tags" class="tag">
      <tag :color="tag.color" :name="tag.name"></tag>
    </li>
  </ul>
</template>

<script>
import Tag from "@/components/tasks/Tag";

export default {
  name: "TagList",
  components: { Tag },
  props: {
    taskId: {
      type: String,
      required: true,
    },
  },
  methods: {
    async requestTags() {
      if (!this.taskId) throw new Error("Missing/invalid required component prop: taskId");
      try {
        const response = await this.$http.get(`tasks/${ this.taskId }/tags`);
        // Sort array lexicographically based on property "name"
        response.data.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()));
        response.data.forEach(tag => this.tags.push(tag));
      } catch (e) {
        console.error(e);
        alert(e.message);
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
