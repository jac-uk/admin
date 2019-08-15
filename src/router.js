import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

// Views
import Dashboard from '@/views/Dashboard';
import SignIn from '@/views/SignIn';
import CreateExercise from '@/views/CreateExercise';
import InformationAboutRole from '@/components/NewExercise/InformationAboutRole';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
   {
      path: '*',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        title: 'Dashboard',
      },
    },
    {
      path: '/exercise/new',
      name: 'createExercise',
      component: CreateExercise,
      meta: {
        requiresAuth: true,
        title: 'Create new exercise',
      },
    },
    {
      path: '/exercise/new/information-about-role',
      name: 'informationAboutRole',
      component: InformationAboutRole,
      meta: {
        requiresAuth: true,
        title: 'Information about the role',
      },
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignIn,
      meta: {
        title: 'Sign In',
      },
      beforeEnter: (to, from, next) => {
        const isSignedIn = store.getters.isSignedIn;
        if(isSignedIn) {
          return next({ name: 'dashboard' });
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
    return next({ name: 'sign-in' });
  } 

  return next();
});

// Global after hook to set an appropriate title for the page
router.afterEach((to) => {
  document.title = `${to.meta.title} | Judicial Appointments Commission`;
});

export default router;
