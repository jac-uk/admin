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
import ExerciseEditSummary from '@/views/Exercises/Edit/Summary';
import ExerciseEditVacancy from '@/views/Exercises/Edit/Vacancy';
import ExerciseEditName from '@/views/Exercises/Edit/EditName';
import ExerciseEditAssessmentOptions from '@/views/Exercises/Edit/AssessmentOptions';
import ExerciseEditWorkingPreferences from '@/views/Exercises/Edit/WorkingPreferences';
import ExerciseEditDownloads from '@/views/Exercises/Edit/Downloads';

// Show views
import ExerciseShow from '@/views/Exercises/Show';
import ExerciseShowOverview from '@/views/Exercises/Show/Overview';
import ExerciseShowContacts from '@/views/Exercises/Show/Contacts';
import ExerciseShowTimeline from '@/views/Exercises/Show/Timeline';
import ExerciseShowShortlisting from '@/views/Exercises/Show/Shortlisting';
import ExerciseShowSummary from '@/views/Exercises/Show/Summary';
import ExerciseShowVacancy from '@/views/Exercises/Show/Vacancy';
import ExerciseShowEligibility from '@/views/Exercises/Show/Eligibility';
import ExerciseShowWorkingPreferences from '@/views/Exercises/Show/WorkingPreferences';
import ExerciseShowIndependentAssessments from '@/views/Exercises/Show/IndependentAssessments';
import ExerciseShowAssessmentOptions from '@/views/Exercises/Show/AssessmentOptions';
import ExerciseShowDownloads from '@/views/Exercises/Show/Downloads';
import ExerciseShowReports from '@/views/Exercises/Show/Reports';
import ExerciseShowApplications from '@/views/Exercises/Show/Applications';
import ExerciseShowApplication from '@/views/Exercises/Show/Application';

// Report views
import ExerciseReports from '@/views/Exercises/Reports';
import ExerciseReportsCharacterIssues from '@/views/Exercises/Reports/CharacterIssues';
import ExerciseReportsCharacterChecks from '@/views/Exercises/Reports/CharacterChecks';
import ExerciseReportsDiversityDashboard from '@/views/Exercises/Reports/DiversityDashboard';
import ExerciseReportsEligibilityIssues from '@/views/Exercises/Reports/EligibilityIssues';
import ExerciseReportsEducationAndCareerHistory from '@/views/Exercises/Reports/EducationAndCareerHistory';
import ExerciseReportsJOHandoverReport from '@/views/Exercises/Reports/JOHandoverReport';
import ExerciseReportsStatutoryConsultationTable from '@/views/Exercises/Reports/StatutoryConsultationTable';
import ExerciseReportsReasonableAdjustments from '@/views/Exercises/Reports/ReasonableAdjustments';

// Error pages
import ExerciseNotFound from '@/views/Errors/ExerciseNotFound';
import PageNotFound from '@/views/Errors/PageNotFound';

import ApplicationsFull from '@/views/Exercises/ApplicationsFull';
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
          path: 'application/:applicationId',
          component: ExerciseShowApplication,
          name: 'exercise-show-application',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Application',
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
          path: 'summary',
          component: ExerciseShowSummary,
          name: 'exercise-show-summary',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Vacancy summary',
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
        {
          path: 'independent-assessments',
          component: ExerciseShowIndependentAssessments,
          name: 'exercise-show-independent-assessments',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Independent Assessments',
          },
        },
        {
          path: 'working-preferences',
          component: ExerciseShowWorkingPreferences,
          name: 'exercise-show-working-preferences',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Working Preferences',
          },
        },
        {
          path: 'assessment-options',
          component: ExerciseShowAssessmentOptions,
          name: 'exercise-show-assessment-options',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Assessment Options',
          },
        },
        {
          path: 'downloads',
          component: ExerciseShowDownloads,
          name: 'exercise-show-downloads',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Downloads',
          },
        },
        {
          path: 'reports',
          component: ExerciseShowReports,
          name: 'exercise-show-reports',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Reports',
          },
        },
      ],
    },
    {
      path: 'applications-full',
      component: ApplicationsFull,
      name: 'exercise-applications-full',
      meta: {
        requiresAuth: true,
        title: 'Exercise Details | Applications Full',
      },
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
          path: 'name',
          component: ExerciseEditName,
          name: 'exercise-edit-name',
          meta: {
            requiresAuth: true,
            title: 'Update exercise name',
          },
        },
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
          path: 'summary',
          component: ExerciseEditSummary,
          name: 'exercise-edit-summary',
          meta: {
            requiresAuth: true,
            title: 'Vacancy Summary',
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
        {
          path: 'assessment-options',
          component: ExerciseEditAssessmentOptions,
          name: 'exercise-edit-assessment-options',
          meta: {
            requiresAuth: true,
            title: 'Assessment Options',
          },
        },
        {
          path: 'working-preferences',
          component: ExerciseEditWorkingPreferences,
          name: 'exercise-edit-working-preferences',
          meta: {
            requiresAuth: true,
            title: 'Working Preferences',
          },
        },
        {
          path: 'downloads',
          component: ExerciseEditDownloads,
          name: 'exercise-edit-downloads',
          meta: {
            requiresAuth: true,
            title: 'Downloads',
          },
        },
      ],
    },
    {
      path: '/exercises/:id/report-directory',
      component: ExerciseReports,
      meta: {
        requiresAuth: true,
        title: 'View exercise reports ',
      },
      children: [
        {
          path: 'character-issues',
          component: ExerciseReportsCharacterIssues,
          name: 'exercise-reports-character-issues',
          meta: {
            requiresAuth: true,
            title: 'Character Issues',
          },
        },
        {
          path: 'character-checks',
          component: ExerciseReportsCharacterChecks,
          name: 'exercise-reports-character-checks',
          meta: {
            requiresAuth: true,
            title: 'Character Checks',
          },
        },
        {
          path: 'diversity-dashboard',
          component: ExerciseReportsDiversityDashboard,
          name: 'exercise-reports-diversity-dashboard',
          meta: {
            requiresAuth: true,
            title: 'Diversity Dashboard',
          },
        },
        {
          path: 'eligibility-issues',
          component: ExerciseReportsEligibilityIssues,
          name: 'exercise-reports-eligibility-issues',
          meta: {
            requiresAuth: true,
            title: 'Eligibility Issues',
          },
        },
        {
          path: 'education-and-career-history',
          component: ExerciseReportsEducationAndCareerHistory,
          name: 'exercise-reports-education-and-career-history',
          meta: {
            requiresAuth: true,
            title: 'Education and Career History',
          },
        },
        {
          path: 'jo-handover-report',
          component: ExerciseReportsJOHandoverReport,
          name: 'exercise-reports-jo-handover-report',
          meta: {
            requiresAuth: true,
            title: 'JO Handover Report',
          },
        },
        {
          path: 'statutory-consultation-table',
          component: ExerciseReportsStatutoryConsultationTable,
          name: 'exercise-reports-statutory-consultation-table',
          meta: {
            requiresAuth: true,
            title: 'Statutory Consultation Table',
          },
        },
        {
          path: 'reasonable-adjustments',
          component: ExerciseReportsReasonableAdjustments,
          name: 'exercise-reports-reasonable-adjustments',
          meta: {
            requiresAuth: true,
            title: 'Reasonable Adjustments',
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
        const isSignedIn = store.getters['auth/isSignedIn'];
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
  const isSignedIn = store.getters['auth/isSignedIn'];

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
