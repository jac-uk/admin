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
import ExerciseEditInvitations from '@/views/Exercises/Edit/Invitations';

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
import ExerciseShowAssessmentOptions from '@/views/Exercises/Show/AssessmentOptions';
import ExerciseShowDownloads from '@/views/Exercises/Show/Downloads';
import ExerciseShowApplications from '@/views/Exercises/Show/Applications';
import ExerciseShowInvitations from '@/views/Exercises/Show/Invitations';

// Application
import ExerciseApplication from '@/views/Exercises/Applications/Application';

// Stages
import ExerciseStages from '@/views/Exercises/Stages';
import ExerciseStagesReviewList from '@/views/Exercises/Stages/ReviewList';
import ExerciseStagesReviewEdit from '@/views/Exercises/Stages/ReviewEdit';
import ExerciseStagesSelectedList from '@/views/Exercises/Stages/SelectedList';
import ExerciseStagesSelectedEdit from '@/views/Exercises/Stages/SelectedEdit';
import ExerciseStagesSelectedBack from '@/views/Exercises/Stages/SelectedBack';
import ExerciseStagesRecommendedList from '@/views/Exercises/Stages/RecommendedList';
import ExerciseStagesRecommendedEdit from '@/views/Exercises/Stages/RecommendedEdit';
import ExerciseStagesRecommendedBack from '@/views/Exercises/Stages/RecommendedBack';
import ExerciseStagesHandoverList from '@/views/Exercises/Stages/HandoverList';
import ExerciseStagesHandoverBack from '@/views/Exercises/Stages/HandoverBack';
import ExerciseStagesShortlistedList from '@/views/Exercises/Stages/ShortlistedList';
import ExerciseStagesShortlistedEdit from '@/views/Exercises/Stages/ShortlistedEdit';
import ExerciseStagesShortlistedBack from '@/views/Exercises/Stages/ShortlistedBack';

// Candidates
import Candidates from '@/views/Candidates/Candidates';
import CandidatesList from '@/views/Candidates/CandidatesList';
import CandidatesView from '@/views/Candidates/CandidatesView';

// Tasks
import ExerciseTasks from '@/views/Exercises/Tasks';
import ExerciseTasksIndependentAssessments from '@/views/Exercises/Tasks/IndependentAssessments';
import ExerciseTasksCharacterChecks from '@/views/Exercises/Tasks/CharacterChecks';
import ExerciseTasksCharacterChecksEdit from '@/views/Exercises/Tasks/CharacterChecksEdit';
import ExerciseTasksPanels from '@/views/Exercises/Tasks/Panels';
import ExerciseTasksPanelsNew from '@/views/Exercises/Tasks/PanelsNew';
import ExerciseTasksPanelsView from '@/views/Exercises/Tasks/PanelsView';
import ExerciseTasksSift from '@/views/Exercises/Tasks/Sift';
import ExerciseTasksSelectionDays from '@/views/Exercises/Tasks/SelectionDays';

// Temp
import QualifyingTestsCover from '@/views/Exercises/Tasks/QualifyingTests/Cover';

// QTs
import QualifyingTest from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest';
import QualifyingTestNew from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/New';
import QualifyingTestEdit from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/Edit';
import QualifyingTestView from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/View';
import QualifyingTestQuestionBuilder from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/TestBuilder';
import QualifyingTestDryRun from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/DryRun';
import QualifyingTestReview from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/Review';
import QualifyingTestResponses from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/Responses';
import QualifyingTestResponse from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/Response';
import QualifyingTestResponseView from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/Response/View';

