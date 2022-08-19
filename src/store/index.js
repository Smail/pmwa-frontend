import { createStore } from 'vuex'

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
  },
  modules: {
  }
})
