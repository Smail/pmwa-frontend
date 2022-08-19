<template>
  <form class="signup-form" @submit.prevent="signUp">
    <h2 v-if="title != null" class="signup-form-title">{{ title }}</h2>
    <label class="signup-form-label signup-form-label-username">Username
      <input class="signup-form-input" name="username" placeholder="Username" type="text" autocomplete="username"
        required v-model="username" />
    </label>
    <label class="signup-form-label">First Name
      <input class="signup-form-input" name="first-name" placeholder="First Name" type="text" autocomplete="given-name"
        required v-model="firstName" />
    </label>
    <label class="signup-form-label">Last Name
      <input class="signup-form-input" name="last-name" placeholder="Last Name" type="text" autocomplete="family-name"
        required v-model="lastName" />
    </label>
    <label class="signup-form-label">E-Mail
      <input class="signup-form-input" name="email" placeholder="example@example.com" type="email" autocomplete="email"
        required v-model="email" />
    </label>
    <label class="signup-form-label">Password
      <input class="signup-form-input" name="password" placeholder="Password" type="password"
        autocomplete="new-password" required v-model="password" />
    </label>
    <div v-if="password.length > 0" class="signup-form-password-strength-wrapper">
      <span class="signup-form-password-strength-color" :style="{ 'background-color': passwordStrengthColor }"></span>
      <span class="signup-form-password-strength-text">{{ passwordStrength }}</span>
    </div>
    <label class="signup-form-label">Repeat Password
      <input class="signup-form-input" name="password-repeat" placeholder="Repeat Password" type="password"
        autocomplete="new-password" required v-model="repeatedPassword" />
    </label>
    <div v-if="!passwordsMatch" class="signup-form-password-match">
      Passwords don't match
    </div>
    <div class="signup-form-btn-wrapper">
      <button class="signup-form-input signup-form-btn" type="reset">Clear</button>
      <button class="signup-form-input signup-form-btn" type="submit">Sign Up</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "SignUpForm",
  props: ["title"],
  computed: {
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
        else if (/^[!@#$%^&*()\-__+.]$/.test(c)) numSpecial++;
        else return 'contains invalid password character';
      }

      if (this.password.length >= 12 && numLower >= 2 && numUpper >= 2 && numDigits >= 2 && numSpecial >= 2) {
        return "strong";
      } else if (this.password.length >= 10 && numLower >= 2 && numUpper >= 1 && numDigits >= 1 && numSpecial >= 1) {
        return "medium";
      } else if (this.password.length >= 8 && numLower >= 2 && numUpper >= 1 && numDigits >= 1) {
        return "weak";
      } else {
        return "invalid";
      }
    },
    passwordStrengthColor() {
      switch (this.passwordStrength) {
        case "strong":
          return "green";
        case "medium":
          return "orange";
        case "weak":
          return "orangered";
        default:
          return "lightgray";
      }
    },
    passwordsMatch() {
      return this.password === this.repeatedPassword;
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
    }
  },
  methods: {
    signUp() {
      this.$http.post("http://localhost:8090/auth/signup", {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        repeatedPassword: this.repeatedPassword,
      }).then((response) => {
        if (response.status === 201) {
          this.$router.push('/signin');
        } else {
          console.warn(`Unexpected successful http status code: ${response.status}`);
        }
      }).catch(error => {
        alert(error.response.data.message);
      });
    }
  }
}
</script>

<style lang="scss">
$theme: rgb(0, 122, 255);

.signup-form {
  color: white;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: $theme;
  border-radius: 1rem;
  box-shadow: 0 0 0.1rem black;
}

.signup-form-label {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
}

.signup-form-input {
  background-color: darken($theme, 10%);
  outline: none;
  border: 1px solid darken($theme, 20%);
  border-radius: 0.25rem;
  padding: 0.5rem;
}

.signup-form-input:hover {
  background-color: darken($theme, 5%);
}

.signup-form-input:focus {
  filter: drop-shadow(0 0 0.1rem white);
}

.signup-form-input::placeholder {
  color: lighten($theme, 20%);
}

.signup-form-btn-wrapper {
  display: flex;
  gap: 0.5rem;

  * {
    // Make form buttons same size 
    flex: 1;
  }
}

.signup-form-password-strength-wrapper {
  display: flex;
  gap: 0.5rem;
  font-size: smaller;

  .signup-form-password-strength-color {
    flex: 1;
    border-radius: 1rem;
  }

  .signup-form-password-strength-text {
    text-transform: capitalize;
  }
}

.signup-form-password-match {
  color: pink;
}

.signup-form-btn {
  cursor: pointer;
}
</style>