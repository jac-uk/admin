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

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const isSignedIn = store.getters.isSignedIn;

  if (requiresAuth && !isSignedIn) {
    return next({name: 'sign-in'});
  } 

  return next();
});

export default router;
