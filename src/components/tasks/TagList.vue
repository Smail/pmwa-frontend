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
    tags: {
      type: Array,
      required: true,
    },
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
