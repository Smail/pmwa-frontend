import { createStore } from 'vuex'
import axios from "axios";
import { requestTokens } from "@/services/requestTokens";
import { parseJwt } from "@/util/parseJwt";
import { hasTokenExpired } from "@/util/hasTokenExpired";

export default createStore({
  state: {
    username: '',
    isLoggedIn: false,
    locale: navigator.language, // TODO add to backend (and jwt)
    showClock: true,
    showClockSeconds: false,
    tasks: [],
  },
  getters: {},
  mutations: {
    setUsername: (state, username) => state.username = username,
    setIsLoggedIn: (state, isLoggedIn) => state.isLoggedIn = isLoggedIn,
    toggleShowClock: (state) => state.showClock = !state.showClock,                      // TODO update on server
    toggleShowClockSeconds: (state) => state.showClockSeconds = !state.showClockSeconds, // TODO update on server
    setTasks: (state, tasks) => state.tasks = tasks,
  },
  actions: {
    async signInViaToken(context) {
      let accessToken = localStorage['accessToken'];
      const refreshToken = localStorage['refreshToken'];
      const isAccessTokenValid = (accessToken != null && !hasTokenExpired(accessToken));
      const isRefreshTokenValid = (refreshToken != null && !hasTokenExpired(refreshToken));

      if (!isAccessTokenValid && !isRefreshTokenValid) {
        throw new Error('No tokens available');
      }

      if (!isAccessTokenValid && isRefreshTokenValid) {
        // Remove old refresh token in case the request fails
        localStorage.removeItem('refreshToken');
        // Request new token when no access token is available and the refresh token is valid.
        const { newAccessToken, newRefreshToken } = await requestTokens({ refreshToken });

        localStorage.setItem('accessToken', (accessToken = newAccessToken));
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      const accessTokenPayload = parseJwt(accessToken);

      context.commit('setUsername', accessTokenPayload.username);
      context.commit('setIsLoggedIn', true);

      axios.defaults.headers.common['Authorization'] = `Bearer ${ localStorage['accessToken'] }`;
    },
    async signInViaCredentials(context, { username, password }) {
      if (!username) throw new Error('Invalid argument. Username is falsy.');
      if (!password) throw new Error('Invalid arguments. Password is falsy.');
      const { accessToken, refreshToken } = requestTokens({ username, password });
      const accessTokenPayload = parseJwt(accessToken);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      context.commit('setUsername', accessTokenPayload.username);
      context.commit('setIsLoggedIn', true);

      axios.defaults.headers.common['Authorization'] = `Bearer ${ localStorage['accessToken'] }`;
    },
    logOut(context) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      context.commit('setUsername', '');
      context.commit('setIsLoggedIn', false);
    },
    async loadTasks(context) {
      axios.get('tasks')
        .then(response => context.commit('setTasks', response.data))
        .catch(error => {
          console.error(error);
          alert('Could not load tasks.');
        });
    }
  },
  modules: {}
})
