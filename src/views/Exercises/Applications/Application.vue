<template>
  <div
    v-if="application"
    class="govuk-grid-row"
  >
    <div class="govuk-grid-column-full">
      <div
        v-if="applications.length"
        class="text-center"
      >
        <ul class="moj-pagination__list">
          <li
            class="moj-pagination__item  moj-pagination__item--prev"
            @click="previousApplication"
          >
            <a class="moj-pagination__link govuk-link">Previous<span class="govuk-visually-hidden"> set of pages</span></a>
          </li>
          <li
            class="moj-pagination__item  moj-pagination__item--next"
            @click="nextApplication"
          >
            <a class="moj-pagination__link govuk-link">Next<span class="govuk-visually-hidden"> set of pages</span></a>
          </li>
        </ul>
      </div>

      <div id="panel-pack-div">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-one-half">
            <span class="govuk-caption-l">Application</span>
            <h1 class="govuk-heading-l govuk-!-margin-bottom-4">
              {{ applicationReferenceNumber }}
            </h1>
          </div>
          <div class="govuk-grid-column-one-half text-right print-none">
            <div class="moj-button-menu">
              <button
                ref="dropDownRef"
                class="govuk-button moj-button-menu__toggle-button govuk-button--secondary moj-button-menu__toggle-button--secondary"
                type="button"
                aria-haspopup="true"
                :aria-expanded="dropDownExpanded.toString()"
                @click="toggleExpand"
              >
                Actions
              </button>
              <div
                class="moj-button-menu__wrapper moj-button-menu__wrapper--right"
                role="menu"
              >
                <button
                  class="govuk-button govuk-button--secondary drop-down-button"
                  @click="downloadAsPdf"
                >
                  Download As PDF
                </button>
                <button
                  id="docDownloadButton"
                  class="govuk-button govuk-button--secondary drop-down-button"
                  @click="downloadAsDoc"
                >
                  Download As Doc
                </button>
                <button
                  id="clipboard-button"
                  class="govuk-button govuk-button--secondary drop-down-button"
                  @click="copyToClipboard"
                >
                  Copy to clipboard
                </button>
              </div>
            </div>
            <!--  -->
            <span
              v-if="activeTab == 'full'"
              class=" govuk-!-margin-left-4"
            >
              <button
                v-if="isApplied"
                class="govuk-button btn-unlock"
                @click="unlock"
              >
                Unlock
              </button>
              <button
                v-else
                class="govuk-button btn-mark-as-applied"
                @click="submitApplication"
              >
                Mark as applied
              </button>
            </span>
          </div>
        </div>

        <div class="govuk-grid-row">
          <div class="govuk-grid-column-one-half">
            <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
              <span class="govuk-caption-m">Created on</span>
              <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
                {{ application.createdAt | formatDate | showAlternative("Unknown") }}
              </h2>
            </div>
          </div>

          <div class="govuk-grid-column-one-half">
            <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
              <span class="govuk-caption-m">Submitted on</span>
              <h2
                v-if="isApplied"
                class="govuk-heading-m govuk-!-margin-bottom-0"
              >
                {{ application.appliedAt | formatDate | showAlternative("Unknown") }}
              </h2>
              <h2
                v-else
                class="govuk-heading-m govuk-!-margin-bottom-0"
              >
                Draft
              </h2>
            </div>
          </div>
        </div>

        <TabsList
          class="print-none"
          :tabs="tabs"
          :active-tab.sync="activeTab"
        />

        <div v-if="application && exercise">
          <div
            v-if="activeTab == 'full' || activeTab == 'panel'"
            class="application-details"
          >
            <div
              v-if="!isPanelView"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Personal details
                <span class="govuk-hint print-none">
                  Any changes made here will also update the candidate information.
                </span>
              </h2>

              <dl class="govuk-summary-list">
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">
                    Full Name
                  </dt>
                  <dd class="govuk-summary-list__value">
                    <EditableField
                      :value="application.personalDetails.fullName"
                      :route-to="{ name: 'candidates-view', params: { id: application.userId } }"
                      field="fullName"
                      type="route"
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
                      :value="application.personalDetails.email"
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
                      :value="application.personalDetails.phone"
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
                      :value="application.personalDetails.dateOfBirth"
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
                      :value="application.personalDetails.nationalInsuranceNumber | formatNIN"
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
                      class="govuk-list govuk-!-margin-top-1"
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
              v-if="!isPanelView"
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
              v-if="!isPanelView"
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
                    Sex
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
                    <p
                      class="govuk-body govuk-!-margin-bottom-0"
                    >
                      {{ application.equalityAndDiversitySurvey.changedGender | lookup | toYesNo }}
                    </p>
                    <p
                      v-if="application.equalityAndDiversitySurvey.changedGender === false"
                      class="govuk-body govuk-!-margin-bottom-0"
                    >
                      {{ application.equalityAndDiversitySurvey.genderIdentityDetails }}
                    </p>
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
                    Religion
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
                    Participated in Pre-Application Judicial Education Programme
                  </dt>
                  <dd class="govuk-summary-list__value">
                    {{ application.equalityAndDiversitySurvey.hasTakenPAJE | lookup | toYesNo }}
                  </dd>
                </div>
              </dl>
            </div>

            <div
              v-if="!isPanelView && exercise.yesSalaryDetails"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Part Time Working Preferences
              </h2>

              <dl class="govuk-summary-list">
                <dt class="govuk-summary-list__key">
                  {{ exercise.yesSalaryDetails }}
                </dt>
                <dd
                  class="govuk-summary-list__value"
                >
                  {{ application.partTimeWorkingPreferencesDetails }}
                </dd>
              </dl>
            </div>

            <div
              v-if="!isPanelView && exercise.locationQuestion"
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
              v-if="!isPanelView && exercise.jurisdictionQuestion"
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
              v-if="application.additionalWorkingPreferences"
              class="govuk-!-margin-top-9"
            >
              <h2
                class="govuk-heading-l"
                style="display:inline-block;"
              >
                Additional Preferences
              </h2>

              <dl
                v-for="(item, index) in application.additionalWorkingPreferences"
                :key="index"
                class="govuk-summary-list"
              >
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">
                    {{ exercise.additionalWorkingPreferences[index].question }}
                    <span class="govuk-body govuk-!-font-size-19">
                      ({{ exercise.additionalWorkingPreferences[index].questionType | lookup }})
                    </span>
                  </dt>
                  <dd
                    v-if="exercise.additionalWorkingPreferences[index].questionType === 'single-choice'"
                    class="govuk-summary-list__value"
                  >
                    <ul class="govuk-list">
                      <li>{{ item.selection }}</li>
                    </ul>
                  </dd>
                  <dd
                    v-if="exercise.additionalWorkingPreferences[index].questionType === 'multiple-choice'"
                    class="govuk-summary-list__value"
                  >
                    <ul class="govuk-list">
                      <li>
                        <span
                          v-for="(option, count) in exercise.additionalWorkingPreferences[index].answers"
                          :key="count"
                        >
                          <strong
                            v-if="item.selection.includes(option.answer)"
                          > {{ option.answer }} </strong>
                          <span
                            v-else
                          >
                            {{ option.answer }}
                          </span>
                          <span
                            v-if="count+1!==exercise.additionalWorkingPreferences[index].answers.length"
                          >,</span>
                        </span>
                      </li>
                    </ul>
                  </dd>
                  <dd
                    v-if="exercise.additionalWorkingPreferences[index].questionType === 'ranked-choice'"
                    class="govuk-summary-list__value"
                  >
                    <ul class="govuk-list">
                      <li>
                        <span
                          v-for="(choice, count) in item.selection"
                          :key="count"
                        >
                          <strong>{{ count+1 }}.</strong> {{ choice }}
                        </span>
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
                Qualifications
              </h2>

              <dl
                v-for="item in application.qualifications"
                :key="item.name"
                class="govuk-summary-list govuk-!-margin-bottom-0"
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

                <div
                  v-if="item.date"
                  class="govuk-summary-list__row"
                >
                  <dt
                    v-if="item.type === 'barrister'"
                    class="govuk-summary-list__key"
                  >
                    Date completed pupillage
                  </dt>
                  <dt
                    v-else
                    class="govuk-summary-list__key"
                  >
                    Date qualified
                  </dt>
                  <dd class="govuk-summary-list__value">
                    <ul class="govuk-list">
                      <li> {{ item.date | formatDate }}</li>
                    </ul>
                  </dd>
                </div>

                <template
                  v-if="item.qualificationNotComplete && item.details"
                >
                  <div
                    class="govuk-summary-list__row"
                  >
                    <dt class="govuk-summary-list__key">
                      Completed pupillage
                    </dt>
                    <dd class="govuk-summary-list__value">
                      <ul class="govuk-list">
                        <li>
                          No
                        </li>
                      </ul>
                    </dd>
                  </div>

                  <div
                    class="govuk-summary-list__row"
                  >
                    <dt class="govuk-summary-list__key">
                      Did not complete pupillage notes
                    </dt>
                    <dd class="govuk-summary-list__value">
                      <ul class="govuk-list">
                        <li>
                          {{ item.details }}
                        </li>
                      </ul>
                    </dd>
                  </div>
                </template>
              </dl>

              <dl
                v-if="exercise.schedule2Apply"
                class="govuk-summary-list govuk-!-margin-bottom-8"
              >
                <div
                  v-if="exercise.appliedSchedule == 'schedule-2-3'"
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key">
                    Are you applying under Schedule 2(3)?
                  </dt>
                  <dd class="govuk-summary-list__value">
                    <ul class="govuk-list">
                      <li> {{ application.applyingUnderSchedule2Three | toYesNo }}</li>
                    </ul>
                  </dd>
                </div>

                <div
                  v-if="exercise.appliedSchedule == 'schedule-2-d'"
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key">
                    Are you applying under Schedule 2(d)?
                  </dt>
                  <dd class="govuk-summary-list__value">
                    <ul class="govuk-list">
                      <li> {{ application.applyingUnderSchedule2d | toYesNo }}</li>
                    </ul>
                  </dd>
                </div>

                <div
                  v-if="
                    (exercise.appliedSchedule=='schedule-2-3' && application.applyingUnderSchedule2Three)
                      || (exercise.appliedSchedule=='schedule-2-d' && application.applyingUnderSchedule2d)"
                  class="govuk-summary-list__row"
                >
                  <dt
                    class="govuk-summary-list__key"
                  >
                    Explain how you've gained experience in law.
                  </dt>
                  <dd class="govuk-summary-list__value">
                    <ul class="govuk-list">
                      <li v-if="exercise.appliedSchedule=='schedule-2-3'">
                        {{ application.experienceUnderSchedule2Three }}
                      </li>
                      <li v-if="exercise.appliedSchedule=='schedule-2-d'">
                        {{ application.experienceUnderSchedule2D }}
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

                <div
                  v-for="(membership, key) in otherMemberships"
                  :key="key"
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key">
                    {{ membership.label }}
                  </dt>
                  <dd class="govuk-summary-list__value">
                    <ul class="govuk-list">
                      <li>{{ membership.date | formatDate }}</li>
                      <li>{{ membership.number }}</li>
                      <li>{{ membership.information }}</li>
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
                    <ul
                      v-if="item.startDate"
                      class="govuk-list"
                    >
                      <li v-if="item.endDate">
                        {{ item.startDate | formatDate }} to {{ item.endDate | formatDate }}
                      </li>
                      <li v-else>
                        {{ item.startDate | formatDate }} — current
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
                    <ul
                      v-if="item.startDate"
                      class="govuk-list"
                    >
                      <li v-if="item.endDate">
                        {{ item.startDate | formatDate }} to {{ item.endDate | formatDate }}
                      </li>
                      <li v-else>
                        {{ item.startDate | formatDate }} — current
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
                    Sat for at least {{ application.pjeDays || 30 }} days
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
                    Sat for at least {{ application.pjeDays || 30 }} days in one or all of these appointments
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
                    <ul
                      v-if="item.startDate"
                      class="govuk-list"
                    >
                      <li v-if="item.endDate">
                        {{ item.startDate | formatDate }} to {{ item.endDate | formatDate }}
                      </li>
                      <li v-else>
                        {{ item.startDate | formatDate }} — current
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

            <div
              v-if="!isPanelView"
              class="govuk-!-margin-top-9"
            >
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
                <div class="govuk-summary-list__row text-right print-none button-right">
                  <dt class="govuk-summary-list__key" />
                  <dd class="govuk-summary-list__value">
                    <button 
                      class="govuk-button btn-unlock" 
                      @click="editAssessor(1)"
                    >
                      Edit
                    </button>
                  </dd>
                </div>
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

                <div class="govuk-summary-list__row print-none">
                  <dt class="govuk-summary-list__key">
                    Email
                  </dt>
                  <dd class="govuk-summary-list__value">
                    {{ application.firstAssessorEmail }}
                  </dd>
                </div>

                <div class="govuk-summary-list__row print-none">
                  <dt class="govuk-summary-list__key">
                    Telephone
                  </dt>
                  <dd class="govuk-summary-list__value">
                    {{ application.firstAssessorPhone }}
                  </dd>
                </div>

                <hr class="govuk-section-break govuk-section-break--l">
                <div class="govuk-summary-list__row text-right print-none button-right">
                  <dt class="govuk-summary-list__key" />
                  <dd class="govuk-summary-list__value">
                    <button 
                      class="govuk-button btn-unlock" 
                      @click="editAssessor(2)"
                    >
                      Edit
                    </button>
                  </dd>
                </div>
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

                <div class="govuk-summary-list__row print-none">
                  <dt class="govuk-summary-list__key">
                    Email
                  </dt>
                  <dd class="govuk-summary-list__value">
                    {{ application.secondAssessorEmail }}
                  </dd>
                </div>

                <div class="govuk-summary-list__row print-none">
                  <dt class="govuk-summary-list__key">
                    Telephone
                  </dt>
                  <dd class="govuk-summary-list__value">
                    {{ application.secondAssessorPhone }}
                  </dd>
                </div>
              </dl>
            </div>

            <Modal 
              ref="modalRef"
            >
              <component 
                :is="`IndependentAssessorChange`" 
                v-bind="assessorDetails"
                @close="closeModal"
              />
            </Modal>

            <div
              v-if="application.selectionCriteriaAnswers"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Additional Selection Criteria
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
              v-if="showStatementOfSuitability"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Statement of suitability
              </h2>

              <dl class="govuk-summary-list">
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
                    <div>
                      <FileUpload
                        id="suitability-statement-file"
                        ref="suitability-statement"
                        v-model="application.uploadedSuitabilityStatement"
                        name="suitability-statement"
                        :path="`/exercise/${exercise.id}/user/${application.userId}`"
                        required
                        @input="val => doFileUpload(val, 'uploadedSuitabilityStatement')"
                      />
                    </div>
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
                    <div>
                      <FileUpload
                        id="self-assessment-upload"
                        ref="self-assessment"
                        v-model="application.uploadedSelfAssessment"
                        name="self-assessment"
                        :path="`/exercise/${exercise.id}/user/${application.userId}`"
                        required
                        @input="val => doFileUpload(val, 'uploadedSelfAssessment')"
                      />
                    </div>
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

            <div
              v-if="showCoveringLetter"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Covering Letter
              </h2>

              <dl class="govuk-summary-list">
                <div
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key">
                    Uploaded Covering Letter
                  </dt>
                  <dd class="govuk-summary-list__value">
                    <div v-if="application.uploadedCoveringLetter">
                      <DownloadLink
                        :file-name="application.uploadedCoveringLetter"
                        :exercise-id="exercise.id"
                        :user-id="application.userId"
                        title="Covering Letter"
                      />
                    </div>
                    <span v-else>Not yet received</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div v-if="activeTab == 'issues'">
            No issues found
          </div>

          <div v-if="activeTab == 'agency'">
            <AgencyReport />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TabsList from '@/components/Page/TabsList';
