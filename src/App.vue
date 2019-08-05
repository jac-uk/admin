<template>
  <div>
    <header>
      <img
        src="@/assets/jac-logo.svg"
        alt="Judicial Appointments Commission"
        width="197"
        height="66"
      >
      <button
        v-if="$route.name !== 'sign-in'"
        @click="signOut"
      >
        Sign Out
      </button>
    </header>
    <RouterView />
  </div>
</template>

<script>
import { auth } from '@/firebase';

export default {
  name: 'App',
  data: () => ({
    //
  }),
  methods: {
    signOut() {
      auth().signOut();
      this.$router.go('/sign-in');
    },
  },
};
</script>
