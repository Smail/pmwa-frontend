import { createStore } from "vuex";
import { loadTasks } from "@/services/api/loadTasks";
import { logOut } from "@/services/api/logOut";
import { requestUserData } from "@/services/api/requestUserData";
import { signIn } from "@/services/api/signIn";
import { updateUser } from "@/services/api/updateUser";
import { updateTask } from "@/services/api/updateTask";
import { deleteTask } from "@/services/api/deleteTask";
import { updateTaskOnlyServer } from "@/services/api/updateTaskOnlyServer";
import { signUp } from "@/services/api/signUp";
import { hasValidRefreshToken } from "@/services/hasValidRefreshToken";

export default createStore({
  state: {
    user: {
      userId: null,
      username: null,
      email: null,
      displayName: null,
      firstName: null,
      lastName: null,
    },
    isLoggedIn: false,
    locale: navigator.language, // TODO add to backend (and jwt)
    showClock: true,
    showClockSeconds: false,
    tasks: [],
    themes: ["red", "green", "pink", "purple", "blue", "mint"],
    settings: {
      theme: null,
    },
  },
  getters: {
    couldLogIn: (state) => {
      if (state.isLoggedIn) return true;
      return (process.env.VUE_APP_IS_DEMO) ?
        (localStorage["user"] != null && localStorage["isLoggedIn"] === "true") :
        hasValidRefreshToken();
    },
  },
  mutations: {
    setUser: (state, user) => {
      const requiredKeys = Object.keys(state.user);

      // To prevent inconsistent state, we first check if all keys exists and then assign the values.
      for (const key of requiredKeys) {
        if (!user.hasOwnProperty(key) || user[key] == null) {
          throw new Error(`Missing key '${ key }'. Arg: ${ JSON.stringify(user) }`);
        }
      }

      for (const key of requiredKeys) {
        state.user[key] = user[key];
      }
    },
    updateUser: (state, user) => {
      const updatableKeys = Object.keys(state.user);

      // Check if all keys contained in the new user object actually exist on our current one,
      // i.e., no additional unknown keys are added to the state user object.
      for (const key of Object.keys(user)) {
        if (!updatableKeys.includes(key)) throw new Error(`Unknown key on user object '${ key }'`);
      }

      for (const key of Object.keys(user)) {
        state.user[key] = user[key];
      }
      console.debug(`%c[SUCCESS] %s`, "color: lime", "Local user update");
    },
    resetUser: (state) => {
      // Reset all user object values to null
      for (const key of Object.keys(state.user)) {
        state.user[key] = null;
      }
    },
    setIsLoggedIn: (state, isLoggedIn) => state.isLoggedIn = isLoggedIn,
    toggleShowClock: (state) => state.showClock = !state.showClock,                      // TODO update on server
    toggleShowClockSeconds: (state) => state.showClockSeconds = !state.showClockSeconds, // TODO update on server
    setTasks: (state, tasks) => state.tasks = tasks,
    setTheme: (state, theme) => {
      if (!state.themes.includes(theme)) throw new Error(`Unknown theme: ${ theme }`);
      state.settings.theme = theme;
      localStorage["userPreferredTheme"] = theme;

      // Set page background
      const backgroundImage = require(`/public/${ theme }.png`);
      document.body.style.backgroundImage = `url("${ backgroundImage }")`;
    },
    updateTask: (state, task) => {
      let hasFoundId = false;
      for (const stateTask of state.tasks) {
        if (stateTask.id === task.id) {
          hasFoundId = true;
          for (const key of Object.keys(task)) {
            stateTask[key] = task[key];
          }
          break;
        }
      }
      if (!hasFoundId) throw new Error(`No task with ID ${ task.id } was found in store`);
      console.debug(`%c[SUCCESS] %s`, "color: lime", "Task local update");
    },
    /**
     * @throws {Error}
     */
    removeTask: (state, taskId) => {
      const idx = state.tasks.findIndex(t => taskId === t.id);
      if (idx === -1) throw new Error(`Invalid argument: No task with ID ${ taskId }`);
      state.tasks.splice(idx, 1);
      console.debug(`%c[SUCCESS] %s`, "color: lime", "Task local deletion");
    },
  },
  actions: {
    updateUser: updateUser,
    signIn: signIn,
    signUp: signUp,
    requestUserData: requestUserData,
    logOut: logOut,
    loadTasks: loadTasks,
    updateTask: updateTask,
    updateTaskOnlyServer: updateTaskOnlyServer,
    deleteTask: deleteTask,
  },
  modules: {},
});
