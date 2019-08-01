<template>
  <div id="firebaseui-auth-container" />
</template>

<script>
import {auth} from '@/firebase';
import firebaseui from 'firebaseui';

export default {
  name: 'FirebaseUI',
  data() {
    return {
      uiConfig: {
        signInOptions: [
          {
            provider: auth.GoogleAuthProvider.PROVIDER_ID,
            customParameters: {
              hd: 'judicialappointments.digital',
            },
          },
        ],
        callbacks: {
          signInSuccessWithAuthResult: this.signInSuccess,
        },
      },
    };
  },
  mounted() {
    this.ui = new firebaseui.auth.AuthUI(auth());
    this.ui.start('#firebaseui-auth-container', this.uiConfig);
  },
  destroyed() {
    this.ui.delete();
  },
  methods: {
    signInSuccess(authResult) {
      this.$emit('signInSuccess', authResult);
      // Return false to disable FirebaseUI auth redirect
      return false;
    },
  },
};
</script>

<style src="firebaseui/dist/firebaseui.css"></style>