import AgencyReport from './AgencyReport.vue';
import DownloadLink from '@/components/DownloadLink';
import EventRenderer from '@/components/Page/EventRenderer';
import EditableField from '@/components/EditableField';
import FileUpload from '@/components/Form/FileUpload';
import jsPDF from 'jspdf';
import htmlDocx from 'html-docx-js/dist/html-docx'; //has to be imported from dist folder
import { saveAs } from 'file-saver';
import Modal from '@/components/Modal/Modal';
import IndependentAssessorChange from '@/components/Modal/views/IndependentAssessorChange';

export default {
  components: {
    TabsList,
    AgencyReport,
    DownloadLink,
    EventRenderer,
    EditableField,
    FileUpload,
    Modal,
    IndependentAssessorChange,
  },
  data() {
    return {
      tabs: [
        {
          ref: 'full',
          title: 'Full information',
        },
        {
          ref: 'panel',
          title: 'Panel pack',
        },
        {
          ref: 'issues',
          title: 'Issues',
        },
        {
          ref: 'agency',
          title: 'Agency report',
        },
      ],
      activeTab: 'full',
      dropDownExpanded: false,
      assessorDetails: {},
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applications() {
      return this.$store.state.applications.records;
    },
    application() {
      return this.$store.state.application.record;
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
    isPanelView() {
      return this.activeTab === 'panel';
    },
    isLegal() {
      return this.exercise.typeOfExercise === 'legal' || this.exercise.typeOfExercise === 'leadership';
    },
    isNonLegal() {
      return this.exercise.typeOfExercise === 'non-legal' || this.exercise.typeOfExercise === 'leadership-non-legal';
    },
    showMemberships() {
      return this.exercise.memberships && this.exercise.memberships.indexOf('none') === -1;
    },
    generateFilename(){
      return this.applicationReferenceNumber ? this.applicationReferenceNumber : 'judicial-appointments-application';
    },
    ethnicGroupDetails() {
      switch (this.application.equalityAndDiversitySurvey.ethnicGroup) {
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
      case 'statement-of-suitability-with-skills-and-abilities-and-covering-letter':
      case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
        return true;
      default:
        return false;
      }
    },
    showCV() {
      switch (this.exercise.assessmentOptions) {
      case 'self-assessment-with-competencies-and-cv':
      case 'statement-of-suitability-with-skills-and-abilities-and-cv':
      case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
        return true;
      default:
        return false;
      }
    },
    showCoveringLetter() {
      switch (this.exercise.assessmentOptions) {
      case 'self-assessment-with-competencies-and-covering-letter':
      case 'self-assessment-with-competencies-and-cv-and-covering-letter':
      case 'statement-of-suitability-with-skills-and-abilities-and-covering-letter':
      case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
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
      case 'self-assessment-with-competencies-and-covering-letter':
      case 'self-assessment-with-competencies-and-cv-and-covering-letter':
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
    isApplied() {
      if (this.application) {
        switch (this.application.status) {
        case 'applied':
          return true;
        default:
          return false;
        }
      }
      return false;
    },
    otherMemberships() {
      // @NOTE this is a bit ugly as we can't just lookup label
      const selected = {};

      if (this.application.professionalMemberships) {
        this.application.professionalMemberships.forEach(membership => {
          if (this.application.memberships[membership]) {
            const otherMembership = this.exercise.otherMemberships.find(m => m.value === membership);
            selected[membership] = {
              ...this.application.memberships[membership],
              label: otherMembership.label,
            };
          }
        });
      }

      return selected;
    },
  },
  watch: {
    '$route.params.applicationId'() {
      this.pageLoad();
    },
  },
  created() {
    this.pageLoad();
  },
  destroyed() {
    this.$store.dispatch('application/unbind');
  },
  methods: {
    pageLoad() {
      if (this.$route.params.tab) {
        this.activeTab = this.$route.params.tab;
      }
      if (this.$route.hash) {  // @TODO move this to within TabsList component
        this.activeTab = this.$route.hash.substring(1);
      }
      if (this.applicationId && (!this.application || this.application.id !== this.applicationId)) {
        this.$store.dispatch('application/bind', this.applicationId);
      }
    },
    nextApplication() {
      if (this.applications && this.applications.length) {
        for (let i = 0, len = this.applications.length; i < len; ++i) {
          if (this.applications[i].id === this.applicationId) {
            if (i < len) {
              this.$router.replace({
                name: 'exercise-applications-application',
                params: { applicationId: this.applications[i + 1].id, status: this.applications[i + 1].status },
              });
            }
            break;
          }
        }
      }
    },
    previousApplication() {
      if (this.applications && this.applications.length) {
        for (let i = 0, len = this.applications.length; i < len; ++i) {
          if (this.applications[i].id === this.applicationId) {
            if (i > 0) {
              this.$router.replace({
                name: 'exercise-applications-application',
                params: { applicationId: this.applications[i - 1].id, status: this.applications[i + 1].status },
              });
            }
            break;
          }
        }
      }
    },
    toggleExpand(){
      this.dropDownExpanded = !this.dropDownExpanded;
    },
    downloadAsPdf() {
      const pdf = new jsPDF();

      pdf.fromHTML(
        this.returnPrintReadyPanelPack(),
        15,
        15,
        {
          width: 170,
          elementHandlers: {
            '.jac-button-group': () => true,
          },
        },
      );

      const fileName = this.generateFilename;

      pdf.save(`${fileName}.pdf`);
    },
    returnPrintReadyPanelPack(){
      const htmlCollection = (document.querySelector('#panel-pack-div'));
      const virtualDiv = document.createElement('div');
      virtualDiv.innerHTML = htmlCollection.innerHTML;
      const printNoneEls = virtualDiv.querySelectorAll('.print-none');
      printNoneEls.forEach(e => e.remove());
      return virtualDiv;
    },
    copyToClipboard() {
      const panelPack = this.returnPrintReadyPanelPack();
      const el = document.createElement('textarea');
      el.value = panelPack.textContent.split('  ').join('\n');
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      document.querySelector('#clipboard-button').innerText = 'Copied';
      setTimeout(() => {
        document.querySelector('#clipboard-button').innerText = 'Copy to clipboard';
      },3000);
    },
    downloadAsDoc() {
      const fileName = this.generateFilename;
      const content = this.returnPrintReadyPanelPack().outerHTML;
      const converted = htmlDocx.asBlob(content);
      saveAs(converted, `${fileName}.docx`);
    },
    unlock() {
      this.$store.dispatch('application/unlock');
    },
    submitApplication() {
      this.$store.dispatch('application/submit');
    },
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
    changeAssesorDetails(objChanged) {
      this.$store.dispatch('application/update', { data: objChanged, id: this.applicationId });
    },
    changeUserDetails(objChanged) {
      const myPersonalDetails = { ...this.application.personalDetails, ...objChanged };
      this.$store.dispatch('application/update', { data: { personalDetails: myPersonalDetails }, id: this.applicationId });
      this.$store.dispatch('candidates/savePersonalDetails', { data: objChanged, id: this.application.userId });
    },
    doFileUpload(val, field) {
      if (val) {
        this.$store.dispatch('application/update', { data: { [field]: val }, id: this.applicationId });
      }
    },
    editAssessor(AssessorNr) {
      this.assessorDetails = {};
      if (AssessorNr === 1) {
        this.assessorDetails = {
          AssessorNr: AssessorNr,
          applicationId: this.application.id,
          email: this.application.firstAssessorEmail,
          fullName: this.application.firstAssessorFullName,
          phone: this.application.firstAssessorPhone,
          title: this.application.firstAssessorTitle,
        };
      } else if (AssessorNr === 2) {
        this.assessorDetails = {
          AssessorNr: AssessorNr,
          applicationId: this.application.id,
          email: this.application.secondAssessorEmail,
          fullName: this.application.secondAssessorFullName,
          phone: this.application.secondAssessorPhone,
          title: this.application.secondAssessorTitle,
        };
      }
      this.openModal();
    },
    openModal(){
      this.$refs.modalRef.openModal();
    },
    closeModal() {
      this.$refs.modalRef.closeModal();
    },
  },
};
</script>

<style lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }

.drop-down-button{
  margin-bottom: 1px;
  min-width:150px;
  max-width:150px;
  width:150px;
}

</style>
