<template>
  <div class="user-avatar">
    <img v-if="$store.state.userAvatarImgSrc" :src="$store.state.userAvatarImgSrc" alt="User avatar"
         class="user-avatar-icon">
    <span v-else class="material-symbols-outlined user-avatar-icon">account_circle</span>
    <div class="user-avatar-greeting">
      <p>Good Day 👋</p>
      <h2 v-if="$store.state.user.displayName">{{ $store.state.user.displayName }}</h2>
      <h2 v-else-if="$store.state.user.username">{{ $store.state.user.username }}</h2>
      <h2 v-else>Error: User is logged in, but no username defined.</h2>
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
    cursor: pointer;
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
export default {
  name: "UserAvatar",
};
</script>
