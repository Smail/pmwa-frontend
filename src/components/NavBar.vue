<template>
  <nav class="navbar">
    <!-- User avatar -->
    <template v-if="$store.state.isLoggedIn">
      <div class="user-avatar">
        <img v-if="$store.state.userAvatarImgSrc" class="user-avatar-icon" :src="$store.state.userAvatarImgSrc">
        <span v-else class="material-symbols-outlined user-avatar-icon">
          account_circle
        </span>
        <div class="user-avatar-greeting">
          <p>Good Day 👋</p>
          <h2 v-if="$store.state.username">{{ $store.state.username }}</h2>
          <h2 v-else>Error: User is logged in, but username is not defined.</h2>
        </div>
      </div>
      <template v-if="$store.state.showClock">
        <hr>
        <h4 class="clock">
          <span class="material-symbols-outlined">
            schedule
          </span>
          {{ time }}
        </h4>
      </template>
      <hr v-if="menus.length > 0">
      <ul v-for="(menu, index) in menus" class="links">
        <li v-for="menuItem in menu" class="menu">
          <router-link :to="menuItem.href">
            <span v-if="menuItem.icon" class="material-symbols-outlined">
              {{ menuItem.icon }}
            </span>
            {{ menuItem.name }}
          </router-link>
        </li>
        <!-- Log out button -->
        <li style="margin-top: auto" class="menu">
          <button @click="$store.commit('logOut')">
            <span class="material-symbols-outlined">logout</span>
            Log out
          </button>
        </li>
      </ul>
    </template>
    <template v-else>
      <ul class="links">
        <li v-for="menuItem in loggedOutMenu" class="menu">
          <router-link :to="menuItem.href">
            <span v-if="menuItem.icon" class="material-symbols-outlined">
              {{ menuItem.icon }}
            </span>
            {{ menuItem.name }}
          </router-link>
        </li>
      </ul>
    </template>
  </nav>
</template>

<style lang="scss">
.navbar {
  display: inline-flex;
  flex-direction: column;
  background-color: whitesmoke;
  border-radius: 1rem;
  padding: 1rem;

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

  hr {
    height: 1px;
    background-color: currentColor;
    border-radius: 1rem;
    border: none;
    margin: 0.5rem 0;
  }

  .clock {
    margin: 0;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    font-weight: normal;
    gap: 0.5rem;

    color: white;
    background-color: rgb(0, 122, 255);
    border-radius: 0.5rem;
  }

  .links {
    flex: 1;
    list-style: none;
    display: flex;
    // Inherit values so that we can easily change the direction of the flexbox.
    flex-direction: inherit;
    justify-content: inherit;
    align-items: stretch;
    margin: 0;
    padding: 0;
    gap: 0.25rem;

    .menu {
      text-transform: capitalize;
      display: flex;

      & .router-link-exact-active {
        color: white;
        background-color: rgb(0, 122, 255);
        box-shadow: 0 0 0.1rem black;
      }

      a {
        flex: 1;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: all 200ms;
      }

      a:hover {
        color: white;
        background-color: rgb(106, 178, 255);
        box-shadow: 0 0 0.25rem black;
      }
    }
  }
}
</style>

<script>
export default {
  name: "NavBar",
  props: {
    menus: Array,
  },
  data() {
    return {
      time: null,
      interval: null,
      loggedOutMenu: [
        { name: 'Home', href: '/', icon: 'home' },
        { name: 'Login', href: '/signin', icon: 'login' },
        { name: 'Sign Up', href: '/signup', icon: 'how_to_reg' },
      ]
    }
  },
  beforeDestroy() {
    // prevent memory leak
    clearInterval(this.interval);
  },
  created() {
    // update the time every second
    this.interval = setInterval(() => {
      // Concise way to format time according to system locale.
      // In my case this returns "3:48:00 am"
      const options = {
        hour: 'numeric',
        minute: 'numeric',
      };

      if (this.$store.state.showClockSeconds) {
        options.second = 'numeric';
      }

      this.time = Intl.DateTimeFormat(this.$store.state.locale, options).format();
    }, 1000);
  }
}
</script>
