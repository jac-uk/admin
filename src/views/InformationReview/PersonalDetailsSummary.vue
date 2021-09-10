<template>
  <div class="govuk-!-margin-bottom-4">
    <h2 class="govuk-heading-l">
      Personal details
      <span class="govuk-hint print-none">
        Any changes made here will also update the candidate information.
      </span>
    </h2>
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Title
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :application-id="application.userId"
            :value="application.personalDetails.title"
            field="title"
            :edit="editable"
            :data="application.personalDetails.title"
            @changeField="changeUserDetails"
          />
        </dd>
      </div>
    </dl>
    
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          First name
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :edit="editable"
            :application-id="application.userId"
            :value="application.personalDetails.firstName"
            :data="application.personalDetails.firstName"
            field="firstName"
            @changeField="changeUserDetails"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Last name
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :edit="editable"
            :application-id="application.userId"
            :value="application.personalDetails.lastName"
            :data="application.personalDetails.lastName"
            field="lastName"
            @changeField="changeUserDetails"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Email address
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :edit="editable"
            :application-id="application.userId"
            :value="application.personalDetails.email"
            :data="application.personalDetails.email"
            field="email"
            @changeField="changeUserDetails"
          />
        </dd>
      </div>
    </dl>
    
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Phone number
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :edit="editable"
            :value="application.personalDetails.phone"
            :data="application.personalDetails.phone"
            field="phone"
            @changeField="changeUserDetails"
          />
        </dd>
      </div>
    </dl>
    
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Date of birth
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :edit="editable"
            :value="application.personalDetails.dateOfBirth"
            :data="application.personalDetails.dateOfBirth"
            type="date"
            field="dateOfBirth"
            @changeField="changeUserDetails"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          NI Number
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :edit="editable"
            :value="application.personalDetails.nationalInsuranceNumber | formatNIN"
            :data="application.personalDetails.nationalInsuranceNumber | formatNIN"
            field="nationalInsuranceNumber"
            @changeField="changeUserDetails"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Citizenship
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :edit="editable"
            :value="application.personalDetails.citizenship"
            :data="application.personalDetails.citizenship"
            :options="['uk','republic-of-ireland','another-commonwealth-country','other']"
            type="selection"
            field="citizenship"
            @changeField="changeUserDetails"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row ">
        <dt :class="requiredStyle">
          Reasonable adjustments
        </dt>

        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :edit="editable"
            :value="application.personalDetails.reasonableAdjustments"
            :data="application.personalDetails.reasonableAdjustments"
            :options="[true, false]"
            type="selection"
            field="reasonableAdjustments"
            @changeField="changeUserDetails"
          />
        </dd>
      </div>
    </dl>
  
    <dl 
      v-if="application.personalDetails.reasonableAdjustments === true"
      class="govuk-summary-list govuk-!-margin-bottom-0"
    >
      <div 
        class="govuk-summary-list__row "
      >
        <dt :class="requiredStyle">
          Reasonable Adjustments Details
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :edit="editable"
            :value="application.personalDetails.reasonableAdjustmentsDetails"
            :data="application.personalDetails.reasonableAdjustmentsDetails"
            field="reasonableAdjustmentsDetails"
            @changeField="changeUserDetails"
          />
        </dd> 
      </div>
    </dl>
  </div> 
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';

export default {
  name: 'PersonalDetailsSummary',
  components: {
    InformationReviewRenderer,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    requiredWiderColumn: {
      type: Boolean,
      required: false,
      default: true,
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  computed: {
    requiredStyle() {
      return this.requiredWiderColumn ? 'govuk-summary-list__key widerColumn' : 'govuk-summary-list__key';
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
  },
  methods: {
    makeFullName(obj) {
      if (obj.firstName && this.application.personalDetails.lastName) {
        obj.fullName = `${obj.firstName} ${this.application.personalDetails.lastName}`;
      }
      if (obj.lastName && this.application.personalDetails.firstName) {
        obj.fullName = `${this.application.personalDetails.firstName} ${obj.lastName}`;
      }
      return obj;
    },
    changeUserDetails(obj) {
      if (obj.firstName || obj.lastName) {
        obj = this.makeFullName(obj);
      }
      const myPersonalDetails = { ...this.application.personalDetails, ...obj };
      this.$store.dispatch('application/update', { data: { personalDetails: myPersonalDetails }, id: this.applicationId });
      this.$store.dispatch('candidates/savePersonalDetails', { data: obj, id: this.application.userId });
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>

