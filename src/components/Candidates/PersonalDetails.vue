<template>
  <div
    v-if="hasData"
    class="govuk-!-margin-top-9 "
  >
    <h2 class="govuk-heading-l">
      Personal details
      <span class="govuk-hint">
        Any changes made here will not update the details on the most recent application. 
        Please go to the Personal Details section to make the change.
      </span>
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Name
        </dt>
        <dd class="govuk-summary-list__value">
          <EditableField 
            :value="candidate.fullName"
            field="fullName"
            @changefield="changeUserDetails"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Email address
        </dt>
        <dd class="govuk-summary-list__value">
          <EditableField 
            :value="candidate.email"
            field="email"
            type="email"
            @changefield="changeUserDetails"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Phone number
        </dt>
        <dd class="govuk-summary-list__value">
          <EditableField 
            :value="candidate.phone"
            field="phone"
            @changefield="changeUserDetails"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Date of birth
        </dt>
        <dd class="govuk-summary-list__value">
          <EditableField 
            :value="candidate.dateOfBirth"
            field="dateOfBirth"
            type="date"
            @changefield="changeUserDetails"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          NI Number
        </dt>
        <dd class="govuk-summary-list__value">
          <EditableField 
            :value="candidate.nationalInsuranceNumber | formatNIN"
            field="nationalInsuranceNumber"
            @changefield="changeUserDetails"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Citizenship
        </dt>
        <dd class="govuk-summary-list__value">
          {{ candidate.citizenship | lookup }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Reasonable adjustments
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          {{ candidate.reasonableAdjustments | toYesNo }}
          <ul
            v-if="candidate.reasonableAdjustmentsDetails"
            class="govuk-list govuk-!-margin-top-1"
          >
            <li>
              {{ candidate.reasonableAdjustmentsDetails }}
            </li>
          </ul>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import EditableField from '@/components/EditableField';

export default {
  components: {
    EditableField,
  },
  props: {
    candidate: {
      type: Object,
      default: null,
      required: true,
    },
  },
  computed: {
    hasData() {
      return Object.keys(this.candidate).length > 0;
    },
  },
  methods: {
    changeUserDetails(personalDetails) {
      this.$emit('changedetails', { ...personalDetails });
    },
  },
};
</script>

<style>
  .editable-field {
    display: flex;
    flex-direction: row;
  }

  .editable-field .change-link {
    margin-left: auto;
  }
</style>
