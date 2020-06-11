<template>
  <div
    class="govuk-!-margin-top-9 "
    v-if="Object.keys(data).length > 0"
  >
    <h2 class="govuk-heading-l">
      Personal details
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Name
        </dt>
        <dd class="govuk-summary-list__value">
          {{ data.fullName }} 
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Email address
        </dt>
        <dd class="govuk-summary-list__value">
          <a
            :href="`mailto:${data.email}`"
            class="govuk-link govuk-link--no-visited-state"
            target="_blank"
          >
            {{ data.email }}
          </a>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Phone number
        </dt>
        <dd class="govuk-summary-list__value">
          {{ data.phone }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Date of birth
        </dt>
        <dd class="govuk-summary-list__value">
          <p v-if="data.dateOfBirth">
            {{ data.dateOfBirth | formatDate }}
          </p>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          NI Number
        </dt>
        <dd class="govuk-summary-list__value">
          {{ data.nationalInsuranceNumber | formatNIN }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Citizenship
        </dt>
        <dd class="govuk-summary-list__value">
          {{ data.citizenship | lookup }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Reasonable adjustments
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          {{ data.reasonableAdjustments | toYesNo }}
          <ul
            v-if="data.reasonableAdjustmentsDetails"
            class="govuk-list govuk-!-margin-top-1"
          >
            <li>
              {{ data.reasonableAdjustmentsDetails }}
            </li>
          </ul>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>

export default {
  props: {
    data: {
      type: Object,
      default: null,
      required: true,
    },
  },
};
</script>
