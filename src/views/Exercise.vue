<template>
  <div>
    <LoadingMessage
      v-if="!loaded"
      :load-failed="loadFailed"
    />
    <div v-else>
      <div class="govuk-grid-row print-none">
        <div class="govuk-grid-column-one-quarter">
          <router-link
            class="govuk-back-link govuk-!-margin-0"
            :to="goBack"
          >
            Back
          </router-link>
        </div>
      </div>
      <div class="title-bar-exercise govuk-grid-row clearfix govuk-!-margin-top-4 govuk-!-margin-bottom-2">
        <div class="govuk-grid-column-full">
          <div>
            <h1
              class="govuk-heading-xl govuk-!-margin-bottom-0"
              style="display:inline-block"
            >
              {{ exerciseName }}
            </h1>
            <span
              v-show="isInFavourites"
              class="favourite-tag govuk-tag--yellow govuk-!-margin-left-3"
              style="display: inline-block; vertical-align: super; padding: 5px 8px 4px 8px; font-weight: 700; font-size: 16px; line-height: 16px; letter-spacing: 1px;"
            >
              FAVOURITE
            </span>
          </div>

          <a
            href="#"
            class="govuk-!-margin-right-4 govuk-link print-none"
            @click.prevent="updateFavourites"
          >
            {{ isInFavourites ? 'Remove from favourite' : 'Add to favourite' }}
          </a>

          <router-link
            v-if="!isAdvertTypeExternal && !hasJourney && isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
            class="govuk-link govuk-!-margin-right-4 print-none"
            :to="{name: 'exercise-edit-name'}"
          >
            Edit name
          </router-link>
          <router-link
            v-if="canEditExerciseConfiguration"
            class="govuk-link govuk-!-margin-right-4 print-none"
            :to="{name: 'exercise-configuration-application-version'}"
          >
            Application form v{{ exercise._applicationVersion || 1 }}
          </router-link>
          <router-link
            v-if="canEditExerciseConfiguration"
            class="govuk-link print-none"
            :to="{name: 'exercise-configuration-processing-version'}"
          >
            Processing v{{ exercise._processingVersion || 1 }}
          </router-link>
          <div
            v-if="!isProduction"
            class="govuk-!-margin-top-4"
          >
            <button
              v-if="isReadyForTesting && !isArchived"
              class="govuk-button govuk-button--secondary"
              @click="changeNoOfTestApplications()"
            >
              Create demo applications
            </button>
            <ActionButton
              v-if="isTesting"
              ref="createTestApplicationsBtn"
              :action="createTestApplications"
            >
              Create demo applications
            </ActionButton>
          </div>
        </div>
      </div>
      <div class="sub-navigation govuk-grid-row">
        <div class="govuk-grid-column-full print-none">
          <span
            class="float-right govuk-!-margin-top-3"
            style="font-size: 1.1875rem"
          >{{ exercise.referenceNumber }}</span>
          <TabMenu
            v-if="!isAdvertTypeExternal && !hasJourney && tabs.length > 1"
            :tabs="tabs"
          />
        </div>
      </div>
      <RouterView />
      <Modal ref="modalChangeNoOfTestApplications">
        <ChangeNoOfTestApplications
          :no-of-test-applications="1"
          @close="cancelChangeNoOfTestApplications()"
          @confirmed="confirmedNoOfTestApplications()"
        />
      </Modal>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { httpsCallable } from '@firebase/functions';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import ChangeNoOfTestApplications from '@/components/ModalViews/ChangeNoOfTestApplications.vue';
import { mapState } from 'vuex';
import { isEditable, hasQualifyingTests, isProcessing, applicationCounts, isApproved, isArchived, availableStages, availableReportLinks, getTaskTypes, TASK_STATUS } from '@jac-uk/jac-kit/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { functions } from '@/firebase';
import { useExercise } from '@/composables/useExercise';
import TabMenu from '@/components/Navigation/TabMenu2.vue';
import { ADVERT_TYPES, EXERCISE_STAGE, TASK_TYPE } from '@jac-uk/jac-kit/helpers/constants';
import { lookup } from '@/filters';

