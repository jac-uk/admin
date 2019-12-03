<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <div class="text-center">
        <img
          src="@/assets/jac-logo.svg"
          alt="Judicial Appointments Commission"
          width="197"
          height="66"
          style="text-align: center"
        >
      </div>
      <p class="govuk-hint govuk-body govuk-!-margin-bottom-7">
        Sign in to admin dashboard with your judicialappointments.digital Google account.
      </p>
      <p>
        <button
          type="button"
          class="govuk-button button-image"
          @click="loginWithGoogle"
        >
          <img 
            alt="Sign in with Google"
            src="@/assets/btn_google_signin_light_normal_web@2x.png"
            width="191"
          >              
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import { auth } from '@/firebase';

export default {
  methods: {
    loginWithGoogle() {
      const provider = new auth.GoogleAuthProvider();
      auth().signInWithPopup(provider);
    },
  },
};
</script>

<style scoped>
  .login-container {
    max-width: 360px;
    margin: 0 auto;
  }
  .button-image {
    padding: 0;
    border: none;
    margin: 0;
    box-shadow: none;
    background-color: transparent;
  }
</style>
