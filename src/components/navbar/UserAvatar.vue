<template>
  <div class="user-avatar">
    <img v-if="$store.state.userAvatarImgSrc" :src="$store.state.userAvatarImgSrc" alt="User avatar"
         class="user-avatar-icon">
    <span v-else class="material-symbols-outlined user-avatar-icon">account_circle</span>
    <div class="user-avatar-greeting">
      <p>Good Day 👋</p>
      <h2 v-if="displayName">{{ displayName }}</h2>
      <h2 v-else-if="$store.state.username">{{ $store.state.username }}</h2>
      <h2 v-else>Error: User is logged in, but username is not defined.</h2>
    </div>
  </div>
</template>

<style lang="scss">
.user-avatar {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .user-avatar-icon {
    width: 48px;
    height: 48px;
    // Needed for if icon is a materials icon and not an actual image
    font-size: 48px;
    border-radius: 50%;
  }

  .user-avatar-greeting {
    display: flex;
    align-items: flex-start;
    flex-direction: column;

    p {
      flex: 1;
      margin: 0;
    }

    h2 {
      font-size: 1.25rem;
      flex: 1;
      margin: 0;
    }
  }
}
</style>

<script>
import axios from "axios";

export default {
  name: "UserAvatar",
  methods: {
    async requestDisplayName() {
      const response = axios.get(`users/${ this.$store.state.username }/display-name`);
      return (await response).data.displayName;
    },
  },
  data() {
    return {
      displayName: this.$store.state.username,
    };
  },
  async created() {
    const displayName = await this.requestDisplayName();
    if (displayName) this.displayName = displayName;
  },
};
</script>
