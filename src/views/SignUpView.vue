<template>
  <div class="signup">
    <div class="signup-form-wrapper">
      <sign-up-form title="Welcome back!"></sign-up-form>
    </div>
  </div>
</template>

<script>
import SignUpForm from '@/components/SignUpForm.vue'

export default {
  name: "SignUpView",
  components: { SignUpForm },
}
</script>

<style lang="scss">
.signup {
  display: flex;
  // Center sign up component
  flex-direction: column;
  justify-content: center;
}

.signup-form-wrapper {
  display: flex;
  justify-content: center;
}
</style>
