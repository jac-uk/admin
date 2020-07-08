<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <p class="govuk-hint govuk-body govuk-!-margin-bottom-7">
        Sign in to admin dashboard with your judicialappointments.digital Google account.
      </p>
      <p>
        <span
          v-if="authError"
          class="govuk-error-message"
        >
          <span class="govuk-visually-hidden">Error:</span> {{ authError }}
        </span>
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
  data: function() {
    return {
      signInError: null,
    };
  },
  computed: {
    authError() {
      return this.$store.state.auth.authError || this.signInError;
    },
  },
  methods: {
    loginWithGoogle() {
      const provider = new auth.GoogleAuthProvider();
      auth().signInWithPopup(provider).catch(err => {
        this.signInError = err.message;
      });
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
