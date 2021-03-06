<template>
  <div>
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Reasonable Adjustments Report
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
              @click="exportData()"
            >
              Export data
            </button>
            <button
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

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">
            Total applications
          </span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ reasonableAdjustments.totalCount }}
          </h2>
        </div>
      </div>
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">
            Reasonable adjustments requests
          </span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ reasonableAdjustments.candidates.length }}
          </h2>
        </div>
      </div>
    </div>

    <div
      v-if="reasonableAdjustments.candidates.length"
      class="govuk-grid-column-full"
    >
      <table class="govuk-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Name
            </th>
            <th
              scope="col"
              class="govuk-table__header"
            >
              Email
            </th>
            <th
              scope="col"
              class="govuk-table__header govuk-table__header--numeric"
            >
              Phone number
            </th>
            <th
              scope="col"
              class="govuk-table__header govuk-!-width-one-third"
            >
              Details
            </th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr
            v-for="candidate in reasonableAdjustments.candidates"
            :key="candidate.userId"
            class="govuk-table__row"
          >
            <td class="govuk-table__cell">
              {{ candidate.name }}
            </td>
            <td class="govuk-table__cell">
              <a
                :href="`mailto:${candidate.email}`"
                class="govuk-link govuk-link--no-visited-state"
                target="_blank"
              >
                {{ candidate.email }}
              </a>
            </td>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              {{ candidate.phone }}
            </td>
            <td class="govuk-table__cell">
              {{ candidate.adjustmentsDetails }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';

export default {
  data() {
    return {
      report: null,
      refreshingReport: false,
    };
  },
  computed: {
    ...mapState({
      exercise: state => state.exerciseDocument.record,
    }),
    ...mapGetters('applications', [
      'reasonableAdjustments',
    ]),
  },
  created() {
    this.$store.dispatch('applications/bind', { exerciseId: this.exercise.id, status: 'applied' });
    this.unsubscribe = firestore.doc(`exercises/${this.exercise.id}/reports/reasonableAdjustments`)
      .onSnapshot((snap) => {
        this.report = vuexfireSerialize(snap);
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
      await functions.httpsCallable('generateReasonableAdjustmentsReport')({ exerciseId: this.exercise.id });
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
      const title = 'Reasonable Adjustments Report';
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
