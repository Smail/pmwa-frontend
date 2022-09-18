<template>
  <form class="login-form" @submit.prevent="signIn">
    <h2 class="login-form-title">Sign In</h2>
    <label class="login-form-label material-symbols-outlined">person
      <input v-model="username"
             autocomplete="username"
             class="login-form-input"
             name="username"
             placeholder="Username"
             required
             spellcheck="false"
             type="text"/>
    </label>
    <label class="login-form-label material-symbols-outlined">password
      <input v-model="password"
             autocomplete="current-password"
             class="login-form-input"
             name="password"
             placeholder="Password"
             required
             type="password"/>
    </label>
    <button class="login-form-btn login-form-input" type="submit">Login</button>
  </form>
</template>

<script>
import { logErrorAndAlert } from "@/util/logErrorAndAlert";

export default {
  name: "SignInForm",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async signIn() {
      try {
        await this.$store.dispatch("signIn", { username: this.username, password: this.password });
        this.$router.push("/dashboard");
      } catch (e) {
        logErrorAndAlert(e.message, "An error occurred and we could not sign you in.");
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/scss/globals.scss";

.login-form {
  color: white;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color:  $theme;
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
