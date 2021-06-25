<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <p class="govuk-hint govuk-body govuk-!-margin-bottom-7">
        Sign in to admin dashboard with your judicialappointments.gov.uk account.
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
          class="govuk-button"
          @click="loginWithMicrosoft"
        >
          Sign in with Microsoft
        </button>

        <button
          type="button"
          class="govuk-button button-image govuk-!-margin-left-5"
          @click="loginWithGoogle"
          v-if="showGoogleLogin"
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
      showGoogleLogin: false,
    };
  },
  computed: {
    authError() {
      return this.$store.state.auth.authError || this.signInError;
    },
  },
  created() {
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        this.showGoogleLogin = true;
      }
    });
  },
  methods: {
    loginWithGoogle() {
      const provider = new auth.GoogleAuthProvider();
      auth().signInWithPopup(provider).catch(err => {
        this.signInError = err.message;
      });
    },
    loginWithMicrosoft() {
      const provider = new auth.OAuthProvider('microsoft.com');
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