// Report views
import ExerciseShowReports from '@/views/Exercises/Show/Reports';
import ExerciseShowReportsIndex from '@/views/Exercises/Show/Reports/Index';
import ExerciseShowReportsDiversity from '@/views/Exercises/Show/Reports/Diversity';
import ExerciseShowReportsOutreach from '@/views/Exercises/Show/Reports/Outreach';
import ExerciseShowReportsReasonableAdjustments from '@/views/Exercises/Show/Reports/ReasonableAdjustments';
import ExerciseShowReportsEligibilityIssues from '@/views/Exercises/Show/Reports/EligibilityIssues';
import ExerciseShowReportsCharacterIssues from '@/views/Exercises/Show/Reports/CharacterIssues';
import ExerciseShowReportsAgency from '@/views/Exercises/Show/Reports/Agency';
import ExerciseShowReportsHandover from '@/views/Exercises/Show/Reports/Handover';
import ExerciseReportsCharacterIssues from '@/views/Exercises/Reports/CharacterIssues';
import ExerciseReportsEligibilityIssues from '@/views/Exercises/Reports/EligibilityIssues';
import ExerciseReportsCharacterChecks from '@/views/Exercises/Reports/CharacterChecks';
import ExerciseReportsDiversityDashboard from '@/views/Exercises/Reports/DiversityDashboard';
import ExerciseReportsEducationAndCareerHistory from '@/views/Exercises/Reports/EducationAndCareerHistory';
import ExerciseReportsJOHandoverReport from '@/views/Exercises/Reports/JOHandoverReport';
import ExerciseReportsStatutoryConsultationTable from '@/views/Exercises/Reports/StatutoryConsultationTable';
import ExerciseReportsReasonableAdjustments from '@/views/Exercises/Reports/ReasonableAdjustments';
import QualifyingTestReports from '@/views/Exercises/Show/Reports/QualifyingTestReports/QualifyingTestReports';
import QualifyingTestReportCreate from '@/views/Exercises/Show/Reports/QualifyingTestReports/Create';
import QualifyingTestReport from '@/views/Exercises/Show/Reports/QualifyingTestReports/QualifyingTestReport';
import QualifyingTestReportEdit from '@/views/Exercises/Show/Reports/QualifyingTestReports/QualifyingTestReport/Edit';
import QualifyingTestReportView from '@/views/Exercises/Show/Reports/QualifyingTestReports/QualifyingTestReport/View';
import QualifyingTestReportViewScore from '@/views/Exercises/Show/Reports/QualifyingTestReports/QualifyingTestReport/ViewScore';

// Error pages
import ExerciseNotFound from '@/views/Errors/ExerciseNotFound';
import PageNotFound from '@/views/Errors/PageNotFound';

import Dashboard from '@/views/Dashboard';
import ExercisesExport from '@/views/Exercises/Export';
import SignIn from '@/views/SignIn';
import NotificationsList from '@/views/NotificationsList';

