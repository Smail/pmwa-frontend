<template>
  <form class="login-form" @submit.prevent="signIn">
    <h2 v-if="title != null" class="login-form-title">{{ title }}</h2>
    <label class="login-form-label">Username
      <input class="login-form-input" name="username" placeholder="Username" type="text" autocomplete="username"
        required v-model="username" />
    </label>
    <label class="login-form-label">Password
      <input class="login-form-input" name="password" placeholder="Password" type="password"
        autocomplete="current-password" required v-model="password" />
    </label>
    <button class="login-form-btn login-form-input" type="submit">Login</button>
  </form>
</template>

<script>
export default {
  name: "SignInForm",
  props: ["title"],
  data() {
    return {
      username: "",
      password: "",
    }
  },
  methods: {
    parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    },
    signIn() {
      this.$http.post('http://localhost:8090/auth/signin', {
        username: this.username,
        password: this.password,
      }).then((response) => {
        console.log(response.data);
        localStorage.setItem('accessToken', response.data.accessToken);
        // TODO https://medium.com/@sadnub/simple-and-secure-api-authentication-for-spas-e46bcea592ad
        localStorage.setItem('refreshToken', response.data.refreshToken);
        const payload = this.parseJwt(response.data.accessToken);
        console.log(payload);

        this.$store.commit('setUsername', payload.username);
        this.$store.commit('setIsLoggedIn', true);

        this.$router.push('/');
      }).catch(error => {
        alert(error.response.data.message);
      });
    }
  }
}
</script>

<style lang="scss">
$theme: rgb(0, 122, 255);

.login-form {
  color: white;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: $theme;
  border-radius: 1rem;
  filter: drop-shadow(0 0 0.1rem #a0a0a0);
}

.login-form-label {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
}

.login-form-input {
  background-color: darken($theme, 10%);
  outline: none;
  border: 1px solid darken($theme, 20%);
  border-radius: 0.25rem;
  padding: 0.5rem;
}

.login-form-input:hover {
  background-color: darken($theme, 5%);
}

.login-form-input:focus {
  filter: drop-shadow(0 0 0.1rem white);
}

.login-form-input::placeholder {
  color: lighten($theme, 20%);
}

.login-form-btn {
  cursor: pointer;
}
</style>