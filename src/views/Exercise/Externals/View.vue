<template>
  <div>
    <div>
      <h2 class="govuk-heading-l">
        External Vacancy
      </h2>
      <div class="text-right">
        <router-link
          v-if="isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
          class="govuk-link"
          :to="{name: 'exercise-external-edit'}"
        >
          Update
        </router-link>
      </div>
    </div>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Name
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.name }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Open date
        </dt>
        <dd
          v-if="exercise.applicationOpenDate"
          class="govuk-summary-list__value"
        >
          {{ $filters.formatEstimatedDate(exercise.applicationOpenDate) }}
        </dd>
        <dd
          v-else
          class="govuk-summary-list__value"
        >
          TBC
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Close date
        </dt>
        <dd
          v-if="exercise.applicationCloseDate"
          class="govuk-summary-list__value"
        >
          {{ $filters.formatEstimatedDate(exercise.applicationCloseDate) }}
        </dd>
        <dd
          v-else
          class="govuk-summary-list__value"
        >
          TBC
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Subscriber alerts url
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.subscriberAlertsUrl }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Contact
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.exerciseMailbox }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Are there Welsh posts?
        </dt>
        <dd class="govuk-summary-list__value">
          {{ $filters.toYesNo(exercise.welshPosts) }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Brief Overview
        </dt>
        <dd class="govuk-summary-list__value">
          <CustomHTML
            class="govuk-body"
            :value="exercise.roleSummary"
          />
        </dd>
      </div>

      <div
        v-if="exercise.welshPosts"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Brief Overview(Welsh)
        </dt>
        <dd class="govuk-summary-list__value">
          <CustomHTML
            class="govuk-body"
            :value="exercise.roleSummaryWelsh"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          About the role
        </dt>
        <dd class="govuk-summary-list__value">
          <CustomHTML
            class="govuk-body"
            :value="exercise.aboutTheRole"
          />
        </dd>
      </div>

      <div
        v-if="exercise.welshPosts"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          About the role (Welsh)
        </dt>
        <dd class="govuk-summary-list__value">
          <CustomHTML
            class="govuk-body"
            :value="exercise.aboutTheRoleWelsh"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Advert type
        </dt>
        <dd class="govuk-summary-list__value editable-field">
          <span>
            {{ $filters.lookup(exercise.advertType) }}
          </span>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Appointment type
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.appointmentType == 'salaried'">
            {{ $filters.lookup(exercise.appointmentType) }}:
            <span v-if="exercise.salaryGrouping">{{ $filters.lookup(exercise.salaryGrouping) }}</span>
            <span v-if="exercise.salary">{{ $filters.formatCurrency(exercise.salary) }}</span>
          </span>
          <span v-else-if="exercise.appointmentType == 'fee-paid'">{{ $filters.lookup(exercise.appointmentType) }}: £{{ exercise.feePaidFee }}</span>
          <span v-else-if="exercise.appointmentType">{{ $filters.lookup(exercise.appointmentType) }}</span>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Location
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.location }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Number of vacancies
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li v-if="exercise.immediateStart > 0">
              {{ exercise.immediateStart }} Immediate start (S87)
            </li>
            <li v-if="exercise.futureStart > 0">
              {{ exercise.futureStart }} Future start (S94)
            </li>
          </ul>
        </dd>
      </div>

      <h2 class="govuk-heading-l govuk-!-margin-top-4">
        Downloads
      </h2>
      <p
        v-if="!exercise.downloads"
        class="govuk-body"
      >
        No files uploaded.
      </p>
      <dl
        v-else
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Job Description
          </dt>
          <dd class="govuk-summary-list__value">
            <span v-if="!exercise.downloads.jobDescriptions.length">
              No files uploaded
            </span>
            <ul class="govuk-list">
              <li
                v-for="file in exercise.downloads.jobDescriptions"
                :key="file.file"
              >
                <DownloadLink
                  :file-name="file.file"
                  :title="file.title"
                  :exercise-id="exerciseId"
                />
              </li>
            </ul>
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Terms and Conditions
          </dt>
          <dd class="govuk-summary-list__value">
            <span v-if="!exercise.downloads.termsAndConditions.length">
              No files uploaded
            </span>
            <ul class="govuk-list">
              <li
                v-for="file in exercise.downloads.termsAndConditions"
                :key="file.file"
              >
                <DownloadLink
                  :file-name="file.file"
                  :title="file.title"
                  :exercise-id="exerciseId"
                />
              </li>
            </ul>
          </dd>
        </div>
        <div
          v-if="hasIndependentAssessments"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Independent Assessors
          </dt>
          <dd class="govuk-summary-list__value">
            <span v-if="!exercise.downloads.independentAssessors.length">
              No files uploaded
            </span>
            <ul class="govuk-list">
              <li
                v-for="file in exercise.downloads.independentAssessors"
                :key="file.file"
              >
                <DownloadLink
                  :file-name="file.file"
                  :title="file.title"
                  :exercise-id="exerciseId"
                />
              </li>
            </ul>
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Candidate Assessment
          </dt>
          <dd class="govuk-summary-list__value">
            <span v-if="!exercise.downloads.candidateAssessementForms.length">
              No files uploaded
            </span>
            <ul class="govuk-list">
              <li
                v-for="file in exercise.downloads.candidateAssessementForms"
                :key="file.file"
              >
                <DownloadLink
                  :file-name="file.file"
                  :title="file.title"
                  :exercise-id="exerciseId"
                />
              </li>
            </ul>
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Pensions Information
          </dt>
          <dd class="govuk-summary-list__value">
            <span v-if="!showPensionsInformation">
              No files uploaded
            </span>
            <ul class="govuk-list">
              <li
                v-for="file in exercise.downloads.pensionsInformation"
                :key="file.file"
              >
                <DownloadLink
                  :file-name="file.file"
                  :title="file.title"
                  :exercise-id="exerciseId"
                />
              </li>
            </ul>
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Skills and Abilities Criteria
          </dt>
          <dd class="govuk-summary-list__value">
            <span v-if="!showSkillsAndAbilitiesCriteria">
              No files uploaded
            </span>
            <ul class="govuk-list">
              <li
                v-for="file in exercise.downloads.skillsAndAbilitiesCriteria"
                :key="file.file"
              >
                <DownloadLink
                  :file-name="file.file"
                  :title="file.title"
                  :exercise-id="exerciseId"
                />
              </li>
            </ul>
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Competency Framework
          </dt>
          <dd class="govuk-summary-list__value">
            <span v-if="!showCompetencyFramework">
              No files uploaded
            </span>
            <ul class="govuk-list">
              <li
                v-for="file in exercise.downloads.competencyFramework"
                :key="file.file"
              >
                <DownloadLink
                  :file-name="file.file"
                  :title="file.title"
                  :exercise-id="exerciseId"
                />
              </li>
            </ul>
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Welsh Translation
          </dt>
          <dd class="govuk-summary-list__value">
            <span v-if="!showWelshTranslation">
              No files uploaded
            </span>
            <ul class="govuk-list">
              <li
                v-for="file in exercise.downloads.welshTranslation"
                :key="file.file"
              >
                <DownloadLink
                  :file-name="file.file"
                  :title="file.title"
                  :exercise-id="exerciseId"
                />
              </li>
            </ul>
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Statutory Consultation Guidance Letter
          </dt>
          <dd class="govuk-summary-list__value">
            <span v-if="!showStatutoryConsultationGuidanceLetter">
              No files uploaded
            </span>
            <ul class="govuk-list">
              <li
                v-for="file in exercise.downloads.statutoryConsultationGuidanceLetter"
                :key="file.file"
              >
                <DownloadLink
                  :file-name="file.file"
                  :title="file.title"
                  :exercise-id="exerciseId"
                />
              </li>
            </ul>
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Other Downloads
          </dt>
          <dd class="govuk-summary-list__value">
            <ul
              v-if="hasOtherDownloads"
              class="govuk-list"
            >
              <li
                v-for="file in exercise.downloads.otherDownloads"
                :key="file.file"
              >
                <DownloadLink
                  :file-name="file.file"
                  :title="file.title"
                  :exercise-id="exerciseId"
                />
              </li>
            </ul>
            <span v-else>
              No files uploaded
            </span>
          </dd>
        </div>
      </dl>
    </dl>

    <button
      v-if="!isPublished && hasPermissions([
        PERMISSIONS.exercises.permissions.canUpdateExercises.value
      ])"
      :disabled="!canPublish"
      class="govuk-button govuk-button--secondary"
      @click="publish"
    >
      Publish on website
    </button>
    <button
      v-if="isPublished && hasPermissions([
        PERMISSIONS.exercises.permissions.canUpdateExercises.value
      ])"
      class="govuk-button govuk-button--secondary"
      @click="unPublish"
    >
      Remove from apply website
    </button>
    <Modal
      ref="modalChangeExerciseAdvertType"
    >
      <ChangeExerciseAdvertType
        :advert-type="exercise.advertType"
        @close="$refs['modalChangeExerciseAdvertType'].closeModal()"
      />
    </Modal>
    <ListingPreview
      class="govuk-!-margin-bottom-4"
      :exercise="exercise"
    />
    <DetailPreview
      v-if="advertType !== 'listing'"
      :exercise="exercise"
    />
  </div>
