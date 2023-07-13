import {
  createWebHistory,
  createRouter
} from 'vue-router';

import store from '@/store';

import { STATUS } from '@jac-uk/jac-kit/helpers/constants';

import EmptyRouterView from '@/components/EmptyRouterView.vue';

import SignIn from '@/views/SignIn.vue';
import NotificationsList from '@/views/NotificationsList.vue';
import EventsList from '@/views/EventsList.vue';

// Exercises
import CreateExercise from '@/views/CreateExercise.vue';
import Exercises from '@/views/Exercises.vue';
import ExercisesExport from '@/views/ExercisesExport.vue';
import Exercise from '@/views/Exercise.vue';

// Exercise Dashboard
import ExerciseDashboard from '@/views/Exercise/Dashboard/Dashboard.vue';

// Exercise details
import ExerciseDetails from '@/views/Exercise/Details.vue';
import ExerciseDetailsOverview from '@/views/Exercise/Details/Overview.vue';
import ExerciseDetailsEditName from '@/views/Exercise/Details/EditName.vue';
import ExerciseDetailsApplicationContent from '@/views/Exercise/Details/ApplicationContent/View.vue';
import ExerciseDetailsApplicationContentEdit from '@/views/Exercise/Details/ApplicationContent/Edit.vue';
import ExerciseDetailsAssessments from '@/views/Exercise/Details/Assessments/View.vue';
import ExerciseDetailsAssessmentsEdit from '@/views/Exercise/Details/Assessments/Edit.vue';
import ExerciseDetailsContacts from '@/views/Exercise/Details/Contacts/View.vue';
import ExerciseDetailsContactsEdit from '@/views/Exercise/Details/Contacts/Edit.vue';
import ExerciseDetailsDownloads from '@/views/Exercise/Details/Downloads/View.vue';
import ExerciseDetailsDownloadsEdit from '@/views/Exercise/Details/Downloads/Edit.vue';
import ExerciseDetailsEligibility from '@/views/Exercise/Details/Eligibility/View.vue';
import ExerciseDetailsEligibilityEdit from '@/views/Exercise/Details/Eligibility/Edit.vue';
import ExerciseDetailsInvitations from '@/views/Exercise/Details/Invitations/View.vue';
import ExerciseDetailsInvitationsEdit from '@/views/Exercise/Details/Invitations/Edit.vue';
import ExerciseDetailsShortlisting from '@/views/Exercise/Details/Shortlisting/View.vue';
import ExerciseDetailsShortlistingEdit from '@/views/Exercise/Details/Shortlisting/Edit.vue';
import ExerciseDetailsSummary from '@/views/Exercise/Details/Summary/View.vue';
import ExerciseDetailsSummaryEdit from '@/views/Exercise/Details/Summary/Edit.vue';
import ExerciseDetailsTimeline from '@/views/Exercise/Details/Timeline/View.vue';
import ExerciseDetailsTimelineEdit from '@/views/Exercise/Details/Timeline/Edit.vue';
import ExerciseDetailsVacancy from '@/views/Exercise/Details/Vacancy/View.vue';
import ExerciseDetailsVacancyEdit from '@/views/Exercise/Details/Vacancy/Edit.vue';
import ExerciseDetailsPreferences from '@/views/Exercise/Details/Preferences/View.vue';
import ExerciseDetailsPreferencesEdit from '@/views/Exercise/Details/Preferences/Edit.vue';

// Appplications
import ExerciseApplications from '@/views/Exercise/Applications.vue';
import ExerciseApplicationsList from '@/views/Exercise/Applications/List.vue';
import ExerciseApplication from '@/views/Exercise/Applications/Application.vue';

