<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <div v-if="application && exercise">
        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">
              Application status
            </dt>
            <dd class="govuk-summary-list__value">
              {{ application.status | lookup }}
            </dd>
          </div>
          <div
            v-if="application.createdAt"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key">
              Application created
            </dt>
            <dd class="govuk-summary-list__value">
              {{ new Date(application.createdAt) | formatDate('datetime') }}
            </dd>
          </div>
          <div
            v-if="application.appliedAt"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key">
              Application submitted
            </dt>
            <dd class="govuk-summary-list__value">
              {{ application.appliedAt | formatDate('datetime') }}
            </dd>
          </div>
        </dl>

        <div
          v-if="!streamlined"
          class="govuk-!-margin-top-9"
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
                {{ application.personalDetails.fullName }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Email address
              </dt>
              <dd class="govuk-summary-list__value">
                <a
                  :href="`mailto:${application.personalDetails.email}`"
                  class="govuk-link govuk-link--no-visited-state"
                  target="_blank"
                >
                  {{ application.personalDetails.email }}
                </a>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Phone number
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.personalDetails.phone }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Date of birth
              </dt>
              <dd class="govuk-summary-list__value">
                <p v-if="application.personalDetails.dateOfBirth">
                  {{ application.personalDetails.dateOfBirth | formatDate }}
                </p>
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
                Citizenship
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.personalDetails.citizenship | lookup }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Reasonable adjustments
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.personalDetails.reasonableAdjustments | toYesNo }}
                <ul
                  v-if="application.personalDetails.reasonableAdjustmentsDetails"
                  class="govuk-!-margin-top-1"
                >
                  <li>
                    {{ application.personalDetails.reasonableAdjustmentsDetails }}
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="!streamlined"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Character information
          </h2>

          <dl class="govuk-summary-list">
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Has been cautioned or convicted of a criminal offence
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.characterInformation.criminalOffences | toYesNo }}
                <EventRenderer
                  v-if="application.characterInformation.criminalOffences"
                  :events="application.characterInformation.criminalOffenceDetails"
                />
              </dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Has received a non-motoring penalty notice in the last 4 years
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.characterInformation.nonMotoringFixedPenaltyNotices | toYesNo }}
                <EventRenderer
                  v-if="application.characterInformation.nonMotoringFixedPenaltyNotices"
                  :events="application.characterInformation.nonMotoringFixedPenaltyNoticesDetails"
                />
              </dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Has been disqualified from driving, or convicted for driving under the influence of drink or drugs
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.characterInformation.drivingDisqualificationDrinkDrugs | toYesNo }}
                <EventRenderer
                  v-if="application.characterInformation.drivingDisqualificationDrinkDrugs"
                  :events="application.characterInformation.drivingDisqualificationDrinkDrugsDetails"
                />
              </dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Has endorsements on licence, or received any motoring fixed-penalty notices in the last 4 years
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.characterInformation.endorsementsOrMotoringFixedPenalties | toYesNo }}
                <EventRenderer
                  v-if="application.characterInformation.endorsementsOrMotoringFixedPenalties"
                  :events="application.characterInformation.endorsementsOrMotoringFixedPenaltiesDetails"
                />
              </dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Has been declared bankrupt or entered into an Individual Voluntary Agreement (IVA)
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.characterInformation.declaredBankruptOrIVA | toYesNo }}
                <EventRenderer
                  v-if="application.characterInformation.declaredBankruptOrIVA"
                  :events="application.characterInformation.declaredBankruptOrIVADetails"
                />
              </dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Has filed late tax returns or been fined by HMRC
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.characterInformation.lateTaxReturnOrFined | toYesNo }}
                <EventRenderer
                  v-if="application.characterInformation.lateTaxReturnOrFined"
                  :events="application.characterInformation.lateTaxReturnOrFinedDetails"
                />
              </dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Has ever been, or is currently, subject to professional misconduct, negligence, wrongful dismissal, discrimination or harassment proceedings
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.characterInformation.involvedInProfessionalMisconduct | toYesNo }}
                <EventRenderer
                  v-if="application.characterInformation.involvedInProfessionalMisconduct"
                  :events="application.characterInformation.involvedInProfessionalMisconductDetails"
                />
              </dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Has ever been subject to complaints or disciplinary action, or been asked to resign from a position
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.characterInformation.diciplinaryActionOrAskedToResign | toYesNo }}
                <EventRenderer
                  v-if="application.characterInformation.diciplinaryActionOrAskedToResign"
                  :events="application.characterInformation.diciplinaryActionOrAskedToResignDetails"
                />
              </dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Has any other character issues
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.characterInformation.otherCharacterIssues | toYesNo }}
                <EventRenderer
                  v-if="application.characterInformation.otherCharacterIssues"
                  :events="application.characterInformation.otherCharacterIssuesDetails"
                />
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="!streamlined"
          class="govuk-!-margin-top-9"
        >
          <h2
            class="govuk-heading-l"
          >
            Equality and diversity information
          </h2>

          <dl class="govuk-summary-list">
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Agreed to share data
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.equalityAndDiversitySurvey.shareData | toYesNo }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Professional background
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                <span
                  v-if="preferNotToSay(application.equalityAndDiversitySurvey.professionalBackground)"
                >
                  Prefer not to say
                </span>
                <ul
                  v-else
                  class="govuk-list"
                >
                  <li
                    v-for="item in application.equalityAndDiversitySurvey.professionalBackground"
                    :key="item.name"
                  >
                    <p
                      v-if="item == 'other-professional-background'"
                      class="govuk-body govuk-!-margin-bottom-0"
                    >
                      <span>{{ item | lookup }}</span>
                      {{ application.equalityAndDiversitySurvey.otherProfessionalBackgroundDetails }}
                    </p>
                    <span v-else>{{ item | lookup }}</span>
                  </li>
                </ul>
              </dd>
            </div>

            <div
              v-if="isLegal"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Current legal role
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                <span
                  v-if="preferNotToSay(application.equalityAndDiversitySurvey.currentLegalRole)"
                >
                  Prefer not to say
                </span>
                <ul
                  v-else
                  class="govuk-list"
                >
                  <li
                    v-for="item in application.equalityAndDiversitySurvey.currentLegalRole"
                    :key="item.name"
                  >
                    <p class="govuk-body govuk-!-margin-bottom-0">
                      {{ item | lookup }}
                    </p>
                    <p
                      v-if="item == 'other-fee-paid-judicial-office-holder'"
                      class="govuk-body govuk-!-margin-bottom-0"
                    >
                      {{ application.equalityAndDiversitySurvey.otherCurrentFeePaidJudicialOfficeHolderDetails }}
                    </p>

                    <p
                      v-else-if="item == 'other-salaried-judicial-office-holder'"
                      class="govuk-body govuk-!-margin-bottom-0"
                    >
                      {{ application.equalityAndDiversitySurvey.otherCurrentSalariedJudicialOfficeHolderDetails }}
                    </p>

                    <p
                      v-else-if="item == 'other-current-legal-role'"
                      class="govuk-body govuk-!-margin-bottom-0"
                    >
                      {{ application.equalityAndDiversitySurvey.otherCurrentLegalRoleDetails }}
                    </p>
                  </li>
                </ul>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Held fee-paid judicial role
              </dt>
              <dd class="govuk-summary-list__value">
                <p class="govuk-body">
                  {{ application.equalityAndDiversitySurvey.feePaidJudicialRole | lookup | toYesNo }}
                </p>
                <p
                  v-if="application.equalityAndDiversitySurvey.feePaidJudicialRole == 'other-fee-paid-judicial-office'"
                  class="govuk-body govuk-!-margin-bottom-0"
                >
                  {{ application.equalityAndDiversitySurvey.otherFeePaidJudicialRoleDetails }}
                </p>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Attended state or fee-paying school
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.equalityAndDiversitySurvey.stateOrFeeSchool | lookup }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Attended Oxbridge universities
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.equalityAndDiversitySurvey.oxbridgeUni | lookup | toYesNo }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                First generation to go to university
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.equalityAndDiversitySurvey.firstGenerationStudent | lookup | toYesNo }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Ethnic group
              </dt>
              <dd class="govuk-summary-list__value">
                <p class="govuk-body govuk-!-margin-bottom-0">
                  {{ application.equalityAndDiversitySurvey.ethnicGroup | lookup }}
                </p>
                <p
                  v-if="hasEthnicGroupDetails"
                  class="govuk-body govuk-!-margin-bottom-0"
                >
                  {{ ethnicGroupDetails }}
                </p>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Gender
              </dt>
              <dd class="govuk-summary-list__value">
                <p class="govuk-body govuk-!-margin-bottom-0">
                  {{ application.equalityAndDiversitySurvey.gender | lookup }}
                </p>
                <p
                  v-if="application.equalityAndDiversitySurvey.gender == 'other-gender'"
                  class="govuk-body govuk-!-margin-bottom-0"
                >
                  {{ application.equalityAndDiversitySurvey.otherGenderDetails }}
                </p>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Gender is the same as sex assigned at birth
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.equalityAndDiversitySurvey.changedGender | lookup | toYesNo }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Sexual orientation
              </dt>
              <dd class="govuk-summary-list__value">
                <p class="govuk-body govuk-!-margin-bottom-0">
                  {{ application.equalityAndDiversitySurvey.sexualOrientation | lookup }}
                </p>
                <p
                  v-if="application.equalityAndDiversitySurvey.sexualOrientation == 'other-sexual-orientation'"
                  class="govuk-body govuk-!-margin-bottom-0"
                >
                  {{ application.equalityAndDiversitySurvey.otherSexualOrientationDetails }}
                </p>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Disability
              </dt>
              <dd class="govuk-summary-list__value">
                <p class="govuk-body govuk-!-margin-bottom-0">
                  {{ application.equalityAndDiversitySurvey.disability | lookup | toYesNo }}
                </p>
                <p
                  v-if="application.equalityAndDiversitySurvey.disability === true"
                  class="govuk-body govuk-!-margin-bottom-0"
                >
                  <span
                    v-if="application.equalityAndDiversitySurvey.disabilityDetails"
                  >
                    {{ application.equalityAndDiversitySurvey.disabilityDetails }}
                  </span>
                  <span
                    v-else
                  >
                    No details provided.
                  </span>
                </p>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Religion or faith
              </dt>
              <dd class="govuk-summary-list__value">
                <p class="govuk-body govuk-!-margin-bottom-0">
                  {{ application.equalityAndDiversitySurvey.religionFaith | lookup }}
                </p>
                <p
                  v-if="application.equalityAndDiversitySurvey.religionFaith == 'other-religion'"
                  class="govuk-body govuk-!-margin-bottom-0"
                >
                  {{ application.equalityAndDiversitySurvey.otherReligionDetails }}
                </p>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Attended Outreach events
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.equalityAndDiversitySurvey.attendedOutreachEvents | lookup | toYesNo }}
              </dd>
            </div>

            <div
              v-if="isLegal"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Participated in a Judicial Workshadowing Scheme
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.equalityAndDiversitySurvey.participatedInJudicialWorkshadowingScheme | lookup | toYesNo }}
              </dd>
            </div>

            <div
              v-if="isLegal"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Participated in Pre-Application Judicial Education programme
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.equalityAndDiversitySurvey.hasTakenPAJE | lookup | toYesNo }}
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="!streamlined && exercise.locationQuestion"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Location preferences
          </h2>

          <dl class="govuk-summary-list">
            <dt class="govuk-summary-list__key">
              {{ exercise.locationQuestion }}
            </dt>
            <dd
              v-if="exercise.locationQuestionType == 'single-choice'"
              class="govuk-summary-list__value"
            >
              {{ application.locationPreferences }}
            </dd>
            <dd
              v-else
              class="govuk-summary-list__value"
            >
              <p
                v-for="item in application.locationPreferences"
                :key="item.name"
                class="govuk-body"
              >
                {{ item }}
              </p>
            </dd>
          </dl>
        </div>

        <div
          v-if="!streamlined && exercise.jurisdictionQuestion"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Jurisdiction preferences
          </h2>

          <dl class="govuk-summary-list">
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                {{ exercise.jurisdictionQuestion }}
              </dt>
              <dd
                v-if="exercise.jurisdictionQuestionType == 'single-choice'"
                class="govuk-summary-list__value"
              >
                {{ application.jurisdictionPreferences }}
              </dd>
              <dd
                v-else
                class="govuk-summary-list__value"
              >
                <p
                  v-for="item in application.jurisdictionPreferences"
                  :key="item.name"
                  class="govuk-body"
                >
                  {{ item }}
                </p>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="exercise.welshRequirement"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Welsh posts
          </h2>

          <dl class="govuk-summary-list">
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Applying for a Welsh post
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.applyingForWelshPost | toYesNo }}
              </dd>
            </div>
            <div
              v-if="application.applyingForWelshPost"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Can speak Welsh
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                {{ application.canSpeakWelsh | toYesNo }}
              </dd>
            </div>
            <div
              v-if="application.applyingForWelshPost"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Can read and write in Welsh?
              </dt>
              <dd
                class="govuk-summary-list__value"
              >
                <p
                  v-if="application.canReadAndWriteWelsh == false "
                >
                  {{ application.canReadAndWriteWelsh | toYesNo }}
                </p>
                <p
                  v-if="application.canReadAndWriteWelsh"
                >
                  {{ application.canReadAndWriteWelsh | lookup }}
                </p>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="isLegal"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Qualifications
          </h2>

          <dl
            v-for="item in application.qualifications"
            :key="item.name"
            class="govuk-summary-list govuk-!-margin-bottom-8"
          >
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Qualification
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ item.type | lookup }}</li>
                </ul>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Location
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ item.location | lookup }}</li>
                </ul>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Date qualified
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li v-if="item.date">
                    {{ item.date | formatDate }}
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="showMemberships"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Memberships
          </h2>

          <dl
            class="govuk-summary-list govuk-!-margin-bottom-8"
          >
            <div
              v-if="showMembershipOption('chartered-association-of-building-engineers')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Chartered Association of Building Engineers
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ application.charteredAssociationBuildingEngineersDate | formatDate }}</li>
                  <li>{{ application.charteredAssociationBuildingEngineersNumber }}</li>
                  <li>{{ application.charteredAssociationBuildingEngineersInformation }}</li>
                </ul>
              </dd>
            </div>

            <div
              v-if="showMembershipOption('chartered-institute-of-building')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Chartered Association of Building Engineers
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ application.charteredInstituteBuildingDate | formatDate }}</li>
                  <li>{{ application.charteredInstituteBuildingNumber }}</li>
                  <li>{{ application.charteredInstituteBuildingInformation }}</li>
                </ul>
              </dd>
            </div>

            <div
              v-if="showMembershipOption('chartered-institute-of-environmental-health')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Chartered Institute of Environmental Health
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ application.charteredInstituteEnvironmentalHealthDate | formatDate }}</li>
                  <li>{{ application.charteredInstituteEnvironmentalHealthNumber }}</li>
                  <li>{{ application.charteredInstituteEnvironmentalHealthInformation }}</li>
                </ul>
              </dd>
            </div>

            <div
              v-if="showMembershipOption('general-medical-council')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                General Medical Council
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ application.generalMedicalCouncilDate | formatDate }}</li>
                  <li>{{ application.generalMedicalCouncilNumber }}</li>
                  <li>{{ application.generalMedicalCouncilInformation }}</li>
                </ul>

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
                  <li>
                    {{ application.generalMedicalCouncilConditionalDetails }}
                  </li>
                </ul>
              </dd>
            </div>

            <div
              v-if="showMembershipOption('royal-college-of-psychiatrists')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Royal College of Psychiatrists
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ application.royalCollegeOfPsychiatristsDate | formatDate }}</li>
                  <li>{{ application.royalCollegeOfPsychiatristsNumber }}</li>
                  <li>{{ application.royalCollegeOfPsychiatristsInformation }}</li>
                </ul>
              </dd>
            </div>

            <div
              v-if="showMembershipOption('royal-institution-of-chartered-surveyors')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Royal Institution of Chartered Surveyors
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ application.royalInstitutionCharteredSurveyorsDate | formatDate }}</li>
                  <li>{{ application.royalInstitutionCharteredSurveyorsNumber }}</li>
                  <li>{{ application.royalInstitutionCharteredSurveyorsInformation }}</li>
                </ul>
              </dd>
            </div>

            <div
              v-if="showMembershipOption('royal-institute-of-british-architects')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Royal Institute of British Architects
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ application.royalInstituteBritishArchitectsDate | formatDate }}</li>
                  <li>{{ application.royalInstituteBritishArchitectsNumber }}</li>
                  <li>{{ application.royalInstituteBritishArchitectsInformation }}</li>
                </ul>
              </dd>
            </div>

            <div
              v-if="showMembershipOption('other')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Other membership
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ application.otherProfessionalMembershipsDate | formatDate }}</li>
                  <li>{{ application.otherProfessionalMembershipsNumber }}</li>
                  <li>{{ application.otherProfessionalMembershipsInformation }}</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="isNonLegal"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Experience
          </h2>

          <dl
            v-for="item in application.experience"
            :key="item.name"
            class="govuk-summary-list govuk-!-margin-bottom-8"
          >
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Organisation or business
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ item.orgBusinessName }}</li>
                </ul>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Job title
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ item.jobTitle }}</li>
                </ul>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Date qualified
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li v-if="item.startDate && item.endDate">
                    {{ item.startDate | formatDate }} to {{ item.endDate | formatDate }}
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="isLegal"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Post-qualification experience
          </h2>

          <dl
            v-for="item in application.experience"
            :key="item.name"
            class="govuk-summary-list govuk-!-margin-bottom-8"
          >
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Job title
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ item.jobTitle }}</li>
                </ul>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Organisation or business
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ item.orgBusinessName }}</li>
                </ul>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Dates worked
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li v-if="item.startDate && item.endDate">
                    {{ item.startDate | formatDate }} to {{ item.endDate | formatDate }}
                  </li>
                </ul>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Law-related tasks
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li
                    v-for="task in item.tasks"
                    :key="task.name"
                  >
                    <p class="govuk-body govuk-!-margin-bottom-0">
                      {{ task | lookup }}
                    </p>
                    <p
                      v-if="task == 'other'"
                      class="govuk-body govuk-!-margin-bottom-0"
                    >
                      {{ item.otherTasks }}
                    </p>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="isLegal && exercise.previousJudicialExperienceApply"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Judicial experience
          </h2>

          <dl
            class="govuk-summary-list govuk-!-margin-bottom-8"
          >
            <div
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Fee-paid or salaried judge
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.feePaidOrSalariedJudge | lookup | toYesNo }}
              </dd>
            </div>

            <div
              v-if="application.feePaidOrSalariedJudge === true"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Sat for at least 30 days
              </dt>
              <dd class="govuk-summary-list__value">
                <p class="govuk-body">
                  {{ application.feePaidOrSalariedSatForThirtyDays | toYesNo }}
                </p>
                <p
                  v-if="application.feePaidOrSalariedSittingDaysDetails"
                  class="govuk-body"
                >
                  {{ application.feePaidOrSalariedSittingDaysDetails }}
                </p>
              </dd>
            </div>

            <div
              v-if="application.feePaidOrSalariedSatForThirtyDays == false || application.feePaidOrSalariedJudge == false"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Declared an appointment or appointments in a quasi-judicial body in this application
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.declaredAppointmentInQuasiJudicialBody | toYesNo }}
              </dd>
            </div>

            <div
              v-if="application.declaredAppointmentInQuasiJudicialBody === true"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Sat for at least 30 days in one or all of these appointments
              </dt>
              <dd class="govuk-summary-list__value">
                <p class="govuk-body">
                  {{ application.quasiJudicialSatForThirtyDays | toYesNo }}
                </p>
                <p
                  v-if="application.quasiJudicialSittingDaysDetails"
                  class="govuk-body"
                >
                  {{ application.quasiJudicialSittingDaysDetails }}
                </p>
              </dd>
            </div>

            <div
              v-if="application.declaredAppointmentInQuasiJudicialBody == false ||
                application.quasiJudicialSatForThirtyDays == false"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Skills acquisition details
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.skillsAquisitionDetails }}
              </dd>
            </div>
          </dl>
        </div>

        <div
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Gaps in employment
          </h2>

          <p
            v-if="!hasEmploymentGaps"
            class="govuk-body"
          >
            No employment gaps declared.
          </p>

          <dl
            v-for="item in application.employmentGaps"
            v-else
            :key="item.name"
            class="govuk-summary-list govuk-!-margin-bottom-8"
          >
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Date of gap
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li v-if="item.startDate && item.endDate">
                    {{ item.startDate | formatDate }} to {{ item.endDate | formatDate }}
                  </li>
                </ul>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Details
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li>{{ item.details }}</li>
                </ul>
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Law-related tasks
              </dt>
              <dd class="govuk-summary-list__value">
                <ul class="govuk-list">
                  <li
                    v-for="task in item.tasks"
                    :key="task.name"
                  >
                    <p class="govuk-body govuk-!-margin-bottom-0">
                      {{ task | lookup }}
                    </p>
                    <p
                      v-if="task == 'other'"
                      class="govuk-body govuk-!-margin-bottom-0"
                    >
                      {{ item.otherTasks }}
                    </p>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div class="govuk-!-margin-top-9">
          <h2 class="govuk-heading-l">
            Reasonable length of service
          </h2>
          <dl class="govuk-summary-list govuk-!-margin-bottom-8">
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Can work a reasonable length of service
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.canGiveReasonableLOS | toYesNo }}
                <p v-if="application.canGiveReasonableLOS == false">
                  {{ application.cantGiveReasonableLOSDetails }}
                </p>
              </dd>
            </div>
          </dl>
        </div>

        <div class="govuk-!-margin-top-9">
          <h2 class="govuk-heading-l">
            Independent assessors
          </h2>

          <dl class="govuk-summary-list">
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Full name
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.firstAssessorFullName }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Title or position
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.firstAssessorTitle }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Email
              </dt>
              <dd class="govuk-summary-list__value">
                <a
                  :href="`mailto:${application.firstAssessorEmail}`"
                  class="govuk-link govuk-link--no-visited-state"
                  target="_blank"
                >
                  {{ application.firstAssessorEmail }}
                </a>
              </dd>
            </div>

            <hr class="govuk-section-break govuk-section-break--l">

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Full name
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.secondAssessorFullName }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Title or position
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.secondAssessorTitle }}
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">
                Email
              </dt>
              <dd class="govuk-summary-list__value">
                <a
                  :href="`mailto:${application.secondAssessorEmail}`"
                  class="govuk-link govuk-link--no-visited-state"
                  target="_blank"
                >
                  {{ application.secondAssessorEmail }}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="showStatementOfSuitability"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Statement of suitability
          </h2>

          <dl class="govuk-summary-list">
            <div
              v-for="(item, index) in application.selectionCriteriaAnswers"
              :key="index"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                {{ item.title }}
              </dt>
              <dd class="govuk-summary-list__value">
                <span v-if="item.answer">
                  {{ item.answerDetails }}
                </span>
                <span v-else>Does not meet this requirement</span>
              </dd>
            </div>
            <div
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Uploaded statement of suitability
              </dt>
              <dd class="govuk-summary-list__value">
                <div v-if="application.uploadedSuitabilityStatement">
                  <DownloadLink
                    :file-name="application.uploadedSuitabilityStatement"
                    :exercise-id="exercise.id"
                    :user-id="application.userId"
                    :title="application.uploadedSuitabilityStatement"
                  />
                </div>
                <span v-else>Not yet received</span>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="showStatementOfEligibility"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Statement of eligibility
          </h2>

          <dl class="govuk-summary-list">
            <div
              v-for="(item, index) in application.selectionCriteriaAnswers"
              :key="index"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                {{ item.title }}
              </dt>
              <dd class="govuk-summary-list__value">
                <span v-if="item.answer">
                  {{ item.answerDetails }}
                </span>
                <span v-else>Does not meet this requirement</span>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="showSelfAssessment"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Self assessment competencies
          </h2>

          <dl class="govuk-summary-list">
            <div
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Uploaded self assessment
              </dt>
              <dd class="govuk-summary-list__value">
                <div v-if="application.uploadedSelfAssessment">
                  <DownloadLink
                    :file-name="application.uploadedSelfAssessment"
                    :exercise-id="exercise.id"
                    :user-id="application.userId"
                    :title="application.uploadedSelfAssessment"
                  />
                </div>
                <span v-else>Not yet received</span>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="showCV"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l">
            Curriculum vitae (CV)
          </h2>

          <dl class="govuk-summary-list">
            <div
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Uploaded CV
              </dt>
              <dd class="govuk-summary-list__value">
                <div v-if="application.uploadedCV">
                  <DownloadLink
                    :file-name="application.uploadedCV"
                    :exercise-id="exercise.id"
                    :user-id="application.userId"
                    title="CV"
                  />
                </div>
                <span v-else>Not yet received</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadLink from '@/components/DownloadLink';

