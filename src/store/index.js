import { createStore } from 'vuex'

export default createStore({
  state: {
    username: '',
    isLoggedIn: false,
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
  },
  actions: {
  },
  modules: {
  }
})
