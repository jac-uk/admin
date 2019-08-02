<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>JAC</span>
        <span class="font-weight-light">Apply Admin</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn v-if="$route.name !== 'sign-in'"
        @click="signOut"
      >
        Sign Out
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
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
    }
  }
};
</script>
