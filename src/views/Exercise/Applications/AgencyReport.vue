<template>
  <div v-if="application && application.personalDetails">
    <h2 class="govuk-heading-l">
      ACRO
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Name
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.fullName }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Other names
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.otherNames }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Date of birth
        </dt>
        <dd class="govuk-summary-list__value">
          {{ $filters.formatDate(application.personalDetails.dateOfBirth) }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Place of birth
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.placeOfBirth }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          NI Number
        </dt>
        <dd class="govuk-summary-list__value">
          {{ $filters.formatNIN(application.personalDetails.nationalInsuranceNumber) }}
        </dd>
      </div>

      <div
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Current Address
        </dt>
        <dd
          v-if="application.personalDetails.address && application.personalDetails.address.current"
          class="govuk-summary-list__value"
        >
          <ul class="govuk-list">
            <li>
              {{ application.personalDetails.address.current.street }}
            </li>
            <li
              v-if="application.personalDetails.address.current.street2"
            >
              {{ application.personalDetails.address.current.street2 }}
            </li>
            <li>
              {{ application.personalDetails.address.current.town }}
            </li>
            <li
              v-if="application.personalDetails.address.current.county"
            >
              {{ application.personalDetails.address.current.county }}
            </li>
            <li>
              {{ application.personalDetails.address.current.postcode }}
            </li>
          </ul>
        </dd>
        <dd
          v-else
          class="govuk-summary-list__value"
        >
          None provided
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Previous Addresses
        </dt>
        <dd
          v-if="application.personalDetails.address && application.personalDetails.address.previous"
          class="govuk-summary-list__value"
        >
          <ul
            v-for="address in application.personalDetails.address.previous"
            :key="address.street"
            class="govuk-list"
          >
            <li>
              {{ $filters.formatDate(address.startDate) }} to {{ $filters.formatDate(address.endDate) }}
            </li>
            <li>
              {{ address.street }}
            </li>
            <li
              v-if="application.personalDetails.address.current.street2"
            >
              {{ address.street2 }}
            </li>
            <li>
              {{ address.town }}
            </li>
            <li
              v-if="application.personalDetails.address.current.county"
            >
              {{ address.county }}
            </li>
            <li>
              {{ address.postcode }}
            </li>
          </ul>
        </dd>
        <dd
          v-else
          class="govuk-summary-list__value"
        >
          None provided
        </dd>
      </div>
    </dl>

    <h2 class="govuk-heading-l">
      SRA
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Name
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.fullName }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Other names
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.otherNames }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Admission to the roll
        </dt>
        <dd class="govuk-summary-list__value">
          {{ $filters.formatDate(sra.date) }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Registration number
        </dt>
        <dd class="govuk-summary-list__value">
          {{ sra.membershipNumber }}
        </dd>
      </div>
    </dl>

    <h2 class="govuk-heading-l">
      BSB
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Name
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.fullName }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Other names
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.otherNames }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Called to the Bar
        </dt>
        <dd class="govuk-summary-list__value">
          {{ $filters.formatDate(bsb.date) }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Registration number
        </dt>
        <dd class="govuk-summary-list__value">
          {{ bsb.membershipNumber }}
        </dd>
      </div>
    </dl>

    <h2 class="govuk-heading-l">
      JCIO
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Name
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.fullName }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Other names
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.otherNames }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Judicial Office
        </dt>
        <dd class="govuk-summary-list__value">
          {{ $filters.toYesNo(application.feePaidOrSalariedJudge) }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Judicial posts
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list govuk-!-margin-bottom-0">
            <li
              v-for="(item, index) in application.experience"
              :key="index"
            >
              {{ item.jobTitle }}
            </li>
          </ul>
        </dd>
      </div>
    </dl>

    <h2 class="govuk-heading-l">
      HMRC
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Name
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.fullName }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Other names
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.otherNames }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Date of birth
        </dt>
        <dd class="govuk-summary-list__value">
          {{ $filters.formatDate(application.personalDetails.dateOfBirth) }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          VAT Numbers
        </dt>
        <dd class="govuk-summary-list__value">
          <ul
            class="govuk-list govuk-!-margin-bottom-0"
          >
            <li
              v-for="(item, index) in application.personalDetails.VATNumbers"
              :key="index"
            >
              {{ item.VATNumber }}
            </li>
          </ul>
        </dd>
      </div>

      <div
        v-if="application.characterInformation && application.characterInformation.lateTaxReturnOrFined"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Issues declared by the candidate
        </dt>
        <dd class="govuk-summary-list__value">
          <dl
            v-for="(item, index) in application.characterInformation.lateTaxReturnOrFinedDetails"
            :key="index"
          >
            <div class="govuk-!-font-weight-bold">
              {{ $filters.formatDate(item.date) }}
            </div>
            <div>{{ item.details }}</div>
          </dl>
        </dd>
      </div>

      <div
        v-if="isApplicationVersionGreaterThan1 && characterInformation && hasFinancialIssues"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Issues declared by the candidate
        </dt>
        <FinancialMattersAgencyReport
          :character-information="characterInformation"
        />
      </div>
    </dl>

    <h2 class="govuk-heading-l">
      Other
    </h2>

    <h3 class="govuk-heading-m">
      GMC
    </h3>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Name
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.fullName }}
        </dd>
      </div>

      <div
        v-if="application.personalDetails.otherNames"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Other names
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.otherNames }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Date of membership
        </dt>
        <dd class="govuk-summary-list__value">
          {{ $filters.formatDate(application.generalMedicalCouncilDate) }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Membership number
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.generalMedicalCouncilNumber }}
        </dd>
      </div>

      <div
        v-if="application.generalMedicalCouncilInformation"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Comments or restrictions
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.generalMedicalCouncilInformation }}
        </dd>
        <dd
          v-if="application.generalMedicalCouncilConditional"
        >
          <ul
            v-if="application.generalMedicalCouncilConditional"
            class="govuk-list"
          >
            <p class="govuk-hint">
              Conditions
            </p>
            <li
              v-if="application.generalMedicalCouncilConditionalStartDate
                && application.generalMedicalCouncilConditionalEndDate"
            >
              {{ $filters.formatDate(application.generalMedicalCouncilConditionalStartDate) }}
              to {{ $filters.formatDate(application.generalMedicalCouncilConditionalEndDate) }}
            </li>
            <li
              v-if="application.generalMedicalCouncilConditionalStartDate
                && !application.generalMedicalCouncilConditionalEndDate"
            >
              {{ $filters.formatDate(application.generalMedicalCouncilConditionalStartDate) }} — current
            </li>
            <li>
              {{ application.generalMedicalCouncilConditionalDetails }}
            </li>
          </ul>
        </dd>
      </div>
    </dl>

    <h3 class="govuk-heading-m">
      RICS
    </h3>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Name
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.fullName }}
        </dd>
      </div>

      <div
        v-if="application.personalDetails.otherNames"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Other names
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.otherNames }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Date of membership
        </dt>
        <dd class="govuk-summary-list__value">
          {{ $filters.formatDate(application.royalInstitutionCharteredSurveyorsDate) }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Membership number
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.royalInstitutionCharteredSurveyorsNumber }}
        </dd>
      </div>

      <div
        v-if="application.royalInstitutionCharteredSurveyorsInformation"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Comments or restrictions
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.royalInstitutionCharteredSurveyorsInformation }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FinancialMattersAgencyReport from '@/views/InformationReview/FinancialMattersAgencyReport.vue';
import { isApplicationVersionGreaterThan } from '@/helpers/exerciseHelper';

export default {
  name: 'AgencyReport',
  components: {
    FinancialMattersAgencyReport,
  },
  computed: {
    ...mapGetters({
      applicationOpenDatePost15102024: 'exerciseDocument/applicationOpenDatePost15102024',
    }),
    characterInformation() {
      return this.applicationOpenDatePost15102024 ? this.application.characterInformationV3 : this.application.characterInformationV2;
    },
    application() {
      return this.$store.state.application.record;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isApplicationVersionGreaterThan1() {
      return isApplicationVersionGreaterThan(this.exercise, 1);
    },
    sra() {
      const qualifications = this.application.qualifications || [];
      const sra = qualifications.find((qualification) => qualification.type === 'solicitor');
      return sra ? sra : {};
    },
    bsb() {
      const qualifications = this.application.qualifications || [];
      const bsb = qualifications.find((qualification) => qualification.type === 'barrister');
      return bsb ? bsb : {};
    },
    hasFinancialIssues() {
      return !!(this.characterInformation &&
        (this.characterInformation.bankruptcies
          || this.characterInformation.ivas
          || this.characterInformation.lateTaxReturns
          || this.characterInformation.lateVatReturns
          || this.characterInformation.hmrcFines));
    },
  },
};
</script>
