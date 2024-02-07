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
          v-if="showGoogleLogin"
          type="button"
          class="govuk-button button-image govuk-!-margin-left-5"
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
import { httpsCallable } from '@firebase/functions';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, functions } from '@/firebase';

export default {
  data: function() {
    return {
      showGoogleLogin: false,
    };
  },
  computed: {
    authError() {
      return this.$store.state.auth.authError;
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
    async disableNewUser(uid) {
      await httpsCallable(functions, 'adminDisableNewUser')({ uid: uid });
      this.$store.dispatch('auth/setAuthError', 'Your account requires approval before access is granted. Please request this from a manager.');
    },
    signOut() {
      auth.signOut();
    },
    checkIfNewUser() {
      // move logic to auth.js
      // if (user.additionalUserInfo.isNewUser) {
      //   // new user
      //   this.disableNewUser(auth.currentUser.uid).then(() => {
      //     this.signOut();
      //   }).catch(() => {
      //     this.signOut();
      //   });
      // }
    },
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        this.checkIfNewUser(result.user);
      } catch (err) {
        this.$store.dispatch('auth/setAuthError', err.message);
      }
    },
    async loginWithMicrosoft() {
      const provider = new OAuthProvider('microsoft.com');
      try {
        const result = await signInWithPopup(auth, provider);
        this.checkIfNewUser(result.user);
      } catch (err) {
        this.$store.dispatch('auth/setAuthError', err.message);
      }
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
