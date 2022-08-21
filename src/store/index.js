import { createStore } from 'vuex'
import axios from "axios";

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export default createStore({
  state: {
    username: '',
    isLoggedIn: false,
    locale: navigator.language, // TODO add to backend (and jwt)
    showClock: true,
    showClockSeconds: false,
  },
  getters: {
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setIsLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    toggleShowClock(state) {
      // TODO update server
      state.showClock = !state.showClock;
    },
    toggleShowClockSeconds(state) {
      // TODO update server
      state.showClockSeconds = !state.showClockSeconds;
    }
  },
  actions: {
    async signIn(context, { username, password }) {
      if (!username) throw new Error('Invalid argument. Username is falsy.');
      if (!password) throw new Error('Invalid arguments. Password is falsy.');

      try {
        const response = await axios.post(`${ process.env.VUE_APP_SERVER_URL }/auth/signin`, { username, password, });
        const payload = parseJwt(response.data.accessToken);

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken); // TODO https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad

        context.commit('setUsername', payload.username);
        context.commit('setIsLoggedIn', true);
      } catch (error) {
        if (error.response.data.message) {
          alert(error.response.data.message);
          console.error(error.response.data.message);
        } else {
          alert('Error: Could not sign in user');
        }

        throw new Error('Could not sign in user');
      }
    },
  },
  modules: {
  }
})
