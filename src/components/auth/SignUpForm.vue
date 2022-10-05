<template>
  <auth-common-component description="Create a new account."
                         title="Sign up"
                         @reset="clearForm"
                         @submit="signUp">
    <label class="material-symbols-outlined">person
      <input v-model="username"
             autocomplete="username"
             class="signup-form-input"
             name="username"
             placeholder="Username"
             required
             title="Enter a username"
             type="text"/>
    </label>
    <label class="material-symbols-outlined">abc
      <input v-model="firstName"
             autocomplete="given-name"
             class="signup-form-input"
             name="first-name"
             placeholder="First Name"
             required
             title="Enter your first name"
             type="text"/>
    </label>
    <label class="material-symbols-outlined">abc
      <input v-model="lastName"
             autocomplete="family-name"
             class="signup-form-input"
             name="last-name"
             placeholder="Last Name"
             required
             title="Enter your last name"
             type="text"/>
    </label>
    <label class="material-symbols-outlined">Email
      <input v-model="email"
             autocomplete="email"
             class="signup-form-input"
             name="email"
             placeholder="example@example.com"
             required
             title="Enter your E-Mail"
             type="email"/>
    </label>
    <label :style="{ '--box-color': passwordStrengthColor }"
           class="password material-symbols-outlined">Password
      <input v-model="password"
             autocomplete="new-password"
             class="signup-form-input"
             name="password"
             placeholder="Password"
             required
             title="Enter a password"
             type="password"/>
    </label>
    <p v-show="password" class="password-info">{{ passwordStrength }}</p>
    <label :class="{ mismatch: password !== repeatedPassword }"
           class="repeated-pw material-symbols-outlined"
    >Repeat
      <input v-model="repeatedPassword"
             autocomplete="new-password"
             class="signup-form-input"
             name="password-repeat"
             placeholder="Repeat Password"
             required
             title="Repeat your password"
             type="password"/>
    </label>
    <p v-show="password && repeatedPassword && !passwordsMatch" class="password-info">Passwords don't match</p>
    <div class="signup-form-btn-wrapper">
      <button type="reset">Clear Form</button>
      <span :class="{ disabled: !canSubmit }" class="submit-btn-wrapper">
        <button :class="{ disabled: !canSubmit }" type="submit">Sign Up</button>
      </span>
    </div>
  </auth-common-component>
</template>

<script>
import AuthCommonComponent from "@/components/auth/AuthCommonComponent";

export default {
  name: "SignUpForm",
  components: { AuthCommonComponent },

  props: ["title"],
  computed: {
    canSubmit() {
      return this.username && this.firstName && this.lastName && this.email
          && this.password && this.repeatedPassword && this.passwordsMatch;
    },
    passwordStrength() {
      let numLower = 0;
      let numUpper = 0;
      let numDigits = 0;
      let numSpecial = 0;
      for (let i = 0; i < this.password.length; i++) {
        const c = this.password[i];

        if (/^[a-z]$/.test(c)) numLower++;
        else if (/^[A-Z]$/.test(c)) numUpper++;
        else if (/^[0-9]$/.test(c)) numDigits++;
        else if (/^[!@#$%^&*()\-_+.]$/.test(c)) numSpecial++;
        else return "contains invalid password character";
      }

      if (this.password.length >= 12 && numLower >= 2 && numUpper >= 2 && numDigits >= 2 && numSpecial >= 2) {
        return "strong";
      } else if (this.password.length >= 10 && numLower >= 2 && numUpper >= 1 && numDigits >= 1 && numSpecial >= 1) {
        return "medium";
      } else if (this.password.length >= 8 && numLower >= 2 && numUpper >= 1 && numDigits >= 1) {
        return "weak";
      } else {
        return "too weak";
      }
    },
    passwordStrengthColor() {
      switch (this.passwordStrength) {
        case "strong":
          return "lime";
        case "medium":
          return "yellow";
        case "weak":
          return "orange";
        case "too weak":
          return "red";
        default:
          return "";
      }
    },
    passwordsMatch() {
      return this.password === this.repeatedPassword;
    },
  },
  methods: {
    async signUp() {
      try {
        await this.$http.post("auth/sign-up", {
          username: this.username,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          repeatedPassword: this.repeatedPassword,
        });
        // Redirect user to sign in page
        this.$router.push("/signin");
      } catch (e) {
        if (e.response?.data?.message != null) {
          console.error(e.response.data.message);
          alert("Error during sign up: " + e.response.data.message);
        } else {
          console.error(e.message);
          alert("An unknown error occurred");
        }
      }
    },
    clearForm() {
      this.firstName = "";
      this.lastName = "";
      this.username = "";
      this.email = "";
      this.password = "";
      this.repeatedPassword = "";
    },
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      repeatedPassword: "",
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/globals.scss";

.signup-form-btn-wrapper {
  display: flex;
  gap: 0.5em;
}

.password:focus-within {
  border-color: var(--box-color);
  box-shadow: 0 0 0.25rem var(--box-color);
}

.repeated-pw.mismatch {
  border-color: red;
  box-shadow: 0 0 0.25rem red;
}

.submit-btn-wrapper {
  display: flex;
  flex: 1;

  &.disabled {
    cursor: not-allowed;
  }

  button {
    flex: 1;
  }

  button.disabled {
    background: #444;
    pointer-events: none;
    cursor: not-allowed !important;
    border-color: #555;
  }
}

.password-info {
  text-align: left;
  font-size: 0.7rem;
  text-transform: capitalize;
}
</style>
