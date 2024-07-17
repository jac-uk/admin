import {
  createWebHistory,
  createRouter
} from 'vue-router';

import store from '@/store';

import { STATUS, EXERCISE_STAGE } from '@/helpers/constants';

import EmptyRouterView from '@/components/EmptyRouterView.vue';

import SignIn from '@/views/SignIn.vue';
import NotificationsList from '@/views/NotificationsList.vue';
import EventsList from '@/views/EventsList.vue';

// Exercises
import CreateExercise from '@/views/CreateExercise.vue';
import Exercises from '@/views/Exercises.vue';
import ExercisesExport from '@/views/ExercisesExport.vue';
import ExercisesProgrammeView from '@/views/ExercisesProgrammeView.vue';
import Exercise from '@/views/Exercise.vue';

// Exercise Dashboard
import ExerciseDashboard from '@/views/Exercise/Dashboard/Dashboard.vue';

// Exercise External (Vacancy)
import ExerciseExternals from '@/views/Exercise/Externals/View.vue';
import ExerciseExternalsEdit from '@/views/Exercise/Externals/Edit.vue';

// Exercise Configuration
import ExerciseConfiguration from '@/views/Exercise/Configuration.vue';
import ExerciseConfigurationApplicationVersion from '@/views/Exercise/Configuration/ApplicationVersion.vue';
import ExerciseConfigurationProcessingVersion from '@/views/Exercise/Configuration/ProcessingVersion.vue';

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
import ExerciseDetailsPreferencesEditV1 from '@/views/Exercise/Details/Preferences/Edit.v1.vue';  // previous edit page
import ExerciseDetailsAdditionalSettings from '@/views/Exercise/Details/AdditionalSettings/View.vue';
import ExerciseDetailsAdditionalSettingsEdit from '@/views/Exercise/Details/AdditionalSettings/Edit.vue';

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
import ExerciseReportsAgency from '@/views/Exercise/Reports/Agency.vue';
import ExerciseReportsHandover from '@/views/Exercise/Reports/Handover.vue';
import ExerciseReportsDeployment from '@/views/Exercise/Reports/Deployment.vue';
import ExerciseReportsStatutoryConsultation from '@/views/Exercise/Reports/StatutoryConsultation.vue';
import ExerciseReportsPanels from '@/views/Exercise/Reports/Panels.vue';
import ExerciseReportsPanelsNew from '@/views/Exercise/Reports/PanelsNew.vue';
import ExerciseReportsPanelsView from '@/views/Exercise/Reports/PanelsView.vue';
import ExerciseReportsSift from '@/views/Exercise/Reports/Sift.vue';
import ExerciseReportsSelectionDays from '@/views/Exercise/Reports/SelectionDays.vue';
import ExerciseReportsScenario from '@/views/Exercise/Reports/Scenario.vue';
import ExerciseReportsCommissionerConflicts from '@/views/Exercise/Reports/CommissionerConflicts.vue';

// Merit list
import ExerciseReportsMeritList from '@/views/Exercise/Reports/MeritList.vue';

// Exercise tasks
import ExerciseTasks from '@/views/Exercise/Tasks.vue';
import ExerciseTasksIndex from '@/views/Exercise/Tasks/Index.vue';
import ExerciseTasksIndependentAssessments from '@/views/Exercise/Tasks/IndependentAssessments.vue';
import ExerciseTasksCharacterChecks from '@/views/Exercise/Tasks/CharacterChecks.vue';
//import ExerciseTasksCharacterChecksEdit from '@/views/Exercise/Tasks/CharacterChecksEdit.vue';

