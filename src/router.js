import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { STATUS } from '@jac-uk/jac-kit/helpers/constants';

import EmptyRouterView from '@/components/EmptyRouterView';

import SignIn from '@/views/SignIn';
import NotificationsList from '@/views/NotificationsList';
import EventsList from '@/views/EventsList';

// Exercises
import CreateExercise from '@/views/CreateExercise';
import Exercises from '@/views/Exercises';
import ExercisesExport from '@/views/ExercisesExport';
import Exercise from '@/views/Exercise';

// Exercise details
import ExerciseDetails from '@/views/Exercise/Details';
import ExerciseDetailsOverview from '@/views/Exercise/Details/Overview';
import ExerciseDetailsEditName from '@/views/Exercise/Details/EditName';
import ExerciseDetailsApplicationContent from '@/views/Exercise/Details/ApplicationContent/View';
import ExerciseDetailsApplicationContentEdit from '@/views/Exercise/Details/ApplicationContent/Edit';
import ExerciseDetailsAssessments from '@/views/Exercise/Details/Assessments/View';
import ExerciseDetailsAssessmentsEdit from '@/views/Exercise/Details/Assessments/Edit';
import ExerciseDetailsContacts from '@/views/Exercise/Details/Contacts/View';
import ExerciseDetailsContactsEdit from '@/views/Exercise/Details/Contacts/Edit';
import ExerciseDetailsDownloads from '@/views/Exercise/Details/Downloads/View';
import ExerciseDetailsDownloadsEdit from '@/views/Exercise/Details/Downloads/Edit';
import ExerciseDetailsEligibility from '@/views/Exercise/Details/Eligibility/View';
import ExerciseDetailsEligibilityEdit from '@/views/Exercise/Details/Eligibility/Edit';
import ExerciseDetailsInvitations from '@/views/Exercise/Details/Invitations/View';
import ExerciseDetailsInvitationsEdit from '@/views/Exercise/Details/Invitations/Edit';
import ExerciseDetailsShortlisting from '@/views/Exercise/Details/Shortlisting/View';
import ExerciseDetailsShortlistingEdit from '@/views/Exercise/Details/Shortlisting/Edit';
import ExerciseDetailsSummary from '@/views/Exercise/Details/Summary/View';
import ExerciseDetailsSummaryEdit from '@/views/Exercise/Details/Summary/Edit';
import ExerciseDetailsTimeline from '@/views/Exercise/Details/Timeline/View';
import ExerciseDetailsTimelineEdit from '@/views/Exercise/Details/Timeline/Edit';
import ExerciseDetailsVacancy from '@/views/Exercise/Details/Vacancy/View';
import ExerciseDetailsVacancyEdit from '@/views/Exercise/Details/Vacancy/Edit';
import ExerciseDetailsPreferences from '@/views/Exercise/Details/Preferences/View';
import ExerciseDetailsPreferencesEdit from '@/views/Exercise/Details/Preferences/Edit';

// Applications
import ExerciseApplications from '@/views/Exercise/Applications';
import ExerciseApplicationsList from '@/views/Exercise/Applications/List';
import ExerciseApplication from '@/views/Exercise/Applications/Application';

// Exercise reports
import ExerciseReports from '@/views/Exercise/Reports';
import ExerciseReportsDiversity from '@/views/Exercise/Reports/Diversity';
import ExerciseReportsOutreach from '@/views/Exercise/Reports/Outreach';
import ExerciseReportsCharacterIssues from '@/views/Exercise/Reports/CharacterIssues';
import ExerciseReportsEligibilityIssues from '@/views/Exercise/Reports/EligibilityIssues';
import ExerciseReportsReasonableAdjustments from '@/views/Exercise/Reports/ReasonableAdjustments';
import ExerciseReportsQualifyingTestReports from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReports';
import ExerciseReportsAgency from '@/views/Exercise/Reports/Agency';
import ExerciseReportsHandover from '@/views/Exercise/Reports/Handover';
import QualifyingTestReportCreate from '@/views/Exercise/Reports/QualifyingTestReports/Create';
import QualifyingTestReport from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport';
import QualifyingTestReportEdit from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport/Edit';
import QualifyingTestReportView from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport/View';
import QualifyingTestReportViewScore from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport/ViewScore';

