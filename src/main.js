import { createApp } from 'vue';

import App from '@/App';
import router from '@/router';
import store from '@/store';

import * as filters from '@jac-uk/jac-kit/filters/filters';

import { auth, functions } from '@/firebase';
import * as localFilters from '@/filters';
import VueDOMPurifyHTML from 'vue-dompurify-html';

import CKEditor from '@ckeditor/ckeditor5-vue';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import './styles/main.scss';

import mitt from 'mitt';
const emitter = mitt();

// Merged filters (localFilters will override filters below in event of naming collisions)
const allFilters = Object.assign({}, filters, localFilters);

const vueInstance = false;
auth.onAuthStateChanged(async (user) => {
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
    try {
      const idTokenResult = await user.getIdTokenResult();
      // Get user role
      const userRoleId = idTokenResult.claims && idTokenResult.claims.r ? idTokenResult.claims.r : null;
      if (userRoleId) {
        const res = await functions.httpsCallable('adminSyncUserRolePermissions')();
        const userRole = {
          roleId: userRoleId,
          rolePermissions: res.data,
        };
        store.dispatch('auth/setUserRole', userRole);
      }
    } catch (error) {
      // console.error(error);
    }
    if (window.location.pathname == '/sign-in') {
      router.push('/');
    }
  }

  // Create the Vue instance, but only once
  if (!vueInstance) {

    // Root instance
    const vueInstance = createApp(App)
      .use(router)
      .use(store)
      .use(CKEditor)
      .use(VueDOMPurifyHTML);

    // Bind global filters before mounting
    vueInstance.config.globalProperties.$filters = allFilters;

    // Bind emitter for global events
    vueInstance.config.globalProperties.emitter = emitter;

    // Root component
    vueInstance.mount('#app');

    // Initialise Sentry
    if (process.env.NODE_ENV !== 'development') {
      Sentry.init({
        vueInstance,
        dsn: 'https://ab99abfef6294bc5b564e635d7b7cb4b@sentry.io/1792541',
        environment: store.getters.appEnvironment.toLowerCase(),
        release: process.env.PACKAGE_VERSION, // made available in vue.config.js
        integrations: [
          new BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          }),
        ],
      });
    }
  }
});