// Exercise reports
import ExerciseReports from '@/views/Exercise/Reports.vue';
import ExerciseReportsDiversity from '@/views/Exercise/Reports/Diversity.vue';
import ExerciseReportsCustom from '@/views/Exercise/Reports/Custom.vue';
import ExerciseReportsOutreach from '@/views/Exercise/Reports/Outreach.vue';
import ExerciseReportsCharacterIssues from '@/views/Exercise/Reports/CharacterIssues.vue';
import ExerciseReportsEligibilityIssues from '@/views/Exercise/Reports/EligibilityIssues.vue';
import ExerciseReportsReasonableAdjustments from '@/views/Exercise/Reports/ReasonableAdjustments.vue';
import ExerciseReportsQualifyingTestReports from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReports.vue';
import ExerciseReportsAgency from '@/views/Exercise/Reports/Agency.vue';
import ExerciseReportsHandover from '@/views/Exercise/Reports/Handover.vue';
import ExerciseReportsStatutoryConsultation from '@/views/Exercise/Reports/StatutoryConsultation.vue';
import QualifyingTestReportCreate from '@/views/Exercise/Reports/QualifyingTestReports/Create.vue';
import QualifyingTestReport from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport.vue';
import QualifyingTestReports from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReports.vue';
import QualifyingTestReportEdit from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport/Edit.vue';
import QualifyingTestReportView from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport/View.vue';
import QualifyingTestReportViewScore from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport/ViewScore.vue';
import ExerciseReportsPanels from '@/views/Exercise/Reports/Panels.vue';
import ExerciseReportsPanelsNew from '@/views/Exercise/Reports/PanelsNew.vue';
import ExerciseReportsPanelsView from '@/views/Exercise/Reports/PanelsView.vue';
import ExerciseReportsSift from '@/views/Exercise/Reports/Sift.vue';
import ExerciseReportsSelectionDays from '@/views/Exercise/Reports/SelectionDays.vue';
import ExerciseReportsScenario from '@/views/Exercise/Reports/Scenario.vue';

// Merit list
import ExerciseReportsMeritList from '@/views/Exercise/Reports/MeritList.vue';

// Exercise tasks
import ExerciseTasks from '@/views/Exercise/Tasks.vue';
// import ExerciseTasksIndex from '@/views/Exercise/Tasks/Index.vue';
import ExerciseTasksIndependentAssessments from '@/views/Exercise/Tasks/IndependentAssessments.vue';
import ExerciseTasksCharacterChecks from '@/views/Exercise/Tasks/CharacterChecks.vue';
//import ExerciseTasksCharacterChecksEdit from '@/views/Exercise/Tasks/CharacterChecksEdit.vue';
import QualifyingTests from '@/views/Exercise/Tasks/QualifyingTests/Cover.vue';
import QualifyingTest from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest.vue';
import QualifyingTestNew from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/New.vue';
import QualifyingTestNewFromClipboard from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/NewFromClipboard.vue';
import QualifyingTestEdit from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/Edit.vue';
import QualifyingTestView from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/View.vue';
import QualifyingTestQuestionBuilder from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/TestBuilder.vue';
import QualifyingTestDryRun from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/DryRun.vue';
import QualifyingTestReview from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/Review.vue';
import QualifyingTestResponses from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/Responses.vue';
import QualifyingTestResponse from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/Response.vue';
import QualifyingTestResponseView from '@/views/Exercise/Tasks/QualifyingTests/QualifyingTest/Response/View.vue';
import QualifyingTestsCover from '@/views/Exercise/Tasks/QualifyingTests/Cover.vue';
// Exercise task
import ExerciseTask from '@/views/Exercise/Tasks/Task.vue';
import ExerciseTaskLoading from '@/views/Exercise/Tasks/Task/Loading.vue';
import ExerciseTaskNew from '@/views/Exercise/Tasks/Task/New.vue';
import ExerciseTaskDataInitialised from '@/views/Exercise/Tasks/Task/Data/Initialised.vue';
import ExerciseTaskDataActivated from '@/views/Exercise/Tasks/Task/Data/Activated.vue';
import ExerciseTaskTestInitialised from '@/views/Exercise/Tasks/Task/TestInitialised.vue';
import ExerciseTaskTestActivated from '@/views/Exercise/Tasks/Task/TestActivated.vue';
import ExerciseTaskPanelsInitialised from '@/views/Exercise/Tasks/Task/PanelsInitialised.vue';
import ExerciseTaskPanelsActivated from '@/views/Exercise/Tasks/Task/PanelsActivated.vue';
import ExerciseTaskModerationInitialised from '@/views/Exercise/Tasks/Task/ModerationInitialised.vue';
import ExerciseTaskModerationActivated from '@/views/Exercise/Tasks/Task/ModerationActivated.vue';
import ExerciseTaskStatusChanges from '@/views/Exercise/Tasks/Task/StatusChanges.vue';
import ExerciseTaskFinalised from '@/views/Exercise/Tasks/Task/Finalised.vue';
import ExerciseTaskFinalisedList from '@/views/Exercise/Tasks/Task/Finalised/List.vue';
import ExerciseTaskFinalisedViewScore from '@/views/Exercise/Tasks/Task/Finalised/View.vue';
import ExerciseTaskCompleted from '@/views/Exercise/Tasks/Task/Completed.vue';
import ExerciseTaskPanelNew from '@/views/Exercise/Tasks/Task/Panel/New.vue';
import ExerciseTaskPanelView from '@/views/Exercise/Tasks/Task/Panel/View.vue';

