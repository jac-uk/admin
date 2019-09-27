import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

// Edit views
import ExerciseNew from '@/views/Exercises/New';
import ExerciseEdit from '@/views/Exercises/Edit';
import ExerciseEditContacts from '@/views/Exercises/Edit/Contacts';
import ExerciseEditShortlisting from '@/views/Exercises/Edit/Shortlisting';
import ExerciseEditTimeline from '@/views/Exercises/Edit/Timeline';
import ExerciseEditEligibility from '@/views/Exercises/Edit/Eligibility';
import ExerciseEditVacancy from '@/views/Exercises/Edit/Vacancy';

// Show views
import ExerciseShow from '@/views/Exercises/Show';
import ExerciseShowOverview from '@/views/Exercises/Show/Overview';
import ExerciseShowApplications from '@/views/Exercises/Show/Applications';
import ExerciseShowContacts from '@/views/Exercises/Show/Contacts';
import ExerciseShowTimeline from '@/views/Exercises/Show/Timeline';
import ExerciseShowShortlisting from '@/views/Exercises/Show/Shortlisting';
import ExerciseShowVacancy from '@/views/Exercises/Show/Vacancy';
import ExerciseShowEligibility from '@/views/Exercises/Show/Eligibility';

// Error pages
import ExerciseNotFound from '@/views/Errors/ExerciseNotFound';
import PageNotFound from '@/views/Errors/PageNotFound';

import Dashboard from '@/views/Dashboard';
import SignIn from '@/views/SignIn';

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
      path: '/exercises/new',
      name: 'exercise-new',
      component: ExerciseNew,
      meta: {
        requiresAuth: true,
        title: 'Create An Exercise',
      },
    },
    {
      path: '/exercises/:id',
      component: ExerciseShow,
      children: [
        {
          path: '',
          component: ExerciseShowOverview,
          name: 'exercise-show-overview',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Overview',
          },
        },
        {
          path: 'applications',
          component: ExerciseShowApplications,
          name: 'exercise-show-applications',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Applications',
          },
        },
        {
          path: 'contacts',
          component: ExerciseShowContacts,
          name: 'exercise-show-contacts',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Contacts',
          },
        },
        {
          path: 'timeline',
          component: ExerciseShowTimeline,
          name: 'exercise-show-timeline',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Timeline',
          },
        },
        {
          path: 'shortlisting',
          component: ExerciseShowShortlisting,
          name: 'exercise-show-shortlisting',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Shortlisting',
          },
        },
        {
          path: 'vacancy',
          component: ExerciseShowVacancy,
          name: 'exercise-show-vacancy',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Vacancy information',
          },
        },
        {
          path: 'eligibility',
          component: ExerciseShowEligibility,
          name: 'exercise-show-eligibility',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Eligibility information',
          },
        },
      ],
    },
    {
      path: '/exercises/:id/edit',
      component: ExerciseEdit,
      meta: {
        requiresAuth: true,
        title: 'Edit An Exercise',
      },
      children: [
        {
          path: 'contacts',
          component: ExerciseEditContacts,
          name: 'exercise-edit-contacts',
          meta: {
            requiresAuth: true,
            title: 'Contacts',
          },
        },
        {
          path: 'shortlisting',
          component: ExerciseEditShortlisting,
          name: 'exercise-edit-shortlisting',
          meta: {
            requiresAuth: true,
            title: 'Shortlisting Methods',
          },
        },
        {
          path: 'timeline',
          component: ExerciseEditTimeline,
          name: 'exercise-edit-timeline',
          meta: {
            requiresAuth: true,
            title: 'Timeline',
          },
        },
        {
          path: 'eligibility',
          component: ExerciseEditEligibility,
          name: 'exercise-edit-eligibility',
          meta: {
            requiresAuth: true,
            title: 'Eligibility Information',
          },
        },
        {
          path: 'vacancy',
          component: ExerciseEditVacancy,
          name: 'exercise-edit-vacancy',
          meta: {
            requiresAuth: true,
            title: 'Vacancy Information',
          },
        },
      ],
    },
    {
      path: '/errors/exercise-not-found',
      name: 'exercise-not-found',
      component: ExerciseNotFound,
      meta: {
        requiresAuth: true,
        title: 'Exercise Not Found',
      },
    },
    {
      path: '/errors/page-not-found',
      name: 'page-not-found',
      component: PageNotFound,
      meta: {
        requiresAuth: true,
        title: 'Page Not Found',
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },  
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
