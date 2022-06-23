<template>
  <div>
    <div v-if="!characterChecksConsentFormCompleted">
      <span class="govuk-body">Consent form not completed.</span>
    </div>
    <div
      v-else
      class="govuk-grid-column-full"
    >
      <div>
        <h2
          class="govuk-heading-l"
          style="display:inline-block;"
        >
          Personal details
        </h2>
      </div>

      <dl class="govuk-summary-list">
        <div
          v-if="application.personalDetails.title"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Title
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.personalDetails.title }}
          </dd>
        </div>

        <div
          v-if="application.personalDetails.firstName && application.personalDetails.lastName"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            First name
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.personalDetails.firstName }}
          </dd>
        </div>

        <div
          v-if="application.personalDetails.firstName && application.personalDetails.lastName"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Last name
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.personalDetails.lastName }}
          </dd>
        </div>

        <div
          v-if="!application.personalDetails.firstName && !application.personalDetails.lastName"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
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
          <dt class="govuk-summary-list__key widerColumn">
            Other names
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.personalDetails.otherNames }}
          </dd>
        </div>

        <div
          v-if="application.personalDetails.suffix"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Suffix
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.personalDetails.suffix }}
          </dd>
        </div>

        <div
          v-if="application.equalityAndDiversitySurvey"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            What is your sex?
          </dt>
          <dd class="govuk-summary-list__value">
            <p
              v-if="application.equalityAndDiversitySurvey.gender == 'other-gender'"
              class="govuk-body govuk-!-margin-bottom-0"
            >
              <span class="govuk-caption-m">{{ application.equalityAndDiversitySurvey.gender | lookup }}</span>
              {{ application.equalityAndDiversitySurvey.otherGenderDetails }}
            </p>
            <span v-else>{{ application.equalityAndDiversitySurvey.gender | lookup }}</span>
          </dd>
        </div>

        <div
          v-if="application.personalDetails.dateOfBirth"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Date of birth
          </dt>
          <dd class="govuk-summary-list__value">
            <p v-if="application.personalDetails.dateOfBirth">
              {{ application.personalDetails.dateOfBirth | formatDate }}
            </p>
          </dd>
        </div>

        <div
          v-if="application.personalDetails.placeOfBirth"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Place of birth
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.personalDetails.placeOfBirth }}
          </dd>
        </div>

        <div
          v-if="application.personalDetails.nationalInsuranceNumber"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            National Insurance Number
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.personalDetails.nationalInsuranceNumber }}
          </dd>
        </div>

        <div
          v-if="application.personalDetails.citizenship"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Citizenship
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.personalDetails.citizenship | lookup }}
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key widerColumn">
            Address
          </dt>
          <dd
            v-if="application.personalDetails.address && application.personalDetails.address.current"
            class="govuk-summary-list__value"
          >
            {{ application.personalDetails.address.current.street }}
            <br>
            <span v-if="application.personalDetails.address.current.street2">
              {{ application.personalDetails.address.current.street2 }}
              <br>
            </span>
            {{ application.personalDetails.address.current.town }}
            <br>
            <span v-if="application.personalDetails.address.current.county">
              {{ application.personalDetails.address.current.county }}
              <br>
            </span>
            {{ application.personalDetails.address.current.postcode }}
          </dd>
          <dd
            v-else
            class="govuk-summary-list__value"
          >
            No information provided
          </dd>
        </div>

        <div
          v-if="application.personalDetails.address && application.personalDetails.address.currentMoreThan5Years"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Have you lived at this address for more than 5 years?
          </dt>
          <dd
            class="govuk-summary-list__value"
          >
            {{ application.personalDetails.address.currentMoreThan5Years | toYesNo }}
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key widerColumn">
            Previous addresses
          </dt>
          <dd
            v-if="application.personalDetails.address && application.personalDetails.address.previous"
            class="govuk-summary-list__value"
          >
            <ol
              class="govuk-list"
            >
              <li
                v-for="(address, index) in application.personalDetails.address.previous"
                :key="index"
              >
                <p class="govuk-body">
                  {{ address.startDate | formatDate }} - {{ address.endDate | formatDate }}
                </p>
                <p class="govuk-body">
                  {{ address.street }}
                  <br>
                  <span v-if="address.street2">
                    {{ address.street2 }}
                    <br>
                  </span>
                  {{ address.town }}
                  <br>
                  <span v-if="address.county">
                    {{ address.county }}
                    <br>
                  </span>
                  {{ address.postcode }}
                </p>
              </li>
            </ol>
          </dd>
          <dd
            v-else
            class="govuk-summary-list__value"
          >
            No information provided
          </dd>
        </div>
      </dl>

      <div class="govuk-!-margin-top-9">
        <h2
          class="govuk-heading-l"
          style="display:inline-block;"
        >
          Professional details
        </h2>
      </div>

      <div v-if="application.qualifications || application.magistrate">
        <dl
          v-if="application.qualifications"
          class="govuk-summary-list"
        >
          <div
            v-for="(qualification, index) in application.qualifications"
            :key="index"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key widerColumn">
              {{ qualification.type | lookup }}
            </dt>
            <dd
              class="govuk-summary-list__value"
            >
              <p
                v-if="qualification.date"
                class="govuk-body"
              >
                {{ qualification.date | formatDate }}
              </p>
              <p
                v-if="qualification.calledToBarDate"
                class="govuk-body"
              >
                {{ qualification.calledToBarDate | formatDate }}
              </p>
              <p class="govuk-body">
                {{ qualification.membershipNumber }}
              </p>
            </dd>
          </div>
        </dl>

        <dl
          v-if="application.magistrate"
          class="govuk-summary-list"
        >
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key widerColumn">
              Magistrate
            </dt>
            <dd
              class="govuk-summary-list__value"
            >
              <p class="govuk-body">
                {{ application.magistrateStartDate | formatDate }} - {{ getDate(application.magistrateEndDate) || 'present' }}
              </p>
              <p class="govuk-body">
                {{ application.magistrateLocation }}
              </p>
            </dd>
          </div>
        </dl>
      </div>
      <div
        v-else
        class="govuk-body"
      >
        No information provided
      </div>

      <div
        v-if="hmrcCheckRequired"
        class="govuk-!-margin-top-9"
      >
        <h2
          class="govuk-heading-l"
          style="display:inline-block;"
        >
          HMRC Check
        </h2>

        <dl class="govuk-summary-list">
          <div
            v-if="application.personalDetails.hasVATNumbers"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key widerColumn">
              Do you have a VAT registration number?
            </dt>
            <dd
              class="govuk-summary-list__value"
            >
              {{ application.personalDetails.hasVATNumbers | toYesNo }}
            </dd>
          </div>
          <div
            v-else
            class="govuk-body"
          >
            No information provided
          </div>

          <div
            v-if="application.personalDetails.VATNumbers"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key widerColumn">
              VAT numbers
            </dt>
            <dd
              class="govuk-summary-list__value"
            >
              <p
                v-for="(item, index) in application.personalDetails.VATNumbers"
                :key="index"
                class="govuk-body"
              >
                {{ item.VATNumber }}
              </p>
            </dd>
          </div>
        </dl>
      </div>

      <div v-if="application.professionalMemberships && application.professionalMemberships.length">
        <OtherProfessionalBodies
          :application="application"
          :exercise="exercise"
        />
      </div>

      <div class="govuk-!-margin-top-9">
        <h2
          class="govuk-heading-l"
          style="display:inline-block;"
        >
          Consent
        </h2>
      </div>

      <dl class="govuk-summary-list">
        <div
          v-if="application.characterChecks.consent"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            I understand and consent to character checks being undertaken
          </dt>
          <dd
            class="govuk-summary-list__value"
          >
            {{ application.characterChecks.consent | toYesNo }}
          </dd>
        </div>
        <div
          v-else
          class="govuk-body"
        >
          No information provided
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import OtherProfessionalBodies from './OtherProfessionalBodies';
import { formatDate } from '@jac-uk/jac-kit/filters/filters';

export default {
  components: {
    OtherProfessionalBodies,
  },
  props: {
    application: {
      type: Object,
      required: false,
      default: new Object({}),
    },
    exercise: {
      type: Object,
      required: false,
      default: new Object({}),
    },
  },
  computed: {
    characterChecksConsentFormCompleted () {
      return this.application.characterChecks && this.application.characterChecks.consent;
    },
    hmrcCheckRequired () {
      return this.exercise.characterChecks.HMRC;
    },
  },
  methods: {
    getDate (value) {
      return formatDate(value);
    },
  },
};
</script>