// Exercise task
import ExerciseTask from '@/views/Exercise/Tasks/Task.vue';
import ExerciseTaskLoading from '@/views/Exercise/Tasks/Task/Loading.vue';
import ExerciseTaskNew from '@/views/Exercise/Tasks/Task/New.vue';
import ExerciseTaskStageOutcome  from '@/views/Exercise/Tasks/Task/StageOutcome/Overview.vue';
import ExerciseTaskCandidateFormConfigure from '@/views/Exercise/Tasks/Task/CandidateForm/Configure.vue';
import ExerciseTaskCandidateFormMonitor from '@/views/Exercise/Tasks/Task/CandidateForm/Monitor.vue';
import ExerciseTaskDataInitialised from '@/views/Exercise/Tasks/Task/Data/Initialised.vue';
import ExerciseTaskDataActivated from '@/views/Exercise/Tasks/Task/Data/Activated.vue';
import ExerciseTaskTestInitialised from '@/views/Exercise/Tasks/Task/Test/Initialised.vue';
import ExerciseTaskTestActivated from '@/views/Exercise/Tasks/Task/Test/Activated.vue';
import ExerciseTaskPanelsInitialised from '@/views/Exercise/Tasks/Task/Panels/Initialised.vue';
import ExerciseTaskPanelsActivated from '@/views/Exercise/Tasks/Task/Panels/Activated.vue';
import ExerciseTaskModerationInitialised from '@/views/Exercise/Tasks/Task/Moderation/Initialised.vue';
import ExerciseTaskModerationActivated from '@/views/Exercise/Tasks/Task/Moderation/Activated.vue';
import ExerciseTaskStatusChanges from '@/views/Exercise/Tasks/Task/StatusChanges/Index.vue';
import ExerciseTaskFinalised from '@/views/Exercise/Tasks/Task/Finalised.vue';
import ExerciseTaskFinalisedList from '@/views/Exercise/Tasks/Task/Finalised/List.vue';
import ExerciseTaskFinalisedViewScore from '@/views/Exercise/Tasks/Task/Finalised/View.vue';
import ExerciseTaskCompleted from '@/views/Exercise/Tasks/Task/Completed.vue';
import ExerciseTaskPanelNew from '@/views/Exercise/Tasks/Task/Panel/New.vue';
import ExerciseTaskPanelView from '@/views/Exercise/Tasks/Task/Panel/View.vue';

// Exercise stages
import ExerciseStages from '@/views/Exercise/Stages.vue';
import ExerciseStageList from '@/views/Exercise/Stages/List.vue';
import ExerciseStageEdit from '@/views/Exercise/Stages/Edit.vue';
import ExerciseStageBack from '@/views/Exercise/Stages/Back.vue';

// Candidates
import Candidates from '@/views/Candidates/Candidates.vue';
import CandidatesList from '@/views/Candidates/CandidatesList.vue';
import CandidatesView from '@/views/Candidates/CandidatesView.vue';
import TargetedOutreachReport from '@/views/Candidates/TargetedOutreachReport.vue';

// Panellists
import Panellists from '@/views/Panellists';
import PanellistsList from '@/views/Panellists/List';
import PanellistsView from '@/views/Panellists/Panellist';

// Error pages
import ExerciseNotFound from '@/views/Errors/ExerciseNotFound.vue';
import PageNotFound from '@/views/Errors/PageNotFound.vue';

import Sandbox from '@/views/Sandbox.vue';

// Users
import Users from '@/views/Users/Users.vue';