// Exercise tasks
import ExerciseTasks from '@/views/Exercise/Tasks';
import ExerciseTasksIndependentAssessments from '@/views/Exercise/Tasks/IndependentAssessments';
import ExerciseTasksCharacterChecks from '@/views/Exercise/Tasks/CharacterChecks';
import ExerciseTasksCharacterChecksEdit from '@/views/Exercise/Tasks/CharacterChecksEdit';
import ExerciseTasksPanels from '@/views/Exercise/Tasks/Panels';
import ExerciseTasksPanelsNew from '@/views/Exercise/Tasks/PanelsNew';
import ExerciseTasksPanelsView from '@/views/Exercise/Tasks/PanelsView';
import ExerciseTasksSift from '@/views/Exercise/Tasks/Sift';
import ExerciseTasksSelectionDays from '@/views/Exercise/Tasks/SelectionDays';
import QualifyingTests from '@/views/Exercise/Tasks/QualifyingTests/Cover';
import QualifyingTest from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest';
import QualifyingTestNew from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/New';
import QualifyingTestNewFromClipboard from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/NewFromClipboard';
import QualifyingTestEdit from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/Edit';
import QualifyingTestView from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/View';
import QualifyingTestQuestionBuilder from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/TestBuilder';
import QualifyingTestDryRun from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/DryRun';
import QualifyingTestReview from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/Review';
import QualifyingTestResponses from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/Responses';
import QualifyingTestResponse from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/Response';
import QualifyingTestResponseView from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/Response/View';

// Exercise stages
import ExerciseStages from '@/views/Exercise/Stages';
import ExerciseStagesReviewList from '@/views/Exercise/Stages/ReviewList';
import ExerciseStagesReviewEdit from '@/views/Exercise/Stages/ReviewEdit';
import ExerciseStagesSelectedList from '@/views/Exercise/Stages/SelectedList';
import ExerciseStagesSelectedEdit from '@/views/Exercise/Stages/SelectedEdit';
import ExerciseStagesSelectedBack from '@/views/Exercise/Stages/SelectedBack';
import ExerciseStagesRecommendedList from '@/views/Exercise/Stages/RecommendedList';
import ExerciseStagesRecommendedEdit from '@/views/Exercise/Stages/RecommendedEdit';
import ExerciseStagesRecommendedBack from '@/views/Exercise/Stages/RecommendedBack';
import ExerciseStagesHandoverList from '@/views/Exercise/Stages/HandoverList';
import ExerciseStagesHandoverBack from '@/views/Exercise/Stages/HandoverBack';
import ExerciseStagesShortlistedList from '@/views/Exercise/Stages/ShortlistedList';
import ExerciseStagesShortlistedEdit from '@/views/Exercise/Stages/ShortlistedEdit';
import ExerciseStagesShortlistedBack from '@/views/Exercise/Stages/ShortlistedBack';

// Candidates
import Candidates from '@/views/Candidates/Candidates';
import CandidatesList from '@/views/Candidates/CandidatesList';
import CandidatesView from '@/views/Candidates/CandidatesView';

// Error pages
import ExerciseNotFound from '@/views/Errors/ExerciseNotFound';
import PageNotFound from '@/views/Errors/PageNotFound';

