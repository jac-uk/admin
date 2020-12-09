import Vue from 'vue';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import * as filters from '@jac-uk/jac-kit/filters/filters';
import { auth } from '@/firebase';
import CKEditor from '@ckeditor/ckeditor5-vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

if (process.env.NODE_ENV !== 'development') {
  // Split the URL
  const host = window.location.host;
  const parts = host.split('.');

  Sentry.init({
    dsn: 'https://ab99abfef6294bc5b564e635d7b7cb4b@sentry.io/1792541',
    environment: parts[0] == 'admin' ? 'production' : 'staging',
    release: process.env.npm_package_version,
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

let vueInstance = false;
auth().onAuthStateChanged( (user) => {
  // Bind Firebase auth state to the vuex auth state store
  store.dispatch('auth/setCurrentUser', user);
  if (store.getters['auth/isSignedIn']) {
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
