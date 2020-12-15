<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
        class="govuk-link"
        :to="{name: 'exercise-edit-downloads'}"
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
      <div class="govuk-summary-list__row">
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
    </dl>
  </div>
</template>

<script>
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    DownloadLink,
  },
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
    }),
    ...mapGetters('exerciseDocument', {
      exerciseId: 'id',
      //exercise: 'record',
      isEditable: 'isEditable',
    }),
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
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
  },
};
</script>
