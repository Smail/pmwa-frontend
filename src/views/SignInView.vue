<template>
  <div class="sign-in-view">
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
.sign-in-view {
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
