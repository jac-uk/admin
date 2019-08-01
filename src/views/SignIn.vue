<template>
  <div class="mt-3">
    <div class="login-container text-center">
      <div class="mb-3 mt-5">
        <img
          src="@/assets/jac-logo.svg"
          alt="Judicial Appointments Commission"
          width="197"
          height="66"
        >
      </div>
      <p class="mb-4 mt-5">
        Sign in to admin dashboard with your judicialappointments.digital Google account
      </p>
      <FirebaseUI @signInSuccess="loginRedirect" />
    </div>
  </div>
</template>

<script>
import FirebaseUI from '@/components/FirebaseUI';

export default {
  components: {
    FirebaseUI,
  } ,
  methods: {
    loginRedirect(authResult) {
      this.$store.dispatch('setCurrentUser', authResult.user);
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
  .login-container {
    max-width: 360px;
    margin: 0 auto;
  }
</style>
