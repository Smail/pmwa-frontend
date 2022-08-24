import { createStore } from 'vuex'
import axios from "axios";

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function hasTokenExpired(token) {
  return Date.now() < token.exp * 1000;
}

async function requestNewTokenPair(refreshToken) {
  console.debug('Requesting new token pair');
  if (refreshToken == null) throw new Error('No refresh token found in local storage');
  if (hasTokenExpired(refreshToken)) throw new Error('Refresh token has expired');
  const refreshTokenPayload = parseJwt(refreshToken);
  const response = await axios.post('auth/refresh-token', {
    username: refreshTokenPayload.username,
    refreshToken: refreshToken,
  });
  return {
    newAccessToken: response.data.accessToken,
    newRefreshToken: response.data.refreshToken
  };
}

export default createStore({
  state: {
    username: '',
    isLoggedIn: false,
    locale: navigator.language, // TODO add to backend (and jwt)
    showClock: true,
    showClockSeconds: false,
  },
  getters: {},
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
    },
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
        const { newAccessToken, newRefreshToken } = await requestNewTokenPair(refreshToken);

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

      try {
        const response = await axios.post(`${ process.env.VUE_APP_API_ENDPOINT }/auth/signin`, { username, password, });
        const payload = parseJwt(response.data.accessToken);

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken); // TODO https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad

        context.commit('setUsername', payload.username);
        context.commit('setIsLoggedIn', true);

        axios.defaults.headers.common['Authorization'] = `Bearer ${ localStorage['accessToken'] }`;
      } catch (error) {
        if (error.response.data.message) {
          alert(error.response.data.message);
          console.error(error.response.data.message);
        } else {
          alert('Error: Could not sign in user');
        }

        throw new Error('Could not sign in user');
      }
    },
    logOut(context) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      context.commit('setUsername', '');
      context.commit('setIsLoggedIn', false);
    },
  },
  modules: {}
})
