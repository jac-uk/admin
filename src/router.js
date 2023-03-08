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

// Exercise Dashboard
import ExerciseDashboard from '@/views/Exercise/Dashboard/Dashboard';

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
import ExerciseDetailsAdditionalSettings from '@/views/Exercise/Details/AdditionalSettings/View';
import ExerciseDetailsAdditionalSettingsEdit from '@/views/Exercise/Details/AdditionalSettings/Edit';

// Appplications
import ExerciseApplications from '@/views/Exercise/Applications';
import ExerciseApplicationsList from '@/views/Exercise/Applications/List';
import ExerciseApplication from '@/views/Exercise/Applications/Application';

// Exercise reports
import ExerciseReports from '@/views/Exercise/Reports';
import ExerciseReportsDiversity from '@/views/Exercise/Reports/Diversity';
import ExerciseReportsCustom from '@/views/Exercise/Reports/Custom';
import ExerciseReportsOutreach from '@/views/Exercise/Reports/Outreach';
import ExerciseReportsCharacterIssues from '@/views/Exercise/Reports/CharacterIssues';
import ExerciseReportsEligibilityIssues from '@/views/Exercise/Reports/EligibilityIssues';
import ExerciseReportsReasonableAdjustments from '@/views/Exercise/Reports/ReasonableAdjustments';
import ExerciseReportsQualifyingTestReports from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReports';
import ExerciseReportsAgency from '@/views/Exercise/Reports/Agency';
import ExerciseReportsHandover from '@/views/Exercise/Reports/Handover';
import ExerciseReportsStatutoryConsultation from '@/views/Exercise/Reports/StatutoryConsultation';
import QualifyingTestReportCreate from '@/views/Exercise/Reports/QualifyingTestReports/Create';
import QualifyingTestReport from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport';
import QualifyingTestReports from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReports';
import QualifyingTestReportEdit from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport/Edit';
import QualifyingTestReportView from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport/View';
import QualifyingTestReportViewScore from '@/views/Exercise/Reports/QualifyingTestReports/QualifyingTestReport/ViewScore';

// Merit list
import ExerciseReportsMeritList from '@/views/Exercise/Reports/MeritList';

// Exercise tasks
import ExerciseTasks from '@/views/Exercise/Tasks';
// import ExerciseTasksIndex from '@/views/Exercise/Tasks/Index';
import ExerciseTasksIndependentAssessments from '@/views/Exercise/Tasks/IndependentAssessments';
import ExerciseTasksCharacterChecks from '@/views/Exercise/Tasks/CharacterChecks';
// import ExerciseTasksPanels from '@/views/Exercise/Tasks/Panels';
// import ExerciseTasksPanelsNew from '@/views/Exercise/Tasks/PanelsNew';
// import ExerciseTasksPanelsView from '@/views/Exercise/Tasks/PanelsView';
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
import QualifyingTestsCover from '@/views/Exercise/Tasks/QualifyingTests/Cover';

// Exercise task
import ExerciseTask from '@/views/Exercise/Tasks/Task';
import ExerciseTaskLoading from '@/views/Exercise/Tasks/Task/Loading';
import ExerciseTaskNew from '@/views/Exercise/Tasks/Task/New';
import ExerciseTaskDataInitialised from '@/views/Exercise/Tasks/Task/Data/Initialised';
import ExerciseTaskDataActivated from '@/views/Exercise/Tasks/Task/Data/Activated';
import ExerciseTaskTestInitialised from '@/views/Exercise/Tasks/Task/TestInitialised';
import ExerciseTaskTestActivated from '@/views/Exercise/Tasks/Task/TestActivated';
import ExerciseTaskPanelsInitialised from '@/views/Exercise/Tasks/Task/PanelsInitialised';
import ExerciseTaskPanelsActivated from '@/views/Exercise/Tasks/Task/PanelsActivated';
import ExerciseTaskModerationInitialised from '@/views/Exercise/Tasks/Task/ModerationInitialised';
import ExerciseTaskModerationActivated from '@/views/Exercise/Tasks/Task/ModerationActivated';
import ExerciseTaskStatusChanges from '@/views/Exercise/Tasks/Task/StatusChanges';
import ExerciseTaskFinalised from '@/views/Exercise/Tasks/Task/Finalised';
import ExerciseTaskFinalisedList from '@/views/Exercise/Tasks/Task/Finalised/List';
import ExerciseTaskFinalisedViewScore from '@/views/Exercise/Tasks/Task/Finalised/View';
import ExerciseTaskCompleted from '@/views/Exercise/Tasks/Task/Completed';
import ExerciseTaskPanelNew from '@/views/Exercise/Tasks/Task/Panel/New';
import ExerciseTaskPanelView from '@/views/Exercise/Tasks/Task/Panel/View';

