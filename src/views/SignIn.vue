<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <p class="govuk-hint govuk-body govuk-!-margin-bottom-7">
        Sign in to admin dashboard with your judicialappointments.digital Google account.
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