import Sandbox from '@/views/Sandbox';

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
      path: '/notifications',
      name: 'notifications',
      component: NotificationsList,
      meta: {
        requiresAuth: true,
        title: 'Notifications',
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
      path: '/exercises/export',
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
          path: 'invitations',
          component: ExerciseShowInvitations,
          name: 'exercise-show-invitations',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Invitations',
          },
        },
        {
          path: 'applications',
          name: 'exercise-show-applications',
          redirect: 'applications/applied',
        },
        // @TODO move this to Applications folder, not Show
        {
          path: 'applications/:status',
          component: ExerciseShowApplications,
          name: 'exercise-show-applications-in-status',
          meta: {
            requiresAuth: true,
            title: 'Exercise Details | Applications',
          },
        },
        // this route enables side navigation to show active state for :status
        {
          path: 'applications/:status/application/:applicationId',
          component: ExerciseApplication,
          name: 'exercise-applications-application',
          meta: {
            requiresAuth: true,
            title: 'Exercise Application',
          },
        },
        {
          path: 'application/:applicationId',
          component: ExerciseApplication,
          name: 'exercise-application',
          meta: {
            requiresAuth: true,
            title: 'Exercise Application',
          },
        },
        {
          path: 'stages',
          component: ExerciseStages,
          children: [
            {
              path: 'review',
              component: ExerciseStagesReviewList,
              name: 'exercise-stages-review-list',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Review list',
              },
            },
            {
              path: 'review/edit',
              component: ExerciseStagesReviewEdit,
              name: 'exercise-stages-review-edit',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Review edit',
              },
            },
            {
              path: 'selected',
              component: ExerciseStagesSelectedList,
              name: 'exercise-stages-selected-list',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Selected list',
              },
            },
            {
              path: 'selected/edit',
              component: ExerciseStagesSelectedEdit,
              name: 'exercise-stages-selected-edit',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Selected edit',
              },
            },
            {
              path: 'selected/back',
              component: ExerciseStagesSelectedBack,
              name: 'exercise-stages-selected-back',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Selected back',
              },
            },
            {
              path: 'recommended',
              component: ExerciseStagesRecommendedList,
              name: 'exercise-stages-recommended-list',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Recommended list',
              },
            },
            {
              path: 'recommended/edit',
              component: ExerciseStagesRecommendedEdit,
              name: 'exercise-stages-recommended-edit',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Recommended edit',
              },
            },
            {
              path: 'recommended/back',
              component: ExerciseStagesRecommendedBack,
              name: 'exercise-stages-recommended-back',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Recommended back',
              },
            },
            {
              path: 'handover',
              component: ExerciseStagesHandoverList,
              name: 'exercise-stages-handover-list',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Selected list',
              },
            },
            {
              path: 'handover/back',
              component: ExerciseStagesHandoverBack,
              name: 'exercise-stages-handover-back',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Selected back',
              },
            },
            {
              path: 'shortlisted',
              component: ExerciseStagesShortlistedList,
              name: 'exercise-stages-shortlisted-list',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Shortlisted',
              },
            },
            {
              path: 'shortlisted/edit',
              component: ExerciseStagesShortlistedEdit,
              name: 'exercise-stages-shortlisted-edit',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Shortlisted edit',
              },
            },
            {
              path: 'shortlisted/back',
              component: ExerciseStagesShortlistedBack,
              name: 'exercise-stages-shortlisted-back',
              meta: {
                requiresAuth: true,
                title: 'Exercise Stages | Shortlisted back',
              },
            },
          ],
        },
        {
          path: 'tasks',
          component: ExerciseTasks,
          children: [
            {
              path: 'independent-assessments',
              component: ExerciseTasksIndependentAssessments,
              name: 'exercise-tasks-independent-assessments',
              meta: {
                requiresAuth: true,
                title: 'Exercise Tasks | Independent Assessments',
              },
            },
            {
              path: 'character-checks',
              component: ExerciseTasksCharacterChecks,
              name: 'exercise-tasks-character-checks',
              meta: {
                requiresAuth: true,
                title: 'Exercise Tasks | Character Checks edit',
              },
            },
            {
              path: 'character-checks/edit',
              component: ExerciseTasksCharacterChecksEdit,
              name: 'exercise-tasks-character-checks-edit',
              meta: {
                requiresAuth: true,
                title: 'Exercise Tasks | Character Checks',
              },
            },
            {
              path: 'qualifying-tests',
              component: QualifyingTestsCover,
              name: 'exercise-tasks-qualifying-tests',
              meta: {
                requiresAuth: true,
                title: 'Qualifying Tests',
              },
            },
            {
              path: 'qualifying-tests/new',
              component: QualifyingTestNew,
              name: 'qualifying-test-new',
              meta: {
                requiresAuth: true,
                title: 'Qualifying Tests | New',
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
                    title: 'Qualifying Test | View',
                  },
                },
                {
                  path: 'edit',
                  component: QualifyingTestEdit,
                  name: 'qualifying-test-edit',
                  meta: {
                    requiresAuth: true,
                    title: 'Qualifying Test | Edit',
                  },
                },
                {
                  path: 'build',
                  component: QualifyingTestQuestionBuilder,
                  name: 'qualifying-test-question-builder',
                  meta: {
                    requiresAuth: true,
                    title: 'Qualifying Tests | Question Builder',
                  },
                },
                {
                  path: 'dry-run',
                  component: QualifyingTestDryRun,
                  name: 'qualifying-test-dry-run',
                  meta: {
                    requiresAuth: true,
                    title: 'Qualifying Tests | Dry Run',
                  },
                },
                {
                  path: 'review',
                  component: QualifyingTestReview,
                  name: 'qualifying-test-review',
                  meta: {
                    requiresAuth: true,
                    title: 'Qualifying Test | Review',
                  },
                },
                {
                  path: 'responses/:status',
                  component: QualifyingTestResponses,
                  name: 'qualifying-test-responses',
                  meta: {
                    requiresAuth: true,
                    title: 'Qualifying Test | Responses',
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
                        title: 'Qualifying Test | Response View',
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
                    title: 'Exercise Tasks | Sift - new',
                  },
                },
                {
                  path: 'new',
                  component: ExerciseTasksPanelsNew,
                  name: 'exercise-tasks-sift-new',
                  meta: {
                    requiresAuth: true,
                    title: 'Exercise Tasks | Sift - new',
                    pageName: 'exercise-tasks-sift',
                  },
                },
                {
                  path: 'view/:panelId',
                  component: ExerciseTasksPanelsView,
                  name: 'exercise-tasks-sift-view',
                  meta: {
                    requiresAuth: true,
                    title: 'Exercise Tasks | Panels - Sift - view',
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
                    title: 'Exercise Tasks | Selection',
                  },
                },
                {
                  path: 'new',
                  component: ExerciseTasksPanelsNew,
                  name: 'exercise-tasks-selection-new',
                  meta: {
                    requiresAuth: true,
                    title: 'Exercise Tasks | Selection - new',
                  },
                },
                {
                  path: 'view/:panelId',
                  component: ExerciseTasksPanelsView,
                  name: 'exercise-tasks-selection-view',
                  meta: {
                    requiresAuth: true,
                    title: 'Exercise Tasks | Panels - view',
                  },
                },
              ],
            },
          ],
        },
        {
          path: 'reports',
          component: ExerciseShowReports,
          children: [
            {
              path: '',
              component: ExerciseShowReportsIndex,
              name: 'exercise-show-reports',
              meta: {
                requiresAuth: true,
                title: 'Exercise Reports',
              },
            },
            {
              path: 'diversity',
              component: ExerciseShowReportsDiversity,
              name: 'exercise-show-report-diversity',
              meta: {
                requiresAuth: true,
                title: 'Exercise Reports | Diversity',
              },
            },
            {
              path: 'outreach',
              component: ExerciseShowReportsOutreach,
              name: 'exercise-show-report-outreach',
              meta: {
                requiresAuth: true,
                title: 'Exercise Reports | Oureach',
              },
            },
            {
              path: 'reasonable-adjustments',
              component: ExerciseShowReportsReasonableAdjustments,
              name: 'exercise-show-report-reasonable-adjustments',
              meta: {
                requiresAuth: true,
                title: 'Exercise Reports | Reasonable Adjustments',
              },
            },
            {
              path: 'qualifying-test-reports',
              component: QualifyingTestReports,
              name: 'qualifying-test-reports',
              meta: {
                requiresAuth: true,
                title: 'Qualifying Test Reports',
              },
            },
            {
              path: 'qualifying-test-report-create',
              component: QualifyingTestReportCreate,
              name: 'qualifying-test-report-create',
              meta: {
                requiresAuth: true,
                title: 'Qualifying Test Report | New',
              },
            },
            {
              path: 'qualifying-test-reports/:qualifyingTestReportId',
              component: QualifyingTestReport,
              children: [
                {
                  path: '',
                  component: QualifyingTestReportView,
                  name: 'qualifying-test-report-view',
                  meta: {
                    requiresAuth: true,
                    title: 'Qualifying Test Report | View',
                  },
                },
                {
                  path: 'edit',
                  component: QualifyingTestReportEdit,
                  name: 'qualifying-test-report-edit',
                  meta: {
                    requiresAuth: true,
                    title: 'Qualifying Test Report | Edit',
                  },
                },
                {
                  path: ':score',
                  component: QualifyingTestReportViewScore,
                  name: 'qualifying-test-report-view-score',
                  meta: {
                    requiresAuth: true,
                    title: 'Qualifying Test Report | View Score',
                  },
                },
              ],
            },
            {
              path: 'eligibility',
              component: ExerciseShowReportsEligibilityIssues,
              name: 'exercise-show-report-eligibility-issues',
              meta: {
                requiresAuth: true,
                title: 'Exercise Reports | Eligibility Issues',
              },
            },
            {
              path: 'character',
              component: ExerciseShowReportsCharacterIssues,
              name: 'exercise-show-report-character-issues',
              meta: {
                requiresAuth: true,
                title: 'Exercise Reports | Character Issues',
              },
            },
            {
              path: 'agency',
              component: ExerciseShowReportsAgency,
              name: 'exercise-show-report-agency',
              meta: {
                requiresAuth: true,
                title: 'Exercise Reports | Agency',
              },
            },
            {
              path: 'handover',
              component: ExerciseShowReportsHandover,
              name: 'exercise-show-report-handover',
              meta: {
                requiresAuth: true,
                title: 'Exercise Reports | Handover',
              },
            },
          ],
        },
      ],
    },
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
        {
          path: 'invitations',
          component: ExerciseEditInvitations,
          name: 'exercise-edit-invitations',
          meta: {
            requiresAuth: true,
            title: 'Invitations',
          },
        },
      ],
    },
    {
      path: '/exercises/:id/report-directory',
      component: ExerciseShowReports,
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
        if (isSignedIn) {
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
  document.title = `${to.meta.title} | JAC Digital Platform`;
});

export default router;
