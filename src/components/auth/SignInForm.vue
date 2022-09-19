<template>
  <form class="login-form" @submit.prevent="signIn">
    <h2 class="login-form-title">Sign In</h2>
    <p class="login-form-desc">Log in to access the site.</p>
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
  padding: 2rem 3rem;
  background: var(--primary-color-500-0\.8);
  border-radius: 1rem;
  position: relative;
  backdrop-filter: blur(20rem);
  box-shadow: 0 0 1rem -0.75rem black;
}

.login-form-title {
  align-self: flex-start;
}

.login-form-desc {
  align-self: flex-start;
  color: #d9d9d9;
  margin-bottom: 1rem;
}

.login-form-label {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
  font-weight: normal;
  border: 1px solid var(--primary-color-300);
  background-color: var(--primary-color-400);
  border-radius: 0.25rem;
  padding-left: 0.5rem;
  transition: all 50ms ease-in-out;

  .login-form-input {
    padding: 0.75rem;
  }

  &.material-symbols-outlined {
    font-variation-settings: 'FILL' 0,
    'wght' 300,
    'GRAD' 0,
    'opsz' 48
  }

  &:hover {
    background-color: var(--primary-color-500);
  }

  &:focus-within {
    box-shadow: 0 0 1rem -0.25rem white;
  }
}

.login-form-input {
  background-color: transparent;
  outline: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: none;
}

.login-form-btn {
  cursor: pointer;
  border: none;
  background: var(--primary-color-500);
  margin-top: 1rem;
  transition: all 150ms ease-in-out;

  &:hover {
    background-color: var(--primary-color-500);
  }

  &:active {
    background-color: var(--primary-color-400);
  }
}
</style>
