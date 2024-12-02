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
import { GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithCustomToken } from 'firebase/auth';
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
        const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTczMzA5NjkzNywiZXhwIjoxNzMzMTAwNTM3LCJpc3MiOiJkaWdpdGFsLXBsYXRmb3JtLWRldmVsb3BAYXBwc3BvdC5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZGlnaXRhbC1wbGF0Zm9ybS1kZXZlbG9wQGFwcHNwb3QuZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6ImVCVThNdDVmWXBYN3QwTnRwazNtVWtJbzhWQTMifQ.Lvnsh8f_xeFxI1YlxFTON1xkxzAK5MmMRmt_vVeXiaoZMU9_rpxbpzzXzg3tBdn_c7e9UdlX0l2ZUfnP1ni2BHVqmoJ_C1P62KRc1lIqROzYo6VBnv8JK9rZU7vMhWQDCMjCQl_2Ad3zeJmfHvNIpUt3Cp7hsa0pzJE4Yqbtvb0vn1FQqSQwSQXQzkuUKUicvlqoQ_Zl5QoRkLQB3cFPJkwhmTT9FOOZY7jHNqnKvLfxTcV7KqBxDSdJ1cyYm3rIPO7HJWmyOWvy7dfkU1036Hkn09AoDEoPEtrV_GSeoix0vPPBxJOkSt6DQUs4bqGGCmBgf4nrdVkVOyCV-lSKHg';
        const o = await signInWithCustomToken(auth, token);
        console.log('o', o);
        const result = await signInWithPopup(auth, provider);
        const credential = result.credential;
        console.log('result', result);
        console.log('_tokenResponse', result._tokenResponse);
        console.log('credential', credential);
        console.log('credential', credential.accessToken);
        console.log('credential', credential.user);
        this.checkIfNewUser(result.user);

      } catch (err) {
        this.$store.dispatch('auth/setAuthError', err.message);
      }
    },
    async loginWithMicrosoft() {
      const provider = new OAuthProvider('microsoft.com');
      try {
        const result = await signInWithPopup(auth, provider);
        const credential = result.credential;
        console.log('result', result);
        console.log('_tokenResponse', result._tokenResponse);
        console.log('credential', credential);
        console.log('credential', credential.accessToken);
        console.log('credential', credential.user);
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
