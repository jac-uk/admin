import Vue from 'vue';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import * as filters from '@jac-uk/jac-kit/filters/filters';
import { auth, functions } from '@/firebase';
import * as localFilters from '@/filters';

import CKEditor from '@ckeditor/ckeditor5-vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import './styles/main.scss';

if (process.env.NODE_ENV !== 'development') {
  // Split the URL
  const host = window.location.host;
  const parts = host.split('.');

  Sentry.init({
    dsn: 'https://ab99abfef6294bc5b564e635d7b7cb4b@sentry.io/1792541',
    environment: parts[0] == 'admin' ? 'production' : 'staging',
    release: process.env.PACKAGE_VERSION, // made available in vue.config.js
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
  });
}

Vue.config.productionTip = false;
Vue.use( CKEditor );

// Register global filters
Object.keys(filters)
  .forEach((filterName) => {
    Vue.filter(filterName, filters[filterName]);
  });
// Register local filters (replace global filters of same name)
Object.keys(localFilters)
  .forEach((filterName) => {
    Vue.filter(filterName, localFilters[filterName]);
  });

let vueInstance = false;
auth().onAuthStateChanged((user) => {
  // check if user is a new user.
  // TODO: check if there is a better way of doing this
  // TODO: the logic for this actually sits on SignIn.vue but the redirect on line 44 still occurs without the next 3 lines
  // TODO: and a check within auth.js
  if (user && user.metadata.lastSignInTime === user.metadata.creationTime) {
    user.isNewUser = true;
  }

  // Bind Firebase auth state to the vuex auth state store
  store.dispatch('auth/setCurrentUser', user);
  if (store.getters['auth/isSignedIn']) {
    user.getIdTokenResult()
      .then(async (idTokenResult) => {
        if (idTokenResult.claims && idTokenResult.claims.r) {
          await functions.httpsCallable('adminSyncUserRolePermissions')();
        }
      })
      .catch((error) => {
        console.log(error);
      });
    if (window.location.pathname == '/sign-in') {
      router.push('/');
    }
  }
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
