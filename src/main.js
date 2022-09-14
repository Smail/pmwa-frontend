import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import { StatusCodes } from "http-status-codes";
import { getRefreshToken } from "@/services/getRefreshToken";
import { requestNewTokens } from "@/services/requestNewTokens";
import { storeTokens } from "@/services/storeTokens";

axios.defaults.baseURL = `${ process.env.VUE_APP_API_ENDPOINT }`;

// Check if the Authorization header is a valid Bearer Authorization header
axios.interceptors.request.use(function (config) {
  if (config.headers.common.Authorization != null) {
    const authHeaderComponents = config.headers.common.Authorization.split(" ");

    if (authHeaderComponents.length !== 2) {
      new Error(`Invalid number of Authorization header components! Expected 2, but is = ${ authHeaderComponents.length }`);
    }
    if (authHeaderComponents[0] !== "Bearer") {
      new Error("Authorization header is not of type Bearer");
    }
    if (!authHeaderComponents[1]) {
      new Error("Bearer token is empty");
    }
  } else {
    console.debug("Note: Authorization header is null. " +
      "This is possible when the user is logging in or when they are generally browsing unprotected realms.");
  }

  return config;
});

async function refreshTokens() {
  let isRefreshing;

  function requestTokens() {
    isRefreshing = new Promise(async (resolve, reject) => {
      const refreshToken = getRefreshToken();
      if (refreshToken == null) {
        return reject("No refresh token available");
      }

      // Request new tokens
      try {
        const tokens = await requestNewTokens({ refreshToken });
        storeTokens(tokens);
        axios.defaults.headers.common["Authorization"] = `Bearer ${ tokens.accessToken }`;

        return resolve();
      } catch (e) {
        return reject(e);
      }
    });
  }

  try {
    // Block other request from also refreshing the tokens
    if (isRefreshing == null) requestTokens();

    // Wait for the refresh token request to finish
    await isRefreshing;
  } catch (e) {
    throw e;
  } finally {
    isRefreshing = null;
  }
}

async function resendInitialRequest(error) {
  // Create a new axios instance to circumvent all interceptors,
  // which may cause an infinite loop when refreshing the tokens.
  // It will already have a base URL and authorization header with the new access token.
  return await axios.create().request(error.config);
}

axios.interceptors.response.use(r => r, async function (error) {
    // Any status code >= 400 triggers this function
    console.warn(`A request failed: ${ error }`);
    if (error.response.status === StatusCodes.UNAUTHORIZED) {
      // No user-provided credentials or tokens were supplied to the server.
      await store.dispatch("logOut");
    }

    // Forbidden happens when the credentials are wrong or invalid. Expired tokens also cause a forbidden status code.
    if (error.response.status === StatusCodes.FORBIDDEN || error.response.status === StatusCodes.UNAUTHORIZED) {
      // Try to refresh the tokens and resend the request.
      const refreshToken = getRefreshToken();
      if (refreshToken != null) {
        try {
          await refreshTokens();
          console.log(`axios.defaults.headers.common["Authorization"] = ${ axios.defaults.headers.common["Authorization"] }`);

          try {
            return await resendInitialRequest(error);
          } catch (e) {
            let errMsg = "An error occurred after refreshing the tokens and resending the initial request.";
            if (e.response != null && e.response.data != null) errMsg += `\nResponse data: ${ e.response.data }.`;
            console.error(errMsg + `\nError: ${ e }`);
          }
        } catch (e) {
          let errMsg = "An error occurred while refreshing the tokens.";
          if (e.response != null && e.response.data != null) errMsg += `\nResponse data: ${ e.response.data }.`;
          console.error(errMsg + `\nError: ${ e }`);
        }
      }

      await store.dispatch("logOut");
    }

    return Promise.reject(error);
  },
);


createApp(App)
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .mount("#app");