export default {
  name: 'ExerciseView',
  components: {
    LoadingMessage,
    Modal,
    //ModalInner,
    ActionButton,
    ChangeNoOfTestApplications,
    TabMenu,
  },
  mixins: [permissionMixin],
  setup() {
    const { getExerciseProgress } = useExercise();
    const exerciseProgress = computed(() => getExerciseProgress().value);

    return {
      exerciseProgress,
    };
  },
  data() {
    return {
      loaded: false,
      loadFailed: false,
    };
  },
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
    }),
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    isEditable() {
      return isEditable(this.exercise);
    },
    hasQualifyingTests() {
      return hasQualifyingTests(this.exercise);
    },
    isProcessing() {
      return isProcessing(this.exercise);
    },
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
    exerciseName() {
      return this.exercise.name && this.exercise.name.length < 80 ? this.exercise.name : `${this.exercise.name.substring(0,79)}..`;
    },
    isAdvertTypeExternal() {
      return this.exercise && this.exercise.advertType === ADVERT_TYPES.EXTERNAL;
    },
    canUpdateExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canUpdateExercises.value]);
    },
    canArchiveExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canAmendAfterLaunch.value]);
    },
    canEditExerciseConfiguration() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canConfigureExercise.value]);
    },
    isInFavourites() {
      return this.userId && this.exercise && this.exercise.favouriteOf && this.exercise.favouriteOf.indexOf(this.userId) >= 0;
    },
    isArchived() {
      return isArchived(this.exercise);
    },
    isApproved() {
      return isApproved(this.exercise);
    },
    isPublished() {
      return this.exercise.published;
    },
    isReadyForTesting() {
      return this.isPublished && this.isApproved && !this.isTesting && !this.isTested;
    },
    isTesting() {
      return this.exercise && this.exercise.testingState && this.exercise.testingState === 'testing';
    },
    isProduction() {
      return this.$store.getters['isProduction'];
    },
    hasOpened() {
      if (this.exercise && this.exercise.applicationOpenDate <= new Date()) {
        return true;
      }
      return false;
    },
    applicationCounts() {
      return applicationCounts(this.exercise);
    },
    stageLinks() {
      const exercise = this.exercise;
      const path = `/exercise/${exercise.id}/stages`;
      const stages = availableStages(exercise);
      const links = [];
      stages.forEach(stage => {
        const count = (exercise._applicationRecords && exercise._applicationRecords[stage]) || 0;
        links.push({
          title: `${this.$filters.lookup(stage)} (${this.$filters.formatNumber(count)})`, // TODO get label
          link: `${path}/${stage}`,
        });
      });
      return links;
    },
    reportLinks() {
      return availableReportLinks(this.exercise).map((link) => ({
        title: link.title,
        link,
      }));
    },
    taskLinks() {
      const exercise = this.exercise;
      const stage = 'all';
      const path = `/exercise/${exercise.id}/tasks/${stage}`;
      const links = [];
      switch (stage) {
      case 'all':
        getTaskTypes(exercise).forEach(taskType => {
          const task = this.$store.getters['tasks/getTask'](taskType);
          let tag;
          if (task && task.status === TASK_STATUS.COMPLETED) {
            tag = {
              title: 'Done',
              class: 'govuk-tag--blue',
            };
          }
          links.push(
            {
              title: lookup(taskType),
              link: {
                tag: tag,
                path: `${path}/${taskType}`,
              },
            }
          );
        });
        if (isProcessing(exercise)) {
          if (!(exercise.assessmentMethods && exercise.assessmentMethods.independentAssessments === false)) {
            links.push({
              title: 'Independent Assessments',
              link: {
                path: `${path}/independent-assessments`,
              },
            });
          }
          links.push(
            {
              title: 'Character Checks',
              link: {
                path: `${path}/character-checks`,
              },
            }
          );
        }
        break;
      case 'shortlisting':
        if (isProcessing(exercise)) {
          if (!(exercise.assessmentMethods && exercise.assessmentMethods.independentAssessments === false)) {
            links.push({
              title: 'Independent Assessments',
              link: {
                path: `${path}/independent-assessments`,
              },
            });
          }
        }
        getTaskTypes(exercise, stage).forEach(taskType => {
          const task = this.$store.getters['tasks/getTask'](taskType);
          let tag;
          if (task && task.status === TASK_STATUS.COMPLETED) {
            tag = {
              title: 'Done',
              class: 'govuk-tag--blue',
            };
          }
          links.push(
            {
              title: lookup(taskType),
              link: {
                tag: tag,
                path: `${path}/${taskType}`,
              },
            }
          );
        });
        break;
      case 'selection':
        links.push(
          {
            title: 'Character Checks',
            link: {
              path: `${path}/character-checks`,
            },
          }
        );
        getTaskTypes(exercise, stage).forEach(taskType => {
          const task = this.$store.getters['tasks/getTask'](taskType);
          let tag;
          if (task && task.status === TASK_STATUS.COMPLETED) {
            tag = {
              title: 'Done',
              class: 'govuk-tag--blue',
            };
          }
          links.push(
            {
              title: lookup(taskType),
              link: {
                tag: tag,
                path: `${path}/${taskType}`,
              },
            }
          );
        });
        links.push({
          title: lookup(TASK_TYPE.SELECTION_OUTCOME),
          link: {
            path: `${path}/${TASK_TYPE.SELECTION_OUTCOME}`,
          },
        }

        );
        break;
      }
      return links;
    },
    tabs() {
      if (!this.exercise) { return []; }
      const path = `/exercise/${this.exercise.id}`;
      const subNavigation = [];
      if (this.applicationCounts._total) {
        subNavigation.push({ link: { path: `${path}/dashboard`, name: 'exercise-dashboard' }, title: 'Dashboard' });
      }
      const content = [];
      content.push({ title: 'Overview', link: { name: 'exercise-overview' } });
      //if (!this.exercise.state || this.exercise.state === 'draft' || this.exercise.state === 'ready') {
      //  if (this.exerciseProgress) {
      content.push(
        { title: 'Website listing', link: { name: 'exercise-details-summary' } },
        { title: 'Vacancy information', link: { name: 'exercise-details-vacancy' } },
        { title: 'Contacts', link: { name: 'exercise-details-contacts' } },
        { title: 'Shortlisting', link: { name: 'exercise-details-shortlisting' } },
        { title: 'Timeline', link: { name: 'exercise-details-timeline' } },
        { title: 'Eligibility information', link: { name: 'exercise-details-eligibility' } },
        { title: 'Working preferences', link: { name: 'exercise-details-preferences' } },
        { title: 'Assessment options', link: { name: 'exercise-details-assessments' } },
        { title: 'Exercise downloads', link: { name: 'exercise-details-downloads' } },
        { title: 'Application process', link: { name: 'exercise-details-application-content' } },
        { title: 'Selection set-up', link: { name: 'exercise-details-selection-setup' } }
      );
      //  }
      //}

      if (content.length) {
        subNavigation.push({
          title: 'Exercise Set-up',
          link: { name: 'exercise-overview' },
          content: content,
        });
      }

      if (this.isProcessing) {
        subNavigation.push({ link: { name: 'exercise-tasks', params: { stage: 'all' } }, title: 'Tasks', content: this.taskLinks });
        subNavigation.push({ link: { name: 'exercise-stage-list', params: { stage: EXERCISE_STAGE.REVIEW } }, title: 'Stages', content: this.stageLinks });
        subNavigation.push({ link: { name: 'exercise-reports-diversity' }, title: 'Reports', content: this.reportLinks });
      }
      return subNavigation;
    },
    goBack() {
      if (this.$route.name === 'exercise-overview' || (this.isAdvertTypeExternal && this.$route.name === 'exercise-external')) {
        return {
          name: 'exercises',
        };
      } else {
        return {
          name: 'exercise-overview',
          params: {
            id: this.exercise ? this.exercise.id : this.$route.params.id,
          },
        };
      }
    },
    isTested() {
      return this.exercise && this.exercise.testingState && this.exercise.testingState === 'tested';
    },
  },
  unmounted() {
    this.$store.dispatch('exerciseDocument/unbind');
  },
  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch('exerciseDocument/bind', id)
      .then((data) => {
        if (data === null) {
          this.redirectToErrorPage();
        }
        else {
          this.loaded = true;
        }
      }).catch((e) => {
        this.loadFailed = true;
        throw e;
      });
  },
  methods: {
    redirectToErrorPage() {
      this.$router.replace({ name: 'exercise-not-found' });
    },
    updateFavourites() {
      if (this.isInFavourites) {
        this.$store.dispatch('exerciseDocument/removeFromFavourites', this.userId);
      } else {
        this.$store.dispatch('exerciseDocument/addToFavourites', this.userId);
      }
    },
    changeNoOfTestApplications() {
      this.$refs['modalChangeNoOfTestApplications'].openModal();
      this.$store.dispatch('exerciseDocument/testing');
    },
    async createTestApplications() {
      const noOfTestApplications = this.$store.getters['exerciseDocument/noOfTestApplications'];
      if (!noOfTestApplications) return;
      await httpsCallable(functions, 'createTestApplications')({ exerciseId: this.exerciseId, noOfTestApplications });
      this.$store.dispatch('exerciseDocument/tested');
      this.$store.dispatch('exerciseDocument/changeNoOfTestApplications', 0);
    },
    cancelChangeNoOfTestApplications() {
      this.$refs['modalChangeNoOfTestApplications'].closeModal();
      this.$store.dispatch('exerciseDocument/isReadyForTest');
    },
    confirmedNoOfTestApplications() {
      this.$refs['modalChangeNoOfTestApplications'].closeModal();
      this.$refs['createTestApplicationsBtn'].$el.click();
    },
  },
};
</script>
<style>
.govuk-heading-xl {
  margin-bottom: 0;
}
</style>
