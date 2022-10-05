<template>
  <auth-common-component description="Log in to access the site."
                         title="Sign In"
                         @submit="signIn">
    <label class="material-symbols-outlined">person
      <input v-model="username"
             autocomplete="username"
             class="login-form-input"
             name="username"
             placeholder="Username"
             required
             spellcheck="false"
             title="Enter your username"
             type="text"/>
    </label>
    <label class="material-symbols-outlined">password
      <input v-model="password"
             autocomplete="current-password"
             class="login-form-input"
             name="password"
             placeholder="Password"
             required
             title="Enter your password"
             type="password"/>
    </label>
    <button type="submit">Login</button>
  </auth-common-component>
</template>

<script>
import { logErrorAndAlert } from "@/util/logErrorAndAlert";
import AuthCommonComponent from "@/components/auth/AuthCommonComponent";

export default {
  name: "SignInForm",
  components: { AuthCommonComponent },
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
        logErrorAndAlert(e.message, `An error occurred and we could not sign you in.\nError: ${ e.message }`);
      }
    },
  },
};
</script>
