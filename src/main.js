import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = `${ process.env.VUE_APP_API_ENDPOINT }`;

// Check if the Authorization header is a valid Bearer Authorization header
axios.interceptors.request.use(function (config) {
  if (config.headers.Authorization != null) {
    const authHeaderComponents = config.headers.Authorization.split(' ');

    if (authHeaderComponents.length !== 2) {
      new Error(`Invalid number of Authorization header components! Expected 2, but is = ${ authHeaderComponents.length }`);
    }
    if (authHeaderComponents[0] !== 'Bearer') {
      new Error('Authorization header is not of type Bearer');
    }
    if (!authHeaderComponents[1]) {
      new Error('Bearer token is empty');
    }
  } else {
    console.debug('Note: Authorization header is null. ' +
      'This is possible when the user is logging in or when they are generally browsing unprotected realms.');
  }

  return config;
});

axios.interceptors.response.use(r => r, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response.status === 401) {
    // 401 means forbidden access and this may happen when all tokens get invalidated.
    store.dispatch('logOut');
  }

  return Promise.reject(error);
});

createApp(App)
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .mount('#app')
