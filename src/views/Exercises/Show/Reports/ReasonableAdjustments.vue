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
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';

export default {
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
  },
  methods: {
    gatherReportData() {
      const headers = [
        'Name',
        'Email',
        'Phone number',
        'Details',
      ];

      const data = this.reasonableAdjustments.candidates.map(candidate => [
        candidate.name,
        candidate.email,
        candidate.phone,
        candidate.adjustmentsDetails,
      ]);
      return [
        headers,
        ...data,
      ];
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