// Exercise stages
import ExerciseStages from '@/views/Exercise/Stages.vue';
import ExerciseStagesReviewList from '@/views/Exercise/Stages/ReviewList.vue';
import ExerciseStagesReviewEdit from '@/views/Exercise/Stages/ReviewEdit.vue';
import ExerciseStagesSelectedList from '@/views/Exercise/Stages/SelectedList.vue';
import ExerciseStagesSelectedEdit from '@/views/Exercise/Stages/SelectedEdit.vue';
import ExerciseStagesSelectedBack from '@/views/Exercise/Stages/SelectedBack.vue';
import ExerciseStagesRecommendedList from '@/views/Exercise/Stages/RecommendedList.vue';
import ExerciseStagesRecommendedEdit from '@/views/Exercise/Stages/RecommendedEdit.vue';
import ExerciseStagesRecommendedBack from '@/views/Exercise/Stages/RecommendedBack.vue';
import ExerciseStagesHandoverList from '@/views/Exercise/Stages/HandoverList.vue';
import ExerciseStagesHandoverBack from '@/views/Exercise/Stages/HandoverBack.vue';
import ExerciseStagesShortlistedList from '@/views/Exercise/Stages/ShortlistedList.vue';
import ExerciseStagesShortlistedEdit from '@/views/Exercise/Stages/ShortlistedEdit.vue';
import ExerciseStagesShortlistedBack from '@/views/Exercise/Stages/ShortlistedBack.vue';

// Candidates
import Candidates from '@/views/Candidates/Candidates.vue';
import CandidatesList from '@/views/Candidates/CandidatesList.vue';
import CandidatesView from '@/views/Candidates/CandidatesView.vue';
import TargetedOutreachReport from '@/views/Candidates/TargetedOutreachReport.vue';

// Error pages
import ExerciseNotFound from '@/views/Errors/ExerciseNotFound.vue';
import PageNotFound from '@/views/Errors/PageNotFound.vue';

import Sandbox from '@/views/Sandbox.vue';

// Users
import Users from '@/views/Users/Users.vue';

