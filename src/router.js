import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

// Views
import Home from './views/Home.vue';
import SignIn from '@/views/SignIn';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
   {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignIn,
      beforeEnter: (to, from, next) => {
        const isSignedIn = store.getters.isSignedIn;
        if(isSignedIn) {
          return next({name: 'home'});
        }

        return next();
      },
    },
  ],
});

// Global before guard to verify if a user can have access to other than sign-in pages.
// It redirects unauthorized users to a sign-in page.
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const isSignedIn = store.getters.isSignedIn;

  if (requiresAuth && !isSignedIn) {
    return next({name: 'sign-in'});
  } 

  return next();
});

export default router;
