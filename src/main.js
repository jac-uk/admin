import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import * as filters from '@jac-uk/jac-kit/filters/filters';

import { auth } from '@/firebase';
import * as localFilters from '@/filters';
import VueDOMPurifyHTML from 'vue-dompurify-html';

import { searchMap } from '@/helpers/searchMap';

import * as Sentry from '@sentry/vue';
import VueGtag from 'vue-gtag';

import './styles/main.scss';

import mitt from 'mitt';
const emitter = mitt();

// Merged filters (localFilters will override filters below in event of naming collisions)
const allFilters = Object.assign({}, filters, localFilters);

let vueInstance = false;
auth.onAuthStateChanged(async (user) => {
  try {
    // Bind Firebase auth state to the vuex auth state store
    if (user) {
      await store.dispatch('auth/setCurrentUser', user);
    }
  } catch (error) {
    // console.error(error);
  }

  if (window.location.pathname == '/sign-in') {
    // If user come from a link before sign-in, redirect to that link
    const urlParams = new URLSearchParams(window.location.search);
    const nextPage = urlParams.get('nextPage');
    if (nextPage)  {
      router.push(nextPage);
    } else {
      router.push('/');
    }
  }

  // Create the Vue instance, but only once
  if (!vueInstance) {

    // Root instance
    vueInstance = createApp(App)
      .use(router)
      .use(store)
      .use(VueDOMPurifyHTML);

    // Bind global filters before mounting
    vueInstance.config.globalProperties.$filters = allFilters;

    // Bind searchMap config before mounting
    vueInstance.config.globalProperties.$searchMap = searchMap;

    // Bind emitter for global events
    vueInstance.config.globalProperties.emitter = emitter;

    // Initialise Sentry
    if (import.meta.env.PROD) {
      Sentry.init({
        app: vueInstance,
        dsn: 'https://ab99abfef6294bc5b564e635d7b7cb4b@sentry.io/1792541',
        environment: store.getters.appEnvironment.toLowerCase(),
        release: import.meta.env.PACKAGE_VERSION, // made available in vue.config.js
        integrations: [
          new Sentry.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          }),
        ],
      });
    }

    // Config GA
    const gtagId = import.meta.env.VITE_GTAG_ID;
    console.log('gtagId', gtagId);
    if (gtagId) {
      vueInstance.use(VueGtag, {
        pageTrackerScreenviewEnabled: true,
        config: { id: gtagId }, // TODO: change to production ID 'G-5V4B1BS5BB'
      }, router);
    }

    // Root component
    vueInstance.mount('#app');
  }
});