</template>

<script>
import { logEvent } from '@/helpers/logEvent';
import { isEditable, isArchived } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ChangeExerciseAdvertType from '@/components/ModalViews/ChangeExerciseAdvertType.vue';
import { ADVERT_TYPES } from '@/helpers/constants';
import CustomHTML from '@/components/CustomHTML.vue';
import ListingPreview from '@/components/Previews/ListingPreview.vue';
import DetailPreview from '@/components/Previews/DetailPreview.vue';
import exerciseMixin from '@/views/Exercise/exerciseMixin.js';
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink.vue';
import { hasIndependentAssessments } from '@/helpers/exerciseHelper';

export default {
  name: 'SummaryView',
  components: {
    Modal,
    ChangeExerciseAdvertType,
    CustomHTML,
    ListingPreview,
    DetailPreview,
    DownloadLink,
  },
  mixins: [permissionMixin, exerciseMixin],
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isEditable() {
      return isEditable(this.exercise);
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    isPublished() {
      return this.exercise.published;
    },
    isArchived() {
      return isArchived(this.exercise);
    },
    canPublish() {
      return this.exercise.progress && this.exercise.progress.vacancySummary && !this.isArchived;
    },
    hasIndependentAssessments() {
      return hasIndependentAssessments(this.exercise);
    },
    showPensionsInformation() {
      if (
        this.exercise &&
        this.exercise.downloads &&
        this.exercise.downloads.pensionsInformation &&
        this.exercise.downloads.pensionsInformation.length
      ) {
        return true;
      } else {
        return false;
      }
    },
    showCompetencyFramework() {
      if (
        this.exercise &&
        this.exercise.downloads &&
        this.exercise.downloads.competencyFramework &&
        this.exercise.downloads.competencyFramework.length
      ) {
        return true;
      } else {
        return false;
      }
    },
    showSkillsAndAbilitiesCriteria() {
      if (
        this.exercise &&
        this.exercise.downloads &&
        this.exercise.downloads.skillsAndAbilitiesCriteria &&
        this.exercise.downloads.skillsAndAbilitiesCriteria.length
      ) {
        return true;
      } else {
        return false;
      }
    },
    showWelshTranslation() {
      if (
        this.exercise &&
        this.exercise.downloads &&
        this.exercise.downloads.welshTranslation &&
        this.exercise.downloads.welshTranslation.length
      ) {
        return true;
      } else {
        return false;
      }
    },
    showStatutoryConsultationGuidanceLetter() {
      if (
        this.exercise &&
        this.exercise.downloads &&
        this.exercise.downloads.statutoryConsultationGuidanceLetter &&
        this.exercise.downloads.statutoryConsultationGuidanceLetter.length
      ) {
        return true;
      } else {
        return false;
      }
    },
    hasOtherDownloads() {
      if (
        this.exercise &&
        this.exercise.downloads &&
        this.exercise.downloads.otherDownloads &&
        this.exercise.downloads.otherDownloads.length
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    isAdvertTypeListing(value) {
      const returnValue = value && value === ADVERT_TYPES.LISTING;
      return returnValue;
    },
    async publish() {
      await this.$store.dispatch('exerciseDocument/publish');
      logEvent('info', 'Exercise published', {
        exerciseId: this.exerciseId,
        exerciseRef: this.exercise.referenceNumber,
      });
    },
    async unPublish() {
      await this.$store.dispatch('exerciseDocument/unpublish');
      logEvent('info', 'Exercise unpublished', {
        exerciseId: this.exerciseId,
        exerciseRef: this.exercise.referenceNumber,
      });
    },
    changeAdvertType() {
      this.$refs['modalChangeExerciseAdvertType'].openModal();
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.govuk-summary-list__value,
.govuk-summary-list__value:last-child,
.govuk-summary-list__key {
  @include govuk-media-query($from: tablet) {
    width: auto;
  }
}
.editable-field {
  display: flex;
  justify-content: space-between;
}
.capitalize {
  text-transform: capitalize;
}
.govuk-link {
  cursor: pointer;
}
</style>
