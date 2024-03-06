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
      <div class="govuk-grid-row govuk-!-margin-top-4">
        <div
          class="govuk-grid-column-full"
          style="display: flex; justify-content: space-between; align-items: center;"
        >
          <div>
            <span
              v-show="isInFavourites"
              class="favourite-tag govuk-tag--yellow govuk-!-margin-right-3"
              style="display: inline-block; padding: 5px 8px 4px 8px; font-weight: 700; font-size: 16px; line-height: 16px; letter-spacing: 1px;"
            >
              FAVOURITE
            </span>
            <a
              href="#"
              class="govuk-link print-none"
              @click.prevent="updateFavourites"
            >
              {{ isInFavourites ? 'Remove from favourite' : 'Add to favourite' }}
            </a>
          </div>
          <div class="print-none govuk-!-margin-0">
            <ActionButton
              v-if="canUpdateExercises && isApproved"
              class="govuk-!-margin-bottom-0"
              :action="copyToClipboard"
            >
              Copy to clipboard
            </ActionButton>
            <button
              v-if="canArchiveExercises"
              class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0 govuk-!-margin-left-3"
              @click="openArchiveModal"
            >
              {{ isArchived ? 'Unarchive exercise' : 'Archive exercise' }}
            </button>
          </div>
        </div>
      </div>
      <div class="title-bar-exercise govuk-grid-row clearfix govuk-!-margin-top-4 govuk-!-margin-bottom-2">
        <div class="govuk-grid-column-full">
          <span class="govuk-caption-xl">
            {{ exercise.referenceNumber }}
          </span>
          <h1 class="govuk-heading-xl govuk-!-margin-bottom-0">
            {{ exerciseName }}
          </h1>
          <router-link
            v-if="!isAdvertTypeExternal && !hasJourney && isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
            class="govuk-link govuk-!-margin-right-4 print-none"
            :to="{name: 'exercise-edit-name'}"
          >
            Edit name
          </router-link>
          <router-link
            v-if="canEditExerciseConfiguration"
            class="govuk-link print-none"
            :to="{name: 'exercise-configuration-application-version'}"
          >
            Configuration
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
          <SubNavigation
            v-if="!isAdvertTypeExternal && !hasJourney && subNavigation.length > 1"
            :pages="subNavigation"
          />
        </div>
      </div>
      <RouterView />

      <Modal ref="archiveModal">
        <ModalInner
          :title="archiveTitle"
          :message="archiveMessage"
          :button-text="archiveButtonText"
          @close="closeArchiveModal"
          @confirmed="archive"
        />
      </Modal>
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
import { httpsCallable } from '@firebase/functions';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage.vue';
import SubNavigation from '@/components/Navigation/SubNavigation.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import ChangeNoOfTestApplications from '@/components/ModalViews/ChangeNoOfTestApplications.vue';
import { mapState } from 'vuex';
import { isEditable, hasQualifyingTests, isProcessing, applicationCounts, isApproved, isArchived } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { logEvent } from '@/helpers/logEvent';
import { functions } from '@/firebase';
import { ADVERT_TYPES } from '../helpers/constants';

export default {
  name: 'ExerciseView',
  components: {
    LoadingMessage,
    SubNavigation,
    Modal,
    ModalInner,
    ActionButton,
    ChangeNoOfTestApplications,
  },
  mixins: [permissionMixin],
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
      return true;
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
    archiveTitle() {
      if (this.isArchived) {
        return 'Unarchive exercise';
      } else {
        return 'Archive exercise';
      }
    },
    archiveMessage() {
      if (this.isArchived) {
        return 'By clicking accept you authorise the exercise to be unarchived';
      } else if (this.isPublished) {
        return 'This exercise is Live on Apply; by clicking accept, you authorise the exercise to be removed from Apply and archived';
      } else {
        return 'By clicking accept you authorise the exercise to be archived';
      }
    },
    archiveButtonText() {
      if (this.isArchived) {
        return 'Accept - unarchive this exercise';
      } else {
        return 'Accept - archive this exercise';
      }
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
    subNavigation() {
      if (!this.exercise) { return []; }
      const path = `/exercise/${this.exercise.id}`;
      const subNavigation = [];
      if (this.applicationCounts._total) {
        subNavigation.push({ path: `${path}/dashboard`, title: 'Dashboard' });
      }
      subNavigation.push({ path: `${path}/details`, title: 'Exercise' });
      if ((this.exercise.applications || this.hasOpened) && this.hasPermissions([this.PERMISSIONS.applications.permissions.canReadApplications.value])) {
        subNavigation.push({ path: `${path}/applications`, title: 'Applications' });
      }
      if (this.isProcessing) {
        subNavigation.push({ path: `${path}/tasks/all`, title: 'Tasks' });
        subNavigation.push({ path: `${path}/stages`, title: 'Stages' });
        subNavigation.push({ path: `${path}/reports`, title: 'Reports' });
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
    async copyToClipboard() {
      try {
        const exercise = await this.$store.dispatch('exerciseDocument/getDocumentData', this.exerciseId);
        await this.$store.dispatch('clipboard/write', {
          environment: this.$store.getters.appEnvironment,
          type: 'exercise',
          title: `${exercise.referenceNumber} ${exercise.name}`,
          content: exercise,
        });
        return true;
      } catch (error) {
        return;
      }
    },
    openArchiveModal() {
      this.$refs.archiveModal.openModal();
    },
    closeArchiveModal() {
      this.$refs.archiveModal.closeModal();
    },
    archive() {
      if (this.isArchived) {
        this.$store.dispatch('exerciseDocument/unarchive');
        logEvent('info', 'Exercise unarchived', {
          exerciseId: this.exerciseId,
          exerciseRef: this.exercise.referenceNumber,
        });
      } else {
        this.$store.dispatch('exerciseDocument/archive');
        logEvent('info', 'Exercise archived', {
          exerciseId: this.exerciseId,
          exerciseRef: this.exercise.referenceNumber,
        });
      }
      this.$refs.archiveModal.closeModal();
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