import Sandbox from '@/views/Sandbox';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/exercises',
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: Exercises,
      meta: {
        requiresAuth: true,
        title: 'Exercises',
      },
    },
    {
      path: '/events',
      name: 'events',
      component: EventsList,
      meta: {
        requiresAuth: true,
        title: 'Events',
      },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: NotificationsList,
      meta: {
        requiresAuth: true,
        title: 'Notifications',
      },
    },
    {
      path: '/exercise/export',
      name: 'exercises-export',
      component: ExercisesExport,
      meta: {
        requiresAuth: true,
        title: 'Exercises Export',
      },
    },
    // sandbox component VV
    {
      path: '/sandbox',
      component: Sandbox,
      meta: {
        requiresAuth: true,
        title: 'sandbox',
      },
    },
    // sandbox component ^^
    {
      path: '/candidates',
      component: Candidates,
      children: [
        {
          path: '',
          component: CandidatesList,
          name: 'candidates-list',
          meta: {
            requiresAuth: true,
            title: 'Candidate | List',
          },
        },
        {
          path: ':id',
          component: CandidatesView,
          name: 'candidates-view',
          meta: {
            requiresAuth: true,
            title: 'Candidate | View',
          },
        },
      ],
    },
    {
      path: '/create-exercise',
      component: CreateExercise,
      name: 'create-exercise',
      meta: {
        requiresAuth: true,
        title: 'Create Exercise',
      },
    },
    {
      path: '/exercise/:id',
      component: Exercise,
      children: [
        {
          path: 'details',
          component: ExerciseDetails,
          children: [
            {
              path: '',
              redirect: 'overview',
            },
            {
              name: 'exercise-overview',
              path: 'overview',
              component: ExerciseDetailsOverview,
              meta: {
                requiresAuth: true,
                title: 'Overview | Exercise Details',
              },
            },
            {
              name: 'exercise-edit-name',
              path: 'edit-name',
              component: ExerciseDetailsEditName,
              meta: {
                requiresAuth: true,
                title: 'Edit Name | Exercise Details',
              },
            },
            {
              path: 'assessments',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-assessments',
                  path: '',
                  component: ExerciseDetailsAssessments,
                  meta: {
                    requiresAuth: true,
                    title: 'Assessment Options | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-assessments-edit',
                  path: 'edit',
                  component: ExerciseDetailsAssessmentsEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Assessment Options | Exercise Details',
                  },
                },
              ],
            },
            {
              path: 'contacts',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-contacts',
                  path: '',
                  component: ExerciseDetailsContacts,
                  meta: {
                    requiresAuth: true,
                    title: 'Contacts | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-contacts-edit',
                  path: 'edit',
                  component: ExerciseDetailsContactsEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Contacts | Exercise Details',
                  },
                },
              ],
            },
            {
              path: 'downloads',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-downloads',
                  path: '',
                  component: ExerciseDetailsDownloads,
                  meta: {
                    requiresAuth: true,
                    title: 'Downloads | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-downloads-edit',
                  path: 'edit',
                  component: ExerciseDetailsDownloadsEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Downloads | Exercise Details',
                  },
                },
              ],
            },
            {
              path: 'eligibility',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-eligibility',
                  path: '',
                  component: ExerciseDetailsEligibility,
                  meta: {
                    requiresAuth: true,
                    title: 'Eligibility | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-eligibility-edit',
                  path: 'edit',
                  component: ExerciseDetailsEligibilityEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Eligibility | Exercise Details',
                  },
                },
              ],
            },
            {
              path: 'invitations',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-invitations',
                  path: '',
                  component: ExerciseDetailsInvitations,
                  meta: {
                    requiresAuth: true,
                    title: 'Invitations | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-invitations-edit',
                  path: 'edit',
                  component: ExerciseDetailsInvitationsEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Invitations | Exercise Details',
                  },
                },
              ],
            },
            {
              path: 'shortlisting',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-shortlisting',
                  path: '',
                  component: ExerciseDetailsShortlisting,
                  meta: {
                    requiresAuth: true,
                    title: 'Shortlisting | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-shortlisting-edit',
                  path: 'edit',
                  component: ExerciseDetailsShortlistingEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Shortlisting | Exercise Details',
                  },
                },
              ],
            },
            {
              path: 'summary',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-summary',
                  path: '',
                  component: ExerciseDetailsSummary,
                  meta: {
                    requiresAuth: true,
                    title: 'Summary | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-summary-edit',
                  path: 'edit',
                  component: ExerciseDetailsSummaryEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Summary | Exercise Details',
                  },
                },
              ],
            },
            {
              path: 'timeline',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-timeline',
                  path: '',
                  component: ExerciseDetailsTimeline,
                  meta: {
                    requiresAuth: true,
                    title: 'Timeline | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-timeline-edit',
                  path: 'edit',
                  component: ExerciseDetailsTimelineEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Timeline | Exercise Details',
                  },
                },
              ],
            },
            {
              path: 'vacancy',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-vacancy',
                  path: '',
                  component: ExerciseDetailsVacancy,
                  meta: {
                    requiresAuth: true,
                    title: 'Vacancy Information | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-vacancy-edit',
                  path: 'edit',
                  component: ExerciseDetailsVacancyEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Vacancy Information | Exercise Details',
                  },
                },
              ],
            },
            {
              path: 'preferences',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-preferences',
                  path: '',
                  component: ExerciseDetailsPreferences,
                  meta: {
                    requiresAuth: true,
                    title: 'Preferences | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-preferences-edit',
                  path: 'edit',
                  component: ExerciseDetailsPreferencesEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Preferences | Exercise Details',
                  },
                },
              ],
            },
            {
              path: 'application-content',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-application-content',
                  path: '',
                  component: ExerciseDetailsApplicationContent,
                  meta: {
                    requiresAuth: true,
                    title: 'Application Content | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-application-content-edit',
                  path: 'edit',
                  component: ExerciseDetailsApplicationContentEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Application Content | Exercise Details',
                  },
                },
              ],
            },
          ],
        },
        {
          path: 'applications',
          component: ExerciseApplications,
          children: [
            {
              path: '',
              redirect: STATUS.APPLIED,
            },
            {
              name: `exercise-applications-${STATUS.DRAFT}`,
              path: STATUS.DRAFT,
              component: ExerciseApplicationsList,
              props: {
                status: STATUS.DRAFT,
              },
              meta: {
                requiresAuth: true,
                title: 'Draft | Applications',
              },
            },
            {
              name: `exercise-applications-${STATUS.APPLIED}`,
              path: STATUS.APPLIED,
              component: ExerciseApplicationsList,
              props: {
                status: STATUS.APPLIED,
              },
              meta: {
                requiresAuth: true,
                title: 'Applied | Applications',
              },
            },
            {
              name: `exercise-applications-${STATUS.WITHDRAWN}`,
              path: STATUS.WITHDRAWN,
              component: ExerciseApplicationsList,
              props: {
                status: STATUS.WITHDRAWN,
              },
              meta: {
                requiresAuth: true,
                title: 'Withdrawn | Applications',
              },
            },
            {
              path: 'application/:applicationId',
              // Note this path accepts incoming requests where we just know the applicationId
              // Our `ExerciseApplication` component gets the status
              // and then redirects to the 'exercise-applications-application' route
              // so that the status side navigation works
              component: ExerciseApplication,
              name: 'exercise-application',
              meta: {
                requiresAuth: true,
                title: 'Exercise Application',
              },
            },
            {
              path: ':status/application/:applicationId',
              component: ExerciseApplication,
              name: 'exercise-applications-application',
              meta: {
                requiresAuth: true,
                title: 'Exercise Application',
              },
            },
          ],
        },
        {
          path: 'tasks',
          component: ExerciseTasks,
          children: [
            {
              path: '',
              redirect: 'qualifying-tests',
            },
            {
              path: 'independent-assessments',
              component: ExerciseTasksIndependentAssessments,
              name: 'exercise-tasks-independent-assessments',
              meta: {
                requiresAuth: true,
                title: 'Independent Assessments | Exercise Tasks',
              },
            },
            {
              path: 'character-checks',
              component: ExerciseTasksCharacterChecks,
              name: 'exercise-tasks-character-checks',
              meta: {
                requiresAuth: true,
                title: 'Character Checks | Exercise Tasks',
              },
            },
            {
              path: 'character-checks/edit',
              component: ExerciseTasksCharacterChecksEdit,
              name: 'exercise-tasks-character-checks-edit',
              meta: {
                requiresAuth: true,
                title: 'Edit Character Checks | Exercise Tasks',
              },
            },
            {
              path: 'qualifying-tests',
              component: QualifyingTests,
              props: {
                tieBreakers: false,
              },
              name: 'exercise-tasks-qualifying-tests',
              meta: {
                requiresAuth: true,
                title: 'Qualifying Tests | Exercise Tasks',
              },
            },
            {
              path: 'qualifying-tests/new',
              component: QualifyingTestNew,
              props: {
                isTieBreaker: false,
              },
              name: 'qualifying-test-new',
              meta: {
                requiresAuth: true,
                title: 'Create Qualifying Test | Exercise Tasks',
              },
            },
            {
              path: 'qualifying-tests/new-from-clipboard',
              component: QualifyingTestNewFromClipboard,
              name: 'qualifying-test-new-from-clipboard',
              meta: {
                requiresAuth: true,
                title: 'Create Qualifying Test from Clipboard | Exercise Tasks',
              },
            },
            {
              path: 'qualifying-tests/:qualifyingTestId',
              component: QualifyingTest,
              children: [
                {
                  path: '',
                  component: QualifyingTestView,
                  name: 'qualifying-test-view',
                  meta: {
                    requiresAuth: true,
                    title: 'Qualifying Test | Exercise Tasks',
                  },
                },
                {
                  path: 'edit',
                  component: QualifyingTestEdit,
                  name: 'qualifying-test-edit',
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Qualifying Test | Exercise Tasks',
                  },
                },
                {
                  path: 'build',
                  component: QualifyingTestQuestionBuilder,
                  name: 'qualifying-test-question-builder',
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Questions | Qualifying Test | Exercise Tasks',
                  },
                },
                {
                  path: 'dry-run',
                  component: QualifyingTestDryRun,
                  name: 'qualifying-test-dry-run',
                  meta: {
                    requiresAuth: true,
                    title: 'Dry Run | Qualifying Test | Exercise Tasks',
                  },
                },
                {
                  path: 'review',
                  component: QualifyingTestReview,
                  name: 'qualifying-test-review',
                  meta: {
                    requiresAuth: true,
                    title: 'Review | Qualifying Test | Exercise Tasks',
                  },
                },
                {
                  path: 'responses/:status',
                  component: QualifyingTestResponses,
                  name: 'qualifying-test-responses',
                  meta: {
                    requiresAuth: true,
                    title: 'Responses | Qualifying Test | Exercise Tasks',
                  },
                },
                {
                  path: 'response/:responseId',
                  component: QualifyingTestResponse,
                  children: [
                    {
                      path: '',
                      component: QualifyingTestResponseView,
                      name: 'qualifying-test-response-view',
                      meta: {
                        requiresAuth: true,
                        title: 'Response | Qualifying Test | Exercise Tasks',
                      },
                    },
                  ],
                },
              ],
            },
            {
              path: 'sift',
              component: ExerciseTasksPanels,
              children: [
                {
                  path: '',
                  component: ExerciseTasksSift,
                  name: 'exercise-tasks-sift',
                  meta: {
                    requiresAuth: true,
                    title: 'Sift | Exercise Tasks',
                  },
                },
                {
                  path: 'new',
                  component: ExerciseTasksPanelsNew,
                  name: 'exercise-tasks-sift-new',
                  meta: {
                    requiresAuth: true,
                    title: 'Create Sift Panel | Exercise Tasks',
                    pageName: 'exercise-tasks-sift',
                  },
                },
                {
                  path: 'view/:panelId',
                  component: ExerciseTasksPanelsView,
                  name: 'exercise-tasks-sift-view',
                  meta: {
                    requiresAuth: true,
                    title: 'Sift Panel | Exercise Tasks',
                    pageName: 'exercise-tasks-sift',
                  },
                },
              ],
            },
            {
              path: 'selection',
              component: ExerciseTasksPanels,
              children: [
                {
                  path: '',
                  component: ExerciseTasksSelectionDays,
                  name: 'exercise-tasks-selection',
                  meta: {
                    requiresAuth: true,
                    title: 'Selection | Exercise Tasks',
                  },
                },
                {
                  path: 'new',
                  component: ExerciseTasksPanelsNew,
                  name: 'exercise-tasks-selection-new',
                  meta: {
                    requiresAuth: true,
                    title: 'Create Selection Panel | Exercise Tasks',
                  },
                },
                {
                  path: 'view/:panelId',
                  component: ExerciseTasksPanelsView,
                  name: 'exercise-tasks-selection-view',
                  meta: {
                    requiresAuth: true,
                    title: 'Selection Panel | Exercise Tasks',
                  },
                },
              ],
            },
          ],
        },
        {
          path: 'stages',
          component: ExerciseStages,
          children: [
            {
              path: '',
              redirect: 'review',
            },
            {
              path: 'review',
              component: ExerciseStagesReviewList,
              name: 'exercise-stages-review-list',
              meta: {
                requiresAuth: true,
                title: 'Review | Exercise Stages',
              },
            },
            {
              path: 'review/edit',
              component: ExerciseStagesReviewEdit,
              name: 'exercise-stages-review-edit',
              meta: {
                requiresAuth: true,
                title: 'Edit Review | Exercise Stages',
              },
            },
            {
              path: 'selected',
              component: ExerciseStagesSelectedList,
              name: 'exercise-stages-selected-list',
              meta: {
                requiresAuth: true,
                title: 'Selected | Exercise Stages',
              },
            },
            {
              path: 'selected/edit',
              component: ExerciseStagesSelectedEdit,
              name: 'exercise-stages-selected-edit',
              meta: {
                requiresAuth: true,
                title: 'Edit Selected | Exercise Stages',
              },
            },
            {
              path: 'selected/back',
              component: ExerciseStagesSelectedBack,
              name: 'exercise-stages-selected-back',
              meta: {
                requiresAuth: true,
                title: 'Move Back Selected | Exercise Stages',
              },
            },
            {
              path: 'recommended',
              component: ExerciseStagesRecommendedList,
              name: 'exercise-stages-recommended-list',
              meta: {
                requiresAuth: true,
                title: 'Recommended | Exercise Stages',
              },
            },
            {
              path: 'recommended/edit',
              component: ExerciseStagesRecommendedEdit,
              name: 'exercise-stages-recommended-edit',
              meta: {
                requiresAuth: true,
                title: 'Edit Recommended | Exercise Stages',
              },
            },
            {
              path: 'recommended/back',
              component: ExerciseStagesRecommendedBack,
              name: 'exercise-stages-recommended-back',
              meta: {
                requiresAuth: true,
                title: 'Move Back Recommended | Exercise Stages',
              },
            },
            {
              path: 'handover',
              component: ExerciseStagesHandoverList,
              name: 'exercise-stages-handover-list',
              meta: {
                requiresAuth: true,
                title: 'Handover | Exercise Stages',
              },
            },
            {
              path: 'handover/back',
              component: ExerciseStagesHandoverBack,
              name: 'exercise-stages-handover-back',
              meta: {
                requiresAuth: true,
                title: 'Move Back Handover | Exercise Stages',
              },
            },
            {
              path: 'shortlisted',
              component: ExerciseStagesShortlistedList,
              name: 'exercise-stages-shortlisted-list',
              meta: {
                requiresAuth: true,
                title: 'Shortlisted | Exercise Stages',
              },
            },
            {
              path: 'shortlisted/edit',
              component: ExerciseStagesShortlistedEdit,
              name: 'exercise-stages-shortlisted-edit',
              meta: {
                requiresAuth: true,
                title: 'Edit Shortlisted | Exercise Stages',
              },
            },
            {
              path: 'shortlisted/back',
              component: ExerciseStagesShortlistedBack,
              name: 'exercise-stages-shortlisted-back',
              meta: {
                requiresAuth: true,
                title: 'Move Back Shortlisted | Exercise Stages',
              },
            },
            // {
            //   path: 'equal-merit-tie-breakers',
            //   component: QualifyingTestsCover,
            //   props: {
            //     tieBreakers: true,
            //   },
            //   name: 'exercise-tasks-equal-merit-tie-breakers',
            //   meta: {
            //     requiresAuth: true,
            //     title: 'Equal Merit Tie-Breakers',
            //   },
            // },
            {
              path: 'equal-merit-tie-breakers/new',
              component: QualifyingTestNew,
              props: {
                isTieBreaker: true,
              },
              name: 'equal-merit-tie-breaker-new',
              meta: {
                requiresAuth: true,
                title: 'Equal Merit Tie-Breakers | New',
              },
            },
            {
              path: 'equal-merit-tie-breakers/:qualifyingTestId',
              component: QualifyingTest,
              children: [
                {
                  path: '',
                  component: QualifyingTestView,
                  name: 'equal-merit-tie-breaker-view',
                  meta: {
                    requiresAuth: true,
                    title: 'Equal Merit Tie-Breaker | View',
                  },
                },
                {
                  path: 'edit',
                  component: QualifyingTestEdit,
                  name: 'equal-merit-tie-breaker-edit',
                  meta: {
                    requiresAuth: true,
                    title: 'Equal Merit Tie-Breaker | Edit',
                  },
                },
                {
                  path: 'build',
                  component: QualifyingTestQuestionBuilder,
                  name: 'equal-merit-tie-breaker-question-builder',
                  meta: {
                    requiresAuth: true,
                    title: 'Equal Merit Tie-Breaker | Question Builder',
                  },
                },
                {
                  path: 'dry-run',
                  component: QualifyingTestDryRun,
                  name: 'equal-merit-tie-breaker-dry-run',
                  meta: {
                    requiresAuth: true,
                    title: 'Equal Merit Tie-Breaker | Dry Run',
                  },
                },
                {
                  path: 'review',
                  component: QualifyingTestReview,
                  name: 'equal-merit-tie-breaker-review',
                  meta: {
                    requiresAuth: true,
                    title: 'Equal Merit Tie-Breaker | Review',
                  },
                },
                {
                  path: 'responses/:status',
                  component: QualifyingTestResponses,
                  name: 'equal-merit-tie-breaker-responses',
                  meta: {
                    requiresAuth: true,
                    title: 'Equal Merit Tie-Breaker | Responses',
                  },
                },
                {
                  path: 'response/:responseId',
                  component: QualifyingTestResponse,
                  children: [
                    {
                      path: '',
                      component: QualifyingTestResponseView,
                      name: 'equal-merit-tie-breaker-response-view',
                      meta: {
                        requiresAuth: true,
                        title: 'Equal Merit Tie-Breaker | Response View',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: 'reports',
          component: ExerciseReports,
          children: [
            {
              path: '',
              redirect: 'diversity',
            },
            {
              path: 'diversity',
              component: ExerciseReportsDiversity,
              meta: {
                requiresAuth: true,
                title: 'Diversity | Exercise Reports',
              },
            },
            {
              path: 'outreach',
              component: ExerciseReportsOutreach,
              meta: {
                requiresAuth: true,
                title: 'Outreach | Exercise Reports',
              },
            },
            {
              path: 'character-issues',
              component: ExerciseReportsCharacterIssues,
              meta: {
                requiresAuth: true,
                title: 'Character Issues | Exercise Reports',
              },
            },
            {
              path: 'eligibility-issues',
              component: ExerciseReportsEligibilityIssues,
              meta: {
                requiresAuth: true,
                title: 'Eligibility Issues | Exercise Reports',
              },
            },
            {
              path: 'reasonable-adjustments',
              component: ExerciseReportsReasonableAdjustments,
              meta: {
                requiresAuth: true,
                title: 'Reasonable Adjustments | Exercise Reports',
              },
            },
            {
              path: 'qualifying-test-reports',
              component: EmptyRouterView,
              children: [
                {
                  path: '',
                  component: ExerciseReportsQualifyingTestReports,
                  props: {
                    tieBreakers: false,
                  },
                  meta: {
                    requiresAuth: true,
                    title: 'Qualifying Test Reports | Exercise Reports',
                  },
                },
                {
                  path: 'create',
                  name: 'qualifying-test-report-create',
                  component: QualifyingTestReportCreate,
                  props: {
                    tieBreakers: false,
                  },
                  meta: {
                    requiresAuth: true,
                    title: 'Create Qualifying Test Report | Exercise Reports',
                  },
                },
                {
                  path: ':qualifyingTestReportId',
                  component: QualifyingTestReport,
                  children: [
                    {
                      path: '',
                      component: QualifyingTestReportView,
                      name: 'qualifying-test-report-view',
                      meta: {
                        requiresAuth: true,
                        title: 'Qualifying Test Report | Exercise Reports',
                      },
                    },
                    {
                      path: 'edit',
                      component: QualifyingTestReportEdit,
                      name: 'qualifying-test-report-edit',
                      meta: {
                        requiresAuth: true,
                        title: 'Edit Qualifying Test Report | Exercise Reports',
                      },
                    },
                    {
                      path: ':score',
                      component: QualifyingTestReportViewScore,
                      name: 'qualifying-test-report-view-score',
                      meta: {
                        requiresAuth: true,
                        title: 'Score | Qualifying Test Report | Exercise Reports',
                      },
                    },
                  ],
                },
              ],
            },
            // {
            //   path: 'equal-merit-tie-breaker-reports',
            //   component: QualifyingTestReports,
            //   props: {
            //     tieBreakers: true,
            //   },
            //   name: 'equal-merit-tie-breaker-reports',
            //   meta: {
            //     requiresAuth: true,
            //     title: 'Equal Merit Tie-breaker Reports',
            //   },
            // },
            {
              path: 'equal-merit-tie-breaker-report-create',
              component: QualifyingTestReportCreate,
              props: {
                tieBreakers: true,
              },
              name: 'equal-merit-tie-breaker-report-create',
              meta: {
                requiresAuth: true,
                title: 'Equal Merit Tie-breaker Report | New',
              },
            },
            {
              path: 'equal-merit-tie-breaker-reports/:qualifyingTestReportId',
              component: QualifyingTestReport,
              children: [
                {
                  path: '',
                  component: QualifyingTestReportView,
                  name: 'equal-merit-tie-breaker-report-view',
                  meta: {
                    requiresAuth: true,
                    title: 'Equal Merit Tie-breaker Report | View',
                  },
                },
                {
                  path: 'edit',
                  component: QualifyingTestReportEdit,
                  name: 'equal-merit-tie-breaker-report-edit',
                  meta: {
                    requiresAuth: true,
                    title: 'Equal Merit Tie-breaker Report | Edit',
                  },
                },
                {
                  path: ':score',
                  component: QualifyingTestReportViewScore,
                  name: 'equal-merit-tie-breaker-report-view-score',
                  meta: {
                    requiresAuth: true,
                    title: 'Equal Merit Tie-breaker Report | View Score',
                  },
                },
              ],
            },

            {
              path: 'agency',
              component: ExerciseReportsAgency,
              meta: {
                requiresAuth: true,
                title: 'Agency | Exercise Reports',
              },
            },
            {
              path: 'handover',
              component: ExerciseReportsHandover,
              meta: {
                requiresAuth: true,
                title: 'Handover | Exercise Reports',
              },
            },
          ],
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
        if (isSignedIn) {
          return next({ name: 'exercises' });
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
  document.title = `${to.meta.title} | JAC Digital Platform`;
});

export default router;