// Exercise stages
import ExerciseStages from '@/views/Exercise/Stages';
import ExerciseStagesList from '@/views/Exercise/Stages/List';
import ExerciseStagesEdit from '@/views/Exercise/Stages/Edit';
import ExerciseStagesBack from '@/views/Exercise/Stages/Back';

// Candidates
import Candidates from '@/views/Candidates/Candidates';
import CandidatesList from '@/views/Candidates/CandidatesList';
import CandidatesView from '@/views/Candidates/CandidatesView';
import TargetedOutreachReport from '@/views/Candidates/TargetedOutreachReport';

// Panellists
import Panellists from '@/views/Panellists';
import PanellistsList from '@/views/Panellists/List';
import PanellistsView from '@/views/Panellists/Panellist';

// Error pages
import ExerciseNotFound from '@/views/Errors/ExerciseNotFound';
import PageNotFound from '@/views/Errors/PageNotFound';

import Sandbox from '@/views/Sandbox';

// Users
import Users from '@/views/Users/Users';

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
      path: '/panellists',
      component: Panellists,
      children: [
        {
          path: '',
          component: PanellistsList,
          name: 'panellists-list',
          meta: {
            requiresAuth: true,
            title: 'Panellists',
          },
        },
        {
          path: 'view/:id',
          component: PanellistsView,
          name: 'panellists-view',
          meta: {
            requiresAuth: true,
            title: 'View Panellist',
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
          path: 'dashboard',
          component: ExerciseDashboard,
          name: 'exercise-dashboard',
          meta: {
            requiresAuth: true,
            title: 'Dashboard | Exercise Details',
          },
        },
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
            {
              path: 'additional-settings',
              component: EmptyRouterView,
              children: [
                {
                  name: 'exercise-details-additional-settings',
                  path: '',
                  component: ExerciseDetailsAdditionalSettings,
                  meta: {
                    requiresAuth: true,
                    title: 'Additional Settings | Exercise Details',
                  },
                },
                {
                  name: 'exercise-details-additional-settings-edit',
                  path: 'edit',
                  component: ExerciseDetailsAdditionalSettingsEdit,
                  meta: {
                    requiresAuth: true,
                    title: 'Edit Additional Settings | Exercise Details',
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
          path: 'tasks/:stage',
          component: ExerciseTasks,
          children: [
            // {
            //   path: '',
            //   redirect: 'independent-assessments',
            // },
            {
              path: '',
              redirect: 'qualifying-tests',
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
            // {
            //   path: 'panels/:type',
            //   component: ExerciseTasksPanels,
            //   props: true,
            //   children: [
            //     {
            //       path: '',
            //       component: ExerciseTasksPanelsList,
            //       name: 'exercise-tasks-panels',
            //       meta: {
            //         requiresAuth: true,
            //         title: 'Panels | Exercise Tasks',
            //       },
            //     },
            //     {
            //       path: 'new',
            //       component: ExerciseTasksPanelsNew,
            //       name: 'exercise-tasks-panels-new',
            //       meta: {
            //         requiresAuth: true,
            //         title: 'Create Panel | Exercise Tasks',
            //       },
            //     },
            //     {
            //       path: 'view/:panelId',
            //       component: ExerciseTasksPanelsView,
            //       name: 'exercise-tasks-panels-view',
            //       meta: {
            //         requiresAuth: true,
            //         title: 'Panel | Exercise Tasks',
            //       },
            //     },
            //   ],
            // },
            {
              path: ':type',
              component: ExerciseTask,
              props: true,
              children: [
                {
                  path: '',
                  redirect: 'new',
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
          path: 'stages',
          component: ExerciseStages,
          children: [
            {
              path: '',
              redirect: 'applied',
            },
            {
              path: ':stage',
              component: ExerciseStagesList,
              name: 'exercise-stages-list',
              meta: {
                requiresAuth: true,
                title: 'List | Exercise Stage',
              },
            },
            {
              path: ':stage/edit',
              component: ExerciseStagesEdit,
              name: 'exercise-stages-edit',
              meta: {
                requiresAuth: true,
                title: 'Edit | Exercise Stage',
              },
            },
            {
              path: ':stage/back',
              component: ExerciseStagesBack,
              name: 'exercise-stages-back',
              meta: {
                requiresAuth: true,
                title: 'Move Back | Exercise Stages',
              },
            },
          ],
        },
        {
          path: 'reports',
          component: ExerciseReports,
          children: [
            {
              path: '',
              redirect: 'merit-list',
            },
            {
              path: 'merit-list',
              component: ExerciseReportsMeritList,
              meta: {
                requiresAuth: true,
                title: 'Merit List',
              },
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
              path: 'custom',
              component: ExerciseReportsCustom,
              meta: {
                requiresAuth: true,
                title: 'Custom Report | Exercise Reports',
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
            {
              path: 'statutory-consultation',
              component: ExerciseReportsStatutoryConsultation,
              meta: {
                requiresAuth: true,
                title: 'Statutory Consultation | Exercise Reports',
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
