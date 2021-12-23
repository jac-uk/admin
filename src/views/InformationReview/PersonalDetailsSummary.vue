<template>
  <div class="govuk-!-margin-bottom-4">
    <div class="govuk-!-margin-bottom-4">
      <h2 class="govuk-heading-l govuk-!-padding-top-6">
        Personal details 
        <span
          v-if="!isCandidateView"
          class="govuk-hint print-none"
        >
          <!-- vv this isnt true at the moment vv -->
          <!-- Any changes made here will also update the candidate information.  --> 
          <!-- ^^ this isnt true at the moment ^^ have updated the line below describe fucntionaility -->
          Any changes made here will only update the application information.
        </span>
        <span
          v-else
          class="govuk-hint"
        >
          Any changes made here will not update the details on the most recent application.
          Please go to the Application to make the change.
        </span>
      </h2>
      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Title
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :application-id="userId"
              field="title"
              :edit="editable"
              type="route"
              :data="hasPersonalDetails ? personalDetails.title : ''"
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
              :application-id="userId"
              :data="personalDetails.firstName || ''"
              type="route"
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
              :application-id="userId"
              :data="personalDetails.lastName || ''"
              type="route"
              field="lastName"
              @changeField="changeUserDetails"
            />
          </dd>
        </div>
      </dl>

      <dl
        v-if="!(personalDetails.lastName || personalDetails.firstName) && personalDetails.fullName && !editable"
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <div class="govuk-summary-list__row">
          <dt :class="requiredStyle">
            Full name
          </dt>
          <dd class="govuk-summary-list__value">
            {{ personalDetails.fullName }}
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
              :application-id="userId"
              :data="hasPersonalDetails ? personalDetails.email : ''"
              type="route"
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
              :data="hasPersonalDetails ? personalDetails.phone : ''"
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
              :data="hasPersonalDetails ? personalDetails.dateOfBirth : ''"
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
              :data="(hasPersonalDetails ? personalDetails.nationalInsuranceNumber: '') | formatNIN "
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
              :data="hasPersonalDetails ? personalDetails.citizenship : ''"
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
              :data="hasPersonalDetails ? personalDetails.reasonableAdjustments : ''"
              :options="[true, false]"
              type="selection"
              field="reasonableAdjustments"
              @changeField="changeUserDetails"
            />
          </dd>
        </div>
      </dl>
  
      <dl 
        v-if="personalDetails && personalDetails.reasonableAdjustments === true"
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
              :data="hasPersonalDetails ? personalDetails.reasonableAdjustmentsDetails : ''"
              field="reasonableAdjustmentsDetails"
              @changeField="changeUserDetails"
            />
          </dd> 
        </div>
      </dl>
    </div> 
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
    userId: {
      type: String,
      required: false,
      default: () => '',
    },
    personalDetails: {
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
  data() {
    return {
      hasPersonalDetails: !!this.personalDetails,
    };
  },
  computed: {
    requiredStyle() {
      return this.requiredWiderColumn ? 'govuk-summary-list__key widerColumn' : 'govuk-summary-list__key';
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    isCandidateView() {
      return this.$route.name === 'candidates-view';
    },
  },
  methods: {
    makeFullName(obj) {
      if (obj.firstName && this.personalDetails.lastName) {
        obj.fullName = `${obj.firstName} ${this.personalDetails.lastName}`;
      }
      if (obj.lastName && this.personalDetails.firstName) {
        obj.fullName = `${this.personalDetails.firstName} ${obj.lastName}`;
      }
      return obj;
    },
    changeUserDetails(obj) {
      if (obj.firstName || obj.lastName) {
        obj = this.makeFullName(obj);
      }
      const myPersonalDetails = { ...this.personalDetails, ...obj };

      this.$emit('update', myPersonalDetails );
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
