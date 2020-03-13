<template>
  <div>
    <div class="govuk-grid-row">
      <h1 class="govuk-heading-l">
        Reasonable Adjustments Report
      </h1>

      <p class="govuk-body">
        Total applications: <b>{{ reasonableAdjustments.totalCount }}</b>
      </p>

      <p class="govuk-body">
        Candidates requesting reasonable adjustments: <b>{{ reasonableAdjustments.candidates.length }}</b>
      </p>

      <div
        v-if="reasonableAdjustments.candidates.length"
        class="govuk-grid-column-full"
      >
        <table class="govuk-table table-with-border">
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
                class="govuk-table__header govuk-!-width-one-quarter"
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

        <button
          :disabled="true"
          class="govuk-button"
        >
          Export Data
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

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
};
</script>

<style lang="scss" scoped>

  .table-with-border {
    td, th {
      border-style: solid;
      border-width: 2px;
      border-color: black;
      padding-left: 6px;
      padding-right: 6px;
    }
    .govuk-table__header--numeric,
    .govuk-table__cell--numeric {
      padding-right: 6px;
    }
  }

</style>
