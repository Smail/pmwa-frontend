import { createStore } from "vuex";
import axios from "axios";
import { loadTasks } from "@/services/loadTasks";
import { getTokensViaCredentials, getTokensViaStoredTokens } from "@/services/getTokens";
import { hasStoredTokens } from "@/services/hasStoredTokens";
import { setTokens } from "@/services/setTokens";
import { parseJwt } from "@/util/parseJwt";
import { getObjectChanges } from "@/util/getObjectChanges";
import { requestTokensViaCredentials, requestTokensViaRefreshToken } from "@/services/requestNewTokens";
import { areCredentialsValid } from "@/services/areCredentialsValid";
import { hasValidRefreshToken } from "@/services/hasValidRefreshToken";
import { hasValidAccessToken } from "@/services/hasValidAccessToken";
import { getRefreshToken } from "@/services/getRefreshToken";
import { logErrorAndAlert } from "@/util/logErrorAndAlert";
import { getAccessToken } from "@/services/getAccessToken";
import { removeRefreshToken } from "@/services/removeRefreshToken";
import { removeAccessToken } from "@/services/removeAccessToken";

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
  },
  getters: {},
  mutations: {
    setUser: (state, user) => {
      const requiredKeys = Object.keys(state.user);

      // To prevent inconsistent state, we first check if all keys exists and then assign the values.
      for (const key of requiredKeys) {
        if (!user.hasOwnProperty(key) || user[key] == null) throw new Error(`Missing key '${ key }'`);
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

      for (const key of updatableKeys) {
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
    /**
     * @throws {Error}
     */
    async updateUser(context, newUser) {
      const currentUser = context.state.user;

      // Check if all keys contained in the new user object actually exist on the current one,
      // i.e., no additional (unknown) keys are added to the state user object.
      const updatableKeys = Object.keys(currentUser);
      for (const key of Object.keys(newUser)) {
        if (!updatableKeys.includes(key)) throw new Error(`Unknown key on user object '${ key }'`);
      }

      // Force the username to be lowercase
      if (!newUser.username) newUser.username = newUser.username.toLowerCase();

      // Contains only the keys that have changed
      const changedUserObject = {};
      for (const key of Object.keys(newUser)) {
        if (currentUser[key] !== newUser[key]) changedUserObject[key] = newUser[key];
      }

      if (Object.keys(changedUserObject).length > 0) {
        const response = await axios.patch(`users/${ currentUser.username }`, changedUserObject);
        // Update user object locally, i.e., client-side
        context.commit("updateUser", changedUserObject);
        console.debug("Successfully updated the user");
      } else {
        console.debug("User object has not changed. No updates required");
      }
    },
    /**
     * Sign the user in using either user-supplied credentials or previously requested tokens.
     *
     * @param context
     * @param credentials And object containing a `username` and `password` field.
     *  This is a required argument IF no tokens are stored in storage, otherwise it can be omitted.
     * @returns {Promise<void>}
     * @throws {Error}
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
      await context.dispatch("requestUserData", accessTokenPayload.userId);

      context.commit("setIsLoggedIn", true);
    },
    /**
     * @throws {Error}
     */
    async requestUserData(context, username) {
      // TODO fix: currently user id is passed and somehow it works when an auth header is set
      if (username == null) throw new Error("Invalid argument: username is null");
      try {
        context.commit("setUser", (await axios.get(`/users/${ username }`)).data);
      } catch (e) {
        console.error(e);
        console.error("Could not get user data: %s", e.message);
        throw new Error("Could not get user data", { cause: e });
      }
    },
    logOut(context) {
      // Delete tokens
      removeAccessToken();
      removeRefreshToken();

      context.commit("resetUser");
      context.commit("setIsLoggedIn", false);

      console.debug(`%c[SUCCESS] %s`, "color: lime", "Log out the user");
    },
    /**
     * @throws {Error}
     */
    async loadTasks(context) {
      loadTasks().then(tasks => context.commit("setTasks", tasks)).catch(error => {
        console.error(error);
        alert("Could not load tasks");
      });
    },
    /**
     * @throws {Error}
     */
    async updateTask(context, task) {
      const stateTasks = context.state.tasks.filter(t => t.id === task.id);
      if (stateTasks.length === 0) {
        throw new Error(`Invalid argument: No task with ID '${ task.id }'`);
      }
      if (stateTasks.length > 1) {
        throw new Error(`Internal state error: Too many tasks with ID ${ task.id }.\n`
          + `Expected 1, but is ${ stateTasks.length }`);
      }

      try {
        // Contains only the keys that have changed
        const changes = getObjectChanges(stateTasks[0], task);
        await context.dispatch("updateTaskOnlyServer", { ...changes, id: task.id });
        context.commit("updateTask", task);
        console.debug("Update task: Successful local update");
      } catch (error) {
        alert("Failed to update task locally");
        console.error(`Failed to update task locally: ${ error }`);
        throw error;
      }
    },
    /**
     * @throws {Error}
     */
    async updateTaskOnlyServer(context, task) {
      try {
        await axios.patch(`tasks/${ task.id }`, task);
        console.debug(`%c[SUCCESS] %s`, "color: lime", "Task server update");
      } catch (e) {
        console.error("Failed to update task on server: %s", e.message);
        throw new Error("Failed to update task on server", { cause: e });
      }
    },
    /**
     * @throws {Error}
     */
    async deleteTask(context, taskId) {
      try {
        await axios.delete(`tasks/${ taskId }`);
        console.debug(`%c[SUCCESS] %s`, "color: lime", "Task server deletion");
        context.commit("removeTask", taskId);
      } catch (e) {
        console.error("Failed to delete task: %s", e.message);
        throw new Error("Failed to delete task", { cause: e });
      }
    },
  },
  modules: {},
});
