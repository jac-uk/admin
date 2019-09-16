<template>
  <div>
    <div class="govuk-grid-column-one-half">
      <div class="grey govuk-!-margin-bottom-3">
        <h2 class="govuk-heading-l">
          Number of vacancies
        </h2>
        <p class="govuk-body">
          Immediate start (S87) 
          <span 
            class="block govuk-heading-l govuk-!-margin-top-1"
          >{{ exercise.immediateStart }}</span>
        </p>
      </div>

      <div class="grey govuk-!-margin-bottom-3">
        <h2 class="govuk-heading-l">
          Number of applications
        </h2>
        <p class="govuk-body">
          <span class="govuk-heading-l govuk-!-margin-top-1">0</span>
        </p>
      </div>
    </div>

    <div class="govuk-grid-column-one-half">
      <div class="highlight govuk-!-margin-bottom-6">
        <span class="block govuk-!-font-size-27">Pre launch</span>
      </div>
      <Timeline :data="timeline" />
      <a
        href="#"
        class="govuk-link"
      >View timeline</a>
    </div>

    <div class="govuk-grid-column-full govuk-!-margin-top-5 govuk-!-margin-bottom-2">
      <h2 class="govuk-heading-m">
        Task list
      </h2>
      <table class="govuk-table">
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Name of exercise
            </th>
            <td class="govuk-table__cell text-right">
              <a
                href="#"
                class="govuk-link"
              >Change</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Timeline from '@/components/Page/Timeline';
export default {
  components: {
    Timeline,
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    timeline() {
      return [
        { 'entry': 'Open for applications', 'date': this.exercise.applicationOpenDate },
        { 'entry': 'Closed for applications', 'date': this.exercise.applicationCloseDate },
      ];
    },
  },
};
</script>
