<template>
  <div v-if="$store.state.isLoggedIn" class="app-content-wrapper">
    <nav-bar id="app-navbar" :menus="menus"></nav-bar>
    <router-view id="app-content" />
  </div>
  <div v-else class="app-content-wrapper" style="flex-direction: column;">
    <nav-bar id="app-navbar" :menus="menus" style="flex-direction: row; justify-content: flex-end"></nav-bar>
    <router-view id="app-content" />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  components: { NavBar },
  methods: {
    parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    }
  },
  data() {
    return {
      menus: [
        // Menu 1
        [
          { name: 'Dashboard', href: '/dashboard', icon: 'space_dashboard' },
          { name: 'Todo', href: '/todo', icon: 'check' },
          { name: 'Calendar', href: '/calendar', icon: 'calendar_month' },
          { name: 'Flashcards', href: '/flashcards', icon: 'school' },
          { name: 'Projects', href: '/projects', icon: 'view_kanban' },
          { name: 'Settings', href: '/settings', icon: 'settings' },
        ],
      ]
    }
  },
  async created() {
    // this.$store.commit('setIsLoggedIn', true);
    // Check if there is a (valid) access or refresh token in storage.
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    let shouldRefreshToken = true;

    if (accessToken != null) {
      const accessTokenPayload = this.parseJwt(accessToken);

      // Did token already expire?
      if (Date.now() >= accessTokenPayload.exp * 1000) {
        // Token expired. Request new one with refresh token
        console.debug('Access token expired');
      } else {
        // Access token is still valid. Use it.
        console.debug('Logging user in with access token');

        this.$store.commit('setUsername', accessTokenPayload.username);
        this.$store.commit('setIsLoggedIn', true);

        shouldRefreshToken = false;
      }
    } else {
      console.debug('No access token available');
    }

    if (refreshToken != null && shouldRefreshToken) {
      const refreshTokenPayload = this.parseJwt(refreshToken);

      console.debug('Requesting token refresh');

      // Did token already expire?
      if (!(Date.now() >= refreshTokenPayload.exp * 1000)) {
        // Refresh token did NOT expire.
        // Request new token.
        this.$http.post('http://localhost:8090/auth/refresh-token', {
          username: refreshTokenPayload.username,
          refreshToken: refreshToken,
        }).then(response => {
          const payload = this.parseJwt(response.data.accessToken);

          localStorage.setItem('accessToken', response.data.accessToken);
          // TODO https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad
          localStorage.setItem('refreshToken', response.data.refreshToken);

          this.$store.commit('setUsername', payload.username);
          this.$store.commit('setIsLoggedIn', true);

          // this.$router.push('/');
        }).catch(error => {
          console.error(error.response.data.message);

          // A refresh token is only valid once,
          // so if it has failed here already,
          // then this token will never work anyways and we can simply delete it.
          // This also prevents subsequent refresh token requests if the user reloads the page.
          localStorage.removeItem('refreshToken');
        });
      } else {
        console.debug('Refresh token expired');
      }
    } else if (refreshToken == null) {
      console.debug('No refresh token available');
    }
  }
}
</script>

<style lang="scss">
* {
  list-style: none;
  margin: 0;
  padding: 0;
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
}

// a {
//   color: inherit;
//   text-decoration: none;
// }

body {
  margin: 0;
  min-height: 100vh;
  height: 100vh;
  // Let flexbox deal with width
  // min-width: 100vw;
  // width: 100vw;
  display: flex;

  #app {
    display: flex;
    flex: 1;

    .app-content-wrapper {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      display: flex;
      margin: 0.5rem;
      gap: 1rem;
      flex: 1;

      // .navbar {}

      #app-content {
        flex: 1;
      }
    }
  }
}
</style>