const routes = [
  {
    path: '/:pathMatch(.*)*',
    //redirect: '/exercises',
    redirect: { name: 'exercises' },
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
    path: '/users',
    name: 'users',
    component: Users,
    meta: {
      requiresAuth: true,
      title: 'Users',
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
    path: '/candidates/',
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
      {
        path: 'reports/targeted-outreach-report',
        component: TargetedOutreachReport,
        name: 'targeted-outreach-report',
        meta: {
          requiresAuth: true,
          title: 'Candidates | Targeted Outreach Report',
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
    path: '/exercise/:id/',
    component: Exercise,
    children: [
      {
        path: 'dashboard',
        component: ExerciseDashboard,
        name: 'exercise-dashboard',
        meta: {
          requiresAuth: true,
          title: 'Dashboard | Exercise Details',
        },
      },
      {
        path: 'details/',
        component: ExerciseDetails,
        children: [
          {
            path: '',
            redirect: { name: 'exercise-overview' },
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
            path: 'assessments/',
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
            path: 'contacts/',
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
            path: 'downloads/',
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
            path: 'eligibility/',
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
            path: 'invitations/',
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
            path: 'shortlisting/',
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
            path: 'summary/',
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
            path: 'timeline/',
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
            path: 'vacancy/',
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
            path: 'preferences/',
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
            path: 'application-content/',
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
        path: 'applications/',
        component: ExerciseApplications,
        children: [
          {
            path: '',
            //redirect: STATUS.APPLIED,
            redirect: { name: `exercise-applications-${STATUS.APPLIED}` },
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
        path: 'tasks/',
        component: ExerciseTasks,
        children: [
          {
            path: '',
            //redirect: 'qualifying-tests',
            redirect: { name: 'exercise-tasks-qualifying-tests' },
            // component: ExerciseTasksIndex,
            // meta: {
            //   requiresAuth: true,
            //   title: 'Exercise Tasks',
            // },
          },
          {
            path: 'equal-merit-tie-breakers',
            component: QualifyingTestsCover,
            props: {
              tieBreakers: true,
            },
            name: 'exercise-tasks-equal-merit-tie-breakers',
            meta: {
              requiresAuth: true,
              title: 'Equal Merit Tie-Breakers',
            },
          },
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
            path: 'equal-merit-tie-breakers/:qualifyingTestId/',
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
                path: 'response/:responseId/',
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
            path: 'qualifying-tests/:qualifyingTestId/',
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
                path: 'response/:responseId/',
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
            path: ':type',
            component: ExerciseTask,
            props: true,
            children: [
              {
                path: '',
                //redirect: 'new',
                redirect: { name: 'exercise-task-new' },
              },
              {
                path: 'loading',
                component: ExerciseTaskLoading,
                name: 'exercise-task-loading',
                meta: {
                  requiresAuth: true,
                  title: 'Loading | Exercise task',
                },
              },
              {
                path: 'new',
                component: ExerciseTaskNew,
                name: 'exercise-task-new',
                meta: {
                  requiresAuth: true,
                  title: 'New | Exercise task',
                },
              },
              {
                path: 'data-initialised',
                component: ExerciseTaskDataInitialised,
                name: 'exercise-task-dataInitialised',
                meta: {
                  requiresAuth: true,
                  title: 'Data Initialised | Exercise task',
                },
              },
              {
                path: 'data-activated',
                component: ExerciseTaskDataActivated,
                name: 'exercise-task-dataActivated',
                meta: {
                  requiresAuth: true,
                  title: 'Data Activated | Exercise task',
                },
              },
              {
                path: 'test-initialised',
                component: ExerciseTaskTestInitialised,
                name: 'exercise-task-testInitialised',
                meta: {
                  requiresAuth: true,
                  title: 'Test Initialised | Exercise task',
                },
              },
              {
                path: 'test-activated',
                component: ExerciseTaskTestActivated,
                name: 'exercise-task-testActivated',
                meta: {
                  requiresAuth: true,
                  title: 'Test Activated | Exercise task',
                },
              },
              {
                path: 'panels-initialised',
                component: ExerciseTaskPanelsInitialised,
                name: 'exercise-task-panelsInitialised',
                meta: {
                  requiresAuth: true,
                  title: 'Panels Initialised | Exercise task',
                },
              },
              {
                path: 'panels-activated',
                component: ExerciseTaskPanelsActivated,
                name: 'exercise-task-panelsActivated',
                meta: {
                  requiresAuth: true,
                  title: 'Panels Activated | Exercise task',
                },
              },
              {
                path: 'moderation-initialised',
                component: ExerciseTaskModerationInitialised,
                name: 'exercise-task-moderationInitialised',
                meta: {
                  requiresAuth: true,
                  title: 'Moderation Initialised | Exercise task',
                },
              },
              {
                path: 'moderation-activated',
                component: ExerciseTaskModerationActivated,
                name: 'exercise-task-moderationActivated',
                meta: {
                  requiresAuth: true,
                  title: 'Moderation Activated | Exercise task',
                },
              },
              {
                path: 'status-changes',
                component: ExerciseTaskStatusChanges,
                name: 'exercise-task-statusChanges',
                meta: {
                  requiresAuth: true,
                  title: 'Status Changes | Exercise task',
                },
              },
              {
                path: 'finalised',
                component: ExerciseTaskFinalised,
                children: [
                  {
                    path: '',
                    name: 'exercise-task-finalised',
                    component: ExerciseTaskFinalisedList,
                    meta: {
                      requiresAuth: true,
                      title: 'Finalised | Exercise task',
                    },
                  },
                  {
                    path: ':score',
                    component: ExerciseTaskFinalisedViewScore,
                    name: 'exercise-task-finalised-score',
                    meta: {
                      requiresAuth: true,
                      title: 'ViewScore | Finalised | Exercise task',
                    },
                  },
                ],
              },
              {
                path: 'completed',
                component: ExerciseTaskCompleted,
                name: 'exercise-task-completed',
                meta: {
                  requiresAuth: true,
                  title: 'Completed | Exercise task',
                },
              },
              {
                path: 'panel/new',
                component: ExerciseTaskPanelNew,
                name: 'exercise-task-panel-new',
                meta: {
                  requiresAuth: true,
                  title: 'Create Panel | Exercise Task',
                },
              },
              {
                path: 'panel/:panelId',
                component: ExerciseTaskPanelView,
                name: 'exercise-task-panel',
                meta: {
                  requiresAuth: true,
                  title: 'Panel | Exercise Task',
                },
              },
            ],
          },
        ],
      },
      {
        path: 'stages/',
        component: ExerciseStages,
        children: [
          {
            path: '',
            //redirect: 'review',
            redirect: { name: 'exercise-stages-review-list' },
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
        ],
      },
      {
        path: 'reports/',
        component: ExerciseReports,
        children: [
          {
            path: '',
            //redirect: 'diversity',
            redirect: { name: 'exercise-reports-diversity' },
          },
          {
            name: 'exercise-reports-diversity',
            path: 'diversity',
            component: ExerciseReportsDiversity,
            meta: {
              requiresAuth: true,
              title: 'Diversity | Exercise Reports',
            },
          },
          {
            name: 'custom',
            path: 'custom',
            component: ExerciseReportsCustom,
            meta: {
              requiresAuth: true,
              title: 'Custom Report | Exercise Reports',
            },
          },
          {
            name: 'outreach',
            path: 'outreach',
            component: ExerciseReportsOutreach,
            meta: {
              requiresAuth: true,
              title: 'Outreach | Exercise Reports',
            },
          },
          {
            name: 'character-issues',
            path: 'character-issues',
            component: ExerciseReportsCharacterIssues,
            meta: {
              requiresAuth: true,
              title: 'Character Issues | Exercise Reports',
            },
          },
          {
            name: 'eligibility-issues',
            path: 'eligibility-issues',
            component: ExerciseReportsEligibilityIssues,
            meta: {
              requiresAuth: true,
              title: 'Eligibility Issues | Exercise Reports',
            },
          },
          {
            name: 'reasonable-adjustments',
            path: 'reasonable-adjustments',
            component: ExerciseReportsReasonableAdjustments,
            meta: {
              requiresAuth: true,
              title: 'Reasonable Adjustments | Exercise Reports',
            },
          },
          {
            path: 'qualifying-test-reports/',
            component: EmptyRouterView,
            children: [
              {
                path: '',
                name: 'qualifying-test-reports',
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
                path: ':qualifyingTestReportId/',
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
          {
            path: 'equal-merit-tie-breaker-reports',
            component: QualifyingTestReports,
            props: {
              tieBreakers: true,
            },
            name: 'equal-merit-tie-breaker-reports',
            meta: {
              requiresAuth: true,
              title: 'Equal Merit Tie-breaker Reports',
            },
          },
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
            path: 'equal-merit-tie-breaker-reports/:qualifyingTestReportId/',
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
            name: 'agency',
            path: 'agency',
            component: ExerciseReportsAgency,
            meta: {
              requiresAuth: true,
              title: 'Agency | Exercise Reports',
            },
          },
          {
            name: 'handover',
            path: 'handover',
            component: ExerciseReportsHandover,
            meta: {
              requiresAuth: true,
              title: 'Handover | Exercise Reports',
            },
          },
          {
            name: 'statutory-consultation',
            path: 'statutory-consultation',
            component: ExerciseReportsStatutoryConsultation,
            meta: {
              requiresAuth: true,
              title: 'Statutory Consultation | Exercise Reports',
            },
          },
          {
            path: 'merit-list',
            name: 'merit-list',
            component: ExerciseReportsMeritList,
            meta: {
              requiresAuth: true,
              title: 'Merit List | Exercise Reports',
            },
          },
          {
            path: 'sift',
            name: 'sift',
            component: ExerciseReportsPanels,
            children: [
              {
                path: '',
                component: ExerciseReportsSift,
                name: 'exercise-reports-sift',
                meta: {
                  requiresAuth: true,
                  title: 'Sift | Exercise Reports',
                },
              },
              {
                path: 'new',
                component: ExerciseReportsPanelsNew,
                name: 'exercise-reports-sift-new',
                meta: {
                  requiresAuth: true,
                  title: 'Create Sift Panel | Exercise Reports',
                  pageName: 'exercise-reports-sift',
                },
              },
              {
                path: 'view/:panelId',
                component: ExerciseReportsPanelsView,
                name: 'exercise-reports-sift-view',
                meta: {
                  requiresAuth: true,
                  title: 'Sift Panel | Exercise Reports',
                  pageName: 'exercise-reports-sift',
                },
              },
            ],
          },
          {
            path: 'selection',
            name: 'selection',
            component: ExerciseReportsPanels,
            children: [
              {
                path: '',
                component: ExerciseReportsSelectionDays,
                name: 'exercise-reports-selection',
                meta: {
                  requiresAuth: true,
                  title: 'Selection | Exercise Reports',
                },
              },
              {
                path: 'new',
                component: ExerciseReportsPanelsNew,
                name: 'exercise-reports-selection-new',
                meta: {
                  requiresAuth: true,
                  title: 'Create Selection Panel | Exercise Reports',
                },
              },
              {
                path: 'view/:panelId',
                component: ExerciseReportsPanelsView,
                name: 'exercise-reports-selection-view',
                meta: {
                  requiresAuth: true,
                  title: 'Selection Panel | Exercise Reports',
                },
              },
            ],
          },
          {
            path: 'scenario',
            name: 'scenario',
            component: ExerciseReportsPanels,
            children: [
              {
                path: '',
                component: ExerciseReportsScenario,
                name: 'exercise-reports-scenario',
                meta: {
                  requiresAuth: true,
                  title: 'Scenario Responses | Exercise Reports',
                },
              },
              {
                path: 'new',
                component: ExerciseReportsPanelsNew,
                name: 'exercise-reports-scenario-new',
                meta: {
                  requiresAuth: true,
                  title: 'Create Scenario Response Panel | Exercise Reports',
                },
              },
              {
                path: 'view/:panelId',
                component: ExerciseReportsPanelsView,
                name: 'exercise-reports-scenario-view',
                meta: {
                  requiresAuth: true,
                  title: 'Scenario Response Panel | Exercise Reports',
                },
              },
            ],
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
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
