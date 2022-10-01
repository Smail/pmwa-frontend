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
    $img-size: 3rem;
    width: $img-size;
    height: $img-size;
    border-radius: 50%;
    cursor: pointer;

    &.material-symbols-outlined {
      font-size: $img-size;
    }
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

@media only screen and (max-width: 1500px) {
  .user-avatar {
    .user-avatar-greeting {
      display: none;
    }
  }
}
</style>

<script>
export default {
  name: "UserAvatar",
};
</script>