export default {
  components: {
    DownloadLink,
  },
  props: {
    streamlined: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    application() {
      return this.$store.state.application.record;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    applicationReferenceNumber() {
      return this.$store.state.application.record ? this.$store.state.application.record.referenceNumber : null;
    },
    isNonLegal () {
      return this.exercise.typeOfExercise === 'non-legal';
    },
    isLegal () {
      return this.exercise.typeOfExercise === 'legal';
    },
    showMemberships() {
      return this.exercise.memberships && this.exercise.memberships.indexOf('none') === -1;
    },
    ethnicGroupDetails() {
      switch(this.application.equalityAndDiversitySurvey.ethnicGroup) {
      case 'other-asian':
        return this.application.equalityAndDiversitySurvey.otherEthnicGroupAsianDetails;
      case 'other-white':
        return this.application.equalityAndDiversitySurvey.otherEthnicGroupWhiteDetails;
      case 'other-black':
        return this.application.equalityAndDiversitySurvey.otherEthnicGroupBlackDetails;
      case 'other-mixed':
        return this.application.equalityAndDiversitySurvey.otherEthnicGroupMixedDetails;
      default:
        return this.application.equalityAndDiversitySurvey.otherEthnicGroupDetails;
      }
    },
    showStatementOfSuitability() {
      switch (this.exercise.assessmentOptions) {
      case 'statement-of-suitability-with-competencies':
      case 'statement-of-suitability-with-skills-and-abilities':
      case 'statement-of-suitability-with-skills-and-abilities-and-cv':
        return true;
      default:
        return false;
      }
    },
    showCV() {
      switch (this.exercise.assessmentOptions) {
      case 'self-assessment-with-competencies-and-cv':
      case 'statement-of-suitability-with-skills-and-abilities-and-cv':
        return true;
      default:
        return false;
      }
    },
    showStatementOfEligibility() {
      switch (this.exercise.assessmentOptions) {
      case 'statement-of-eligibility':
        return true;
      default:
        return false;
      }
    },
    showSelfAssessment() {
      switch (this.exercise.assessmentOptions) {
      case 'self-assessment-with-competencies':
      case 'self-assessment-with-competencies-and-cv':
        return true;
      default:
        return false;
      }
    },
    hasEmploymentGaps() {
      if (Array.isArray(this.application.employmentGaps)) {
        if (!this.application.employmentGaps.length) {
          return false;
        }
        if (this.application.employmentGaps.length > 1) {
          return true;
        } else {
          const gap = this.application.employmentGaps[0];
          if (gap.startDate || gap.endDate) {
            return true;
          }
        }
      }
      return false;
    },
    hasEthnicGroupDetails() {
      return this.application.equalityAndDiversitySurvey.ethnicGroup &&
        this.application.equalityAndDiversitySurvey.ethnicGroup.startsWith('other-');

    },
  },
  created() {
    if (this.applicationId) {
      this.$store.dispatch('application/bind', this.applicationId).then( (application) => {
        this.$store.dispatch('exerciseDocument/bind', application.exerciseId);
      });
    }
  },
  destroyed() {
    this.$store.dispatch('application/unbind');
    this.$store.dispatch('exerciseDocument/unbind');
  },
  methods: {
    showMembershipOption(ref) {
      if (this.application && this.application.professionalMemberships) {
        return this.application.professionalMemberships.indexOf(ref) >= 0;
      }
      return false;
    },
    preferNotToSay(field) {
      const val = 'prefer-not-to-say';
      if (field === val) {
        return true;
      }
      if (Array.isArray(field) && field.includes(val)) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.govuk-heading-l {
  display: inline-block;
}
.govuk-summary-list__value,
.govuk-summary-list__value:last-child,
.govuk-summary-list__key {
  @include govuk-media-query($from: tablet) {
    width: auto;
  }
}
</style>
