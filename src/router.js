import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

// Views
import AddEligibilityInformation from '@/views/AddEligibilityInformation';
import AddExerciseContacts from '@/views/AddExerciseContacts';
import AddExerciseTimeline from '@/views/AddExerciseTimeline';
import AddShortlistingMethods from '@/views/AddShortlistingMethods';
import CreateAnExercise from '@/views/CreateAnExercise';
import Dashboard from '@/views/Dashboard';
import SignIn from '@/views/SignIn';
import ExerciseDetails from '@/views/ExerciseDetails';
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
          path: 'create-an-exercise',
          component: CreateAnExercise,
          name: 'create-an-exercise',
          meta: {
            requiresAuth: true,
            title: 'Create An Exercise',
          },
        },
        {
          path: 'add-exercise-contacts',
          component: AddExerciseContacts,
          name: 'add-exercise-contacts',
          meta: {
            requiresAuth: true,
            title: 'Add Exercise Contacts',
          },
        },
        {
          path: 'add-shortlisting-methods',
          component: AddShortlistingMethods,
          name: 'add-shortlisting-methods',
          meta: {
            requiresAuth: true,
            title: 'Add Shortlisting Methods',
          },
        },
        {
          path: 'add-exercise-timeline',
          component: AddExerciseTimeline,
          name: 'add-exercise-timeline',
          meta: {
            requiresAuth: true,
            title: 'Add Exercise Timeline',
          },
        },
        {
          path: 'add-eligibility-information',
          component: AddEligibilityInformation,
          name: 'add-eligibility-information',
          meta: {
            requiresAuth: true,
            title: 'Add Eligibility Information',
          },
        },
      ],
    },
    {
      path: '/exercise/details',
      name: 'exerciseDetails',
      component: ExerciseDetails,
      meta: {
        requiresAuth: true,
        title: 'View exercise details',
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
