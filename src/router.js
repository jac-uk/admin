import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

// Views
import AboutTheRole from '@/views/AboutTheRole';
import AboutTheSelectionProcess from '@/views/AboutTheSelectionProcess';
import CreateAnExercise from '@/views/CreateAnExercise';
import Dashboard from '@/views/Dashboard';
import Eligibility from '@/views/Eligibility';
import SignIn from '@/views/SignIn';
import ViewExercise from '@/views/ViewExercise';
// form
import CreateExercise from '@/views/CreateExercise';

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
      path: '/exercise/new/',
      component: CreateExercise,
      meta: {
        title: 'Create new exercise',
      },
      children: [
        {
          path: 'eligibility',
          component: Eligibility,
          name: 'eligibility',
          meta: {
            requiresAuth: true,
            title: 'Eligibility',
          },
        },
        {
          path: 'about-the-role',
          component: AboutTheRole,
          name: 'about-the-role',
          meta: {
            requiresAuth: true,
            title: 'About The Role',
          },
        },
        {
          path: 'create-an-exercise',
          component: CreateAnExercise,
          name: 'create-an-exercise',
          meta: {
            requiresAuth: true,
            title: 'Create An Exercise',
          },
        },
        {
          path: 'about-the-selection-process',
          component: AboutTheSelectionProcess,
          name: 'about-the-selection-process',
          meta: {
            requiresAuth: true,
            title: 'About the Selection Process',
          },
        },
      ],
    },
    {
      path: '/exercise/view',
      name: 'viewExercise',
      component: ViewExercise,
      meta: {
        requiresAuth: true,
        title: 'View exercise',
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
