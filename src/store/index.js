import { createStore } from "vuex";
import axios from "axios";
import { loadTasks } from "@/services/loadTasks";
import { getTokensViaCredentials, getTokensViaStoredTokens } from "@/services/getTokens";
import { hasStoredTokens } from "@/services/hasStoredTokens";
import { storeTokens } from "@/services/storeTokens";
import { parseJwt } from "@/util/parseJwt";

export default createStore({
  state: {
    username: "",
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
    /**
     * Sign the user in using either user-supplied credentials or previously requested tokens.
     *
     * @param context
     * @param credentials And object containing a `username` and `password` field.
     *  This is a required argument IF no tokens are stored in storage, otherwise it can be omitted.
     * @returns {Promise<void>}
     */
    async signIn(context, credentials) {
      let tokens;
      if (credentials != null) {
        tokens = await getTokensViaCredentials(credentials);
      } else if (hasStoredTokens()) {
        tokens = await getTokensViaStoredTokens();
      } else {
        throw new Error("No valid sign in methods found");
      }

      // Store tokens in local storage
      storeTokens(tokens);

      // Set access token as authorization header on every axios API call
      axios.defaults.headers.common["Authorization"] = `Bearer ${ tokens.accessToken }`;

      const accessTokenPayload = parseJwt(tokens.accessToken);
      context.commit("setUsername", accessTokenPayload.username);
      context.commit("setIsLoggedIn", true);
    },
    logOut(context) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      context.commit('setUsername', '');
      context.commit('setIsLoggedIn', false);
    },
    async loadTasks(context) {
      loadTasks().then(tasks => context.commit('setTasks', tasks)).catch(error => {
        console.error(error);
        alert('Could not load tasks');
      });
    }
  },
  modules: {}
})
