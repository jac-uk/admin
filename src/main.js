import Vue from 'vue';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import { auth } from '@/firebase';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

Sentry.init({
  dsn: 'https://ab99abfef6294bc5b564e635d7b7cb4b@sentry.io/1792541',
  integrations: [new Integrations.Vue({Vue, attachProps: true})],
});
Vue.config.productionTip = false;

let vueInstance = false;
auth().onAuthStateChanged( (user) => {
  // Bind Firebase auth state to the vuex auth state store
  store.dispatch('setCurrentUser', user);

  // Create the Vue instance, but only once
  if (!vueInstance) {
    vueInstance = new Vue({
      el: '#app',
      render: h => h(App),
      router,
      store,
    });
  }
});
