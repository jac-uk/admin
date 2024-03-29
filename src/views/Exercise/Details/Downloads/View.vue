<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
        class="govuk-link"
        :to="{name: 'exercise-details-downloads-edit'}"
      >
        Update downloads
      </router-link>
    </div>
    <h2 class="govuk-heading-l">
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
  </div>
</template>

<script>
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink.vue';
import { mapState } from 'vuex';
import { isEditable, hasIndependentAssessments } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'DownloadsView',
  components: {
    DownloadLink,
  },
  mixins: [permissionMixin],
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
    }),
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseId() {
      return this.exercise.id;
    },
    isEditable() {
      return isEditable(this.exercise);
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
};
</script>
