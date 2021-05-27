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
          <dt class="govuk-summary-list__key">
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
          <dt class="govuk-summary-list__key">
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
          <dt class="govuk-summary-list__key">
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

        <div
          v-if="application.personalDetails.suffix"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
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
          <dt class="govuk-summary-list__key">
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
          <dt class="govuk-summary-list__key">
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
          <dt class="govuk-summary-list__key">
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
          <dt class="govuk-summary-list__key">
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
          <dt class="govuk-summary-list__key">
            Citizenship
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.personalDetails.citizenship | lookup }}
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
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
          <dt class="govuk-summary-list__key">
            Have you lived at this address for more than 5 years?
          </dt>
          <dd
            class="govuk-summary-list__value"
          >
            {{ application.personalDetails.address.currentMoreThan5Years | toYesNo }}
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
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
          Professional bodies
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
            <dt class="govuk-summary-list__key">
              {{ qualification.type | lookup }}
            </dt>
            <dd
              class="govuk-summary-list__value"
            >
              <p class="govuk-body">
                {{ qualification.date | formatDate }}
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
            <dt class="govuk-summary-list__key">
              Magistrate
            </dt>
            <dd
              class="govuk-summary-list__value"
            >
              <p class="govuk-body">
                {{ application.magistrateStartDate | formatDate }} - {{ application.magistrateEndDate | formatDate }}
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

      <div class="govuk-!-margin-top-9">
        <h2
          class="govuk-heading-l"
          style="display:inline-block;"
        >
          HMRC Check
        </h2>
      </div>

      <dl class="govuk-summary-list">
        <div
          v-if="application.personalDetails.hasVATNumbers"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
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
          <dt class="govuk-summary-list__key">
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

      <div class="govuk-!-margin-top-9">
        <h2
          class="govuk-heading-l"
          style="display:inline-block;"
        >
          Further information to disclose
        </h2>
      </div>

      <dl class="govuk-summary-list">
        <div
          v-if="application.characterChecks.furtherInformation"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Details
          </dt>
          <dd
            class="govuk-summary-list__value"
          >
            {{ application.characterChecks.furtherInformation }}
          </dd>
        </div>
        <div
          v-else
          class="govuk-body"
        >
          No information provided
        </div>
      </dl>

      <div class="govuk-!-margin-top-9">
        <h2
          class="govuk-heading-l"
          style="display:inline-block;"
        >
          Declaration
        </h2>
      </div>

      <dl class="govuk-summary-list">
        <div
          v-if="application.characterChecks.declaration"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Signed declaration
          </dt>
          <dd
            class="govuk-summary-list__value"
          >
            {{ application.characterChecks.declaration | toYesNo }}
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
export default {
  props: {
    application: {
      type: Object,
      required: false,
      default: new Object({}),
    },
  },
  computed: {
    characterChecksConsentFormCompleted() {
      return this.application.characterChecks && this.application.characterChecks.declaration;
    },
  },
};
</script>
