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

// Acts as mutex
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
    console.debug(`Server responded with ${ httpCode } (${ getReasonPhrase(httpCode) }) for URL ${ error.config.baseURL }/${ error.config.url }: ${ error.response.data }`);

    // Forbidden happens when the credentials are wrong or invalid. Expired tokens also cause a forbidden status code.
    if (httpCode === StatusCodes.FORBIDDEN) {
      // Only try to refresh and resend if there's even a refresh token available.
      let shouldRefreshTokens = (getRefreshToken() != null);
      let shouldResendRequest = shouldRefreshTokens;

      let oldAccessToken = error.config.headers.Authorization?.split(" ");
      if (oldAccessToken != null && oldAccessToken.length === 2 && getAccessToken() !== oldAccessToken[1]) {
        console.debug("Access token has changed in between request and response. " +
          "Trying to resend the request with the new tokens");
        // Try resending the request with the newly updated tokens.
        shouldRefreshTokens = false;
      }

      if (shouldRefreshTokens) {
        // Try to refresh the tokens and resend the request.
        console.debug("Trying to refresh tokens.");

        try {
          setTokens(await refreshTokens());
          // Update the Authorization header for all future requests.
          axios.defaults.headers.common["Authorization"] = `Bearer ${ getAccessToken() }`;
        } catch (e) {
          let errMsg = "Could not refresh tokens.";
          if (e.response == null) {
            errMsg += " Note: No request has been made.";
          } else if (e.response.data != null) {
            errMsg += `\nResponse data: ${ e.response.data }.`;
          }

          console.warn(errMsg + `\n${ e }`);

          // Any subsequent request will inevitably fail as well, since we couldn't get new tokens.
          // Hence, we don't even have to try.
          shouldResendRequest = false;
        }
      }

      if (shouldResendRequest) {
        console.debug("Resending the failed request.");
        try {
          // Update the Authorization header in the initial request (important when resending the same object).
          error.config.headers.Authorization = `Bearer ${ getAccessToken() }`;
          return await resendInitialRequest(error);
        } catch (e) {
          if (e.response == null) {
            console.error(`Response of resent request is null: ${ e.message }`);
          } else if (e.response.status != null) {
            // Update the response code to the one of the resent request.
            // The resent request may also fail, but for another reason, e.g.,
            // initial request is made => forbidden access, because token is outdated
            // => refresh tokens => resend initial request => 404 not found.
            // As you can see, the initial request would have failed anyway if the credentials were valid.
            httpCode = e.response;
          } else if (e.response.status === StatusCodes.FORBIDDEN) {
            // Resent request has failed again, due to unauthorized access.
            let errMsg = "Resending a failed request, that failed due to 403 (Forbidden), " +
              "has failed again with the same error code";
            if (e.response.data != null) errMsg += `\nResponse data: ${ e.response.data }.`;
            console.warn(errMsg + `\n${ e }`);
          }
        }
      }
    }

    if (httpCode === StatusCodes.UNAUTHORIZED || httpCode === StatusCodes.FORBIDDEN) {
      // No valid (user-provided) credentials could be supplied to the server.
      // Hence, we're logging out the user and require a new sign in.
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
