<template>
  <div>
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
          Date of birth
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.personalDetails.dateOfBirth | formatDate }}
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
          {{ application.personalDetails.nationalInsuranceNumber | formatNIN }}
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Current Address
        </dt>
        <dd class="govuk-summary-list__value">
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
      </div>

      <div
        v-if="application.personalDetails.address.previous.length"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Previous Addresses
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <ul
            v-for="address in application.personalDetails.address.previous"
            :key="address.street"
            class="govuk-list"
          >
            <li>
              {{ address.startDate | formatDate }} to {{ address.endDate | formatDate }}
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
      </div>
    </dl>

    <template
      v-if="sra"
    >
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
            Admission to the roll
          </dt>
          <dd class="govuk-summary-list__value">
            {{ sra.date | formatDate }}
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
    </template>

    <template
      v-if="bsb"
    >
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
            Called to the Bar
          </dt>
          <dd class="govuk-summary-list__value">
            {{ bsb.date | formatDate }}
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
    </template>

    <template
      v-if="hasJCIOCheck"
    >
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
            Judicial Office
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.feePaidOrSalariedJudge | toYesNo }}
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
    </template>

    <template
      v-if="hasHMRCCheck"
    >
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
            Date of birth
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.personalDetails.dateOfBirth | formatDate }}
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
          v-if="application.characterInformation.lateTaxReturnOrFined"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Issues declared by the candidate
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.characterInformation.lateTaxReturnOrFinedDetails }}
          </dd>
        </div>
      </dl>
    </template>

    <h2 class="govuk-heading-l">
      Other
    </h2>

    <template
      v-if="hasGMCCheck"
    >
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
            {{ application.generalMedicalCouncilDate | formatDate }}
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
                {{ application.generalMedicalCouncilConditionalStartDate | formatDate }}
                to {{ application.generalMedicalCouncilConditionalEndDate | formatDate }}
              </li>
              <li
                v-if="application.generalMedicalCouncilConditionalStartDate
                  && !application.generalMedicalCouncilConditionalEndDate"
              >
                {{ application.generalMedicalCouncilConditionalStartDate | formatDate }} — current
              </li>
              <li>
                {{ application.generalMedicalCouncilConditionalDetails }}
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </template>

    <template
      v-if="hasRICSCheck"
    >
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
            {{ application.royalInstitutionCharteredSurveyorsDate | formatDate }}
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
    </template>
  </div>
</template>

<script>

export default {
  computed: {
    application() {
      return this.$store.state.application.record;
    },
    sra() {
      const qualifications = this.application.qualifications || [];

      return qualifications.find((qualification) => qualification.type === 'solicitor');
    },
    bsb() {
      const qualifications = this.application.qualifications || [];

      return qualifications.find((qualification) => qualification.type === 'barrister');
    },
    hasJCIOCheck() {
      return this.application.feePaidOrSalariedJudge;
    },
    hasHMRCCheck() {
      return this.application.personalDetails.hasVATNumbers;
    },
    hasGMCCheck() {
      return !!this.application.generalMedicalCouncilNumber;
    },
    hasRICSCheck() {
      return !!this.application.royalInstitutionCharteredSurveyorsNumber;
    },
  },
};
</script>
