import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import { StatusCodes } from "http-status-codes";
import { getRefreshToken } from "@/services/getRefreshToken";
import { requestNewTokens } from "@/services/requestNewTokens";
import { setTokens } from "@/services/setTokens";
import { getAccessToken } from "@/services/getAccessToken";

axios.defaults.baseURL = `${ process.env.VUE_APP_API_ENDPOINT }`;

// Check if the Authorization header is a valid Bearer Authorization header
axios.interceptors.request.use(function (config) {
  if (config.headers.common.Authorization != null) {
    const authHeaderComponents = config.headers.common.Authorization.split(" ");

    if (authHeaderComponents.length !== 2) {
      throw new Error(`Invalid number of Authorization header components: ${ config.headers.common.Authorization }`);
    }
    if (authHeaderComponents[0] !== "Bearer") {
      throw new Error(`Authorization header is not of type Bearer: ${ config.headers.common.Authorization }`);
    }
    if (!authHeaderComponents[1]) {
      throw new Error("Bearer token is empty");
    }
  } else {
    console.debug("No Authorization header set");
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
        setTokens(await requestNewTokens({ refreshToken }));
        axios.defaults.headers.common["Authorization"] = `Bearer ${ getAccessToken() }`;

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

          try {
            return await resendInitialRequest(error);
          } catch (e) {
            let errMsg = "Resending a failed request failed, too.";
            if (e.response != null && e.response.data != null) errMsg += `\nResponse data: ${ e.response.data }.`;
            console.error(errMsg + `\nError: ${ e }`);
          }
        } catch (e) {
          let errMsg = "Could not refresh tokens.";
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
