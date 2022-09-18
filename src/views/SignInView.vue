<template>
  <div class="login">
    <div class="login-form-wrapper">
      <sign-in-form></sign-in-form>
    </div>
  </div>
</template>

<script>
import SignInForm from "@/components/auth/SignInForm.vue";

export default {
  name: "SignInView",
  components: { SignInForm },
};
</script>

<style lang="scss">
.login {
  display: flex;
  // Center sign in component
  flex-direction: column;
  justify-content: center;
}

.login-form-wrapper {
  display: flex;
  justify-content: center;
}
</style>
