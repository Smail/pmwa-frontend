import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { getRefreshToken } from "@/services/getRefreshToken";
import { requestTokensViaRefreshToken } from "@/services/requestNewTokens";
import { setTokens } from "@/services/setTokens";
import { getAccessToken } from "@/services/getAccessToken";

axios.defaults.baseURL = `${ process.env.VUE_APP_API_ENDPOINT }`;

// Check if the Authorization header is a valid Bearer Authorization header
axios.interceptors.request.use(function (config) {
  if (config.headers.common.hasOwnProperty("Authorization")) {
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

let isRefreshing;

async function refreshTokens() {
  function requestTokens() {
    isRefreshing = new Promise(async (resolve, reject) => {
      const refreshToken = getRefreshToken();
      if (refreshToken == null) {
        return reject("No refresh token available");
      }

      try {
        return resolve(await requestTokensViaRefreshToken(refreshToken));
      } catch (e) {
        return reject(e);
      }
    });
  }

  try {
    // Block other request from also refreshing the tokens
    if (isRefreshing == null) requestTokens();

    // Wait for the refresh token request to finish
    return await isRefreshing;
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
    let httpCode = error.response.status;
    console.debug(`Server responded with ${ httpCode } (${ getReasonPhrase(httpCode) })`);

    // Forbidden happens when the credentials are wrong or invalid. Expired tokens also cause a forbidden status code.
    if (httpCode === StatusCodes.FORBIDDEN) {
      // Try to refresh the tokens and resend the request.
      if (getRefreshToken() != null) {
        console.debug("Trying to refresh tokens and then to resend the failed request");

        try {
          setTokens(await refreshTokens());
          // Update Authorization header for all future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${ getAccessToken() }`;
          // Update the initial request Authorization header (important when resending it)
          error.config.headers.Authorization = `Bearer ${ getAccessToken() }`;

          try {
            return await resendInitialRequest(error);
          } catch (e) {
            if (e.response == null) console.error(`Response of resent request is null: ${ e.message }`);
              // Update the response code to the one of the resent request.
              // The resent request may also fail, but for another reason, e.g.,
              // initial request is made => forbidden access, because token is outdated
              // => refresh tokens => resend initial request => 404 not found.
            // As you can see, the initial request would have failed anyway if the credentials were valid.
            else if (e.response.status != null) httpCode = e.response;
            // Resent request has failed again, due to unauthorized access.
            else if (e.response.status === StatusCodes.FORBIDDEN) {
              let errMsg = "Resending a failed request, due to 403 (Forbidden), failed again due to 403 (Forbidden).";
              if (e.response.data != null) errMsg += `\nResponse data: ${ e.response.data }.`;
              console.warn(errMsg + `\n${ e }`);
            }
          }
        } catch (e) {
          let errMsg = "Could not refresh tokens.";
          if (e.response == null) errMsg += " Note: No request has been made.";
          else if (e.response.data != null) errMsg += `\nResponse data: ${ e.response.data }.`;
          console.warn(errMsg + `\n${ e }`);
        }
      }
    }

    if (httpCode === StatusCodes.UNAUTHORIZED || httpCode === StatusCodes.FORBIDDEN) {
      // No user-provided credentials or tokens were supplied to the server.
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
