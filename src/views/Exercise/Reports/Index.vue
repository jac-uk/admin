<template>
  <div>
    <h2 class="govuk-heading-l">
      Reports
    </h2>

    <ul class="govuk-list">
      <!--
      <li class="govuk-!-margin-bottom-4">
        <router-link
          class="govuk-link govuk-body-l"
          :to="{name: 'exercise-reports-character-checks'}"
        >
          Character checks
        </router-link>
      </li> -->

      <li class="govuk-!-margin-bottom-4">
        <router-link
          class="govuk-link govuk-body-l"
          :to="{name: 'exercise-show-report-character-issues'}"
        >
          Character Issues
        </router-link>
      </li>

      <li class="govuk-!-margin-bottom-4">
        <router-link
          class="govuk-link govuk-body-l"
          :to="{name: 'exercise-show-report-diversity'}"
        >
          Diversity Report
        </router-link>
      </li>

      <li class="govuk-!-margin-bottom-4">
        <router-link
          class="govuk-link govuk-body-l"
          :to="{name: 'exercise-show-report-eligibility-issues'}"
        >
          Eligibility Issues
        </router-link>
      </li>

      <!-- 
      <li class="govuk-!-margin-bottom-4">
        <router-link
          class="govuk-link govuk-body-l"
          :to="{name: 'exercise-reports-education-and-career-history'}"
        >
          Education and career history
        </router-link>
      </li>

      <li class="govuk-!-margin-bottom-4">
        <router-link
          class="govuk-link govuk-body-l"
          :to="{name: 'exercise-reports-jo-handover-report'}"
        >
          JO Handover report
        </router-link>
      </li>

      <li class="govuk-!-margin-bottom-4">
        <router-link
          class="govuk-link govuk-body-l"
          :to="{name: ''}"
        >
          Panel packs
        </router-link>
      </li>

      <li class="govuk-!-margin-bottom-4">
        <router-link
          class="govuk-link govuk-body-l"
          :to="{name: 'exercise-reports-statutory-consultation-table'}"
        >
          Statutory Consulation table
        </router-link>
      </li>
      -->
      <li class="govuk-!-margin-bottom-4">
        <router-link
          class="govuk-link govuk-body-l"
          :to="{name: 'exercise-show-report-reasonable-adjustments'}"
        >
          Reasonable Adjustments
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {

};
</script>
