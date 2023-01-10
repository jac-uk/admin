<template>
  <div class="govuk-grid-column-full">
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Statutory Consultation
        </h2>
      </div>

      <div
        class="moj-page-header-actions__actions float-right"
      >
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              :disabled="!hasReportData"
              @click="exportData()"
            >
              Export data
            </button>
            <button
              v-if="hasPermissions([
                PERMISSIONS.applications.permissions.canReadApplications.value,
                PERMISSIONS.exercises.permissions.canReadExercises.value
              ])"
              class="govuk-button moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              @click="refreshReport"
            >
              <span
                v-if="refreshingReport"
                class="spinner-border spinner-border-sm"
              /> Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-grid-column-two-thirds clearfix">
      <div class="govuk-button-group">
        <Select
          id="exercise-stage"
          v-model="exerciseStage"
          class="govuk-!-margin-right-2"
        >
          <option value="all">
            All applications
          </option>
          <option
            v-if="applicationRecordCounts.review"
            value="review"
          >
            Review
          </option>
          <option
            v-if="applicationRecordCounts.shortlisted"
            value="shortlisted"
          >
            Shortlisted
          </option>
          <option
            v-if="applicationRecordCounts.selected"
            value="selected"
          >
            Selected
          </option>
          <option
            v-if="applicationRecordCounts.recommended"
            value="recommended"
          >
            Recommended
          </option>
          <option
            v-if="applicationRecordCounts.handover"
            value="handover"
          >
            Handover
          </option>
        </Select>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import permissionMixin from '@/permissionMixin';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import { applicationRecordCounts } from '@/helpers/exerciseHelper';

export default {
  name: 'StatutoryConsultation',
  components: {
    Select,
  },
  mixins: [permissionMixin],
  data() {
    return {
      exerciseStage: 'all',
      report: null,
      refreshingReport: false,
    };
  },
  computed: {
    ...mapState({
      exercise: state => state.exerciseDocument.record,
    }),
    applicationRecordCounts() {
      return applicationRecordCounts(this.exercise);
    },
    hasReportData() {
      return this.report && this.report.headers;
    },
  },
  created() {
    this.unsubscribe = firestore.doc(`exercises/${this.exercise.id}/reports/statutoryConsultation`)
      .onSnapshot((snap) => {
        if (snap.exists) {
          this.report = vuexfireSerialize(snap);
        }
      });
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async refreshReport() {
      this.refreshingReport = true;
      try {
        await functions.httpsCallable('generateStatutoryConsultationReport')({ exerciseId: this.exercise.id });
      } catch (error) {
        console.error(error);
      }
      this.refreshingReport = false;
    },
    gatherReportData() {
      const reportData = [];
      // get headers
      reportData.push(this.report.headers.map(header => header.title));
      // get rows
      this.report.rows.forEach((row) => {
        reportData.push(this.report.headers.map(header => row[header.ref]));
      });

      return reportData;
    },
    exportData() {
      const title = 'Statutory Consultation Report';
      const data = this.gatherReportData();
      downloadXLSX(
        data,
        {
          title: `${this.exercise.referenceNumber} ${title}`,
          sheetName: title,
          fileName: `${this.exercise.referenceNumber} - ${title}.xlsx`,
        }
      );
    },
  },
};
</script>
