import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = `${ process.env.VUE_APP_API_ENDPOINT }`;

axios.interceptors.response.use(r => r, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response.status === 401) {
    // If an unauthorized status code appears, then
    // the user credentials are no longer valid if there even are any.
    // Remove tokens from storage to force a re-login.
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  return Promise.reject(error);
});

createApp(App)
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .mount('#app')