// Latest Releases
import ReleasesList from '@/views/ReleasesList.vue';

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
    path: '/latest-releases',
    name: 'releases',
    component: ReleasesList,
    meta: {
      requiresAuth: true,
      title: 'Latest Releases',
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
    path: '/exercises/programme-view',
    name: 'exercises-programme-view',
    component: ExercisesProgrammeView,
    meta: {
      requiresAuth: true,
      title: 'Programme view',
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
          title: 'Overview | External Vacancy',
        },
      },
      {
        path: 'externals/',
        component: ExerciseExternals,
        name: 'exercise-external',
        meta: {
          requiresAuth: true,
          title: 'Edit | External Vacancy',
        },
      },
      {

        name: 'exercise-external-edit',
        path: 'externals/edit',
        component: ExerciseExternalsEdit,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'configuration/',
        component: ExerciseConfiguration,
        children: [
          {
            path: '',
            redirect: { name: 'exercise-configuration-application-version' },
          },
          {
            name: 'exercise-configuration-application-version',
            path: 'application-version',
            component: ExerciseConfigurationApplicationVersion,
            meta: {
              requiresAuth: true,
              title: 'Application Version | Exercise Configuration',
            },
          },
          {
            name: 'exercise-configuration-processing-version',
            path: 'processing-version',
            component: ExerciseConfigurationProcessingVersion,
            meta: {
              requiresAuth: true,
              title: 'Processing Version | Exercise Configuration',
            },
          },
        ],
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
                name: 'exercise-details-preferences-edit-v1',
                path: 'edit-v1',
                component: ExerciseDetailsPreferencesEditV1,
                meta: {
                  requiresAuth: true,
                  title: 'Edit Preferences | Exercise Details',
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
          {
            path: 'additional-settings/',
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
        path: 'applications/',
        component: ExerciseApplications,
        children: [
          {
            path: '',
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
        path: 'tasks/:stage',
        component: ExerciseTasks,
        children: [
          {
            path: '',
            component: ExerciseTasksIndex,
            name: 'exercise-tasks',
            meta: {
              requiresAuth: true,
              title: 'Exercise Tasks',
            },
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
                path: 'outcome',
                component: ExerciseTaskStageOutcome,
                name: 'exercise-task-stageOutcome',
                meta: {
                  requiresAuth: true,
                  title: 'Stage Outcome | Exercise task',
                },
              },
              {
                path: 'configure-candidate-form',
                component: ExerciseTaskCandidateFormConfigure,
                name: 'exercise-task-candidateFormConfigure',
                meta: {
                  requiresAuth: true,
                  title: 'Configure | Candidate Form | Exercise task',
                },
              },
              {
                path: 'monitor-candidate-form',
                component: ExerciseTaskCandidateFormMonitor,
                name: 'exercise-task-candidateFormMonitor',
                meta: {
                  requiresAuth: true,
                  title: 'Monitor | Candidate Form | Exercise task',
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
                path: 'finalised/',
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
            redirect: { name: 'exercise-stage-list', params: { stage: EXERCISE_STAGE.REVIEW } },
          },
          {
            path: ':stage/',
            component: EmptyRouterView,
            children: [
              {
                path: '',
                component: ExerciseStageList,
                name: 'exercise-stage-list',
                meta: {
                  requiresAuth: true,
                  title: 'List | Exercise Stage',
                },
              },
              {
                path: 'edit',
                component: ExerciseStageEdit,
                name: 'exercise-stage-edit',
                meta: {
                  requiresAuth: true,
                  title: 'Edit | Exercise Stage',
                },
              },
              {
                path: 'back',
                component: ExerciseStageBack,
                name: 'exercise-stage-back',
                meta: {
                  requiresAuth: true,
                  title: 'Move Back | Exercise Stage',
                },
              },
            ],
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
            name: 'exercise-reports-merit-list',
            path: 'merit-list',
            component: ExerciseReportsMeritList,
            meta: {
              requiresAuth: true,
              title: 'Merit List',
            },
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
            name: 'deployment',
            path: 'deployment',
            component: ExerciseReportsDeployment,
            meta: {
              requiresAuth: true,
              title: 'Deployment | Exercise Reports',
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
          {
            name: 'commissioner-conflicts',
            path: 'commissioner-conflicts',
            component: ExerciseReportsCommissionerConflicts,
            meta: {
              requiresAuth: true,
              title: 'Commissioner Conflicts | Exercise Reports',
            },
          },
        ],
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
    return next({ name: 'sign-in', query: { nextPage: to.path } });
  }

  return next();
});

// Global after hook to set an appropriate title for the page
router.afterEach((to) => {
  document.title = `${to.meta.title} | JAC Digital Platform`;
});

export default router;
