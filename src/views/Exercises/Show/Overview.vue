<template>
  <div>
    <div class="govuk-grid-column-one-half">
      <div class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3">
        <h2 class="govuk-heading-l">
          Number of vacancies
        </h2>
        <p class="govuk-body">
          Immediate start (S87) 
          <span 
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >{{ exercise.immediateStart }}</span>
        </p>
      </div>

      <div class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3">
        <h2 class="govuk-heading-l">
          Number of applications
        </h2>
        <p class="govuk-body">
          <span class="govuk-heading-l govuk-!-margin-top-1">0</span>
        </p>
      </div>
    </div>

    <div class="govuk-grid-column-one-half">
      <div class="background-blue govuk-!-margin-bottom-6 govuk-!-padding-3">
        <span class="display-block govuk-!-font-size-27">Pre launch</span>
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
import createTimeline from '@/helpers/Timeline/createTimeline';
import exerciseTimeline from '@/helpers/Timeline/exerciseTimeline';

export default {
  components: {
    Timeline,
  },
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    timeline() {
      let timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline, 2);
    },
  },
};
</script>
