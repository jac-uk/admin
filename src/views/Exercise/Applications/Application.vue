<template>
  <div>
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
              <span
                class=" govuk-!-margin-left-4"
              >
                <button
                  v-if="editMode"
                  class="govuk-button govuk-button btn-unlock"
                  @click="toggleEdit"
                >
                  Done editing
                </button>
                <button
                  v-else
                  class="govuk-button govuk-button--secondary btn-mark-as-applied"
                  @click="toggleEdit"
                >
                  Edit Application
                </button>
              </span>
            </div>
          </div>

          <div class="govuk-grid-row">
            <div class="govuk-grid-column-one-third">
              <div class="panel govuk-!-margin-bottom-7 govuk-!-padding-4 background-light-grey">
                <span class="govuk-caption-m">
                  Created on
                </span>
                <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
                  {{ application.createdAt | formatDate | showAlternative("Unknown") }}
                </h2>
              </div>
            </div>

            <div class="govuk-grid-column-one-third">
              <div
                v-if="isApplied"
                class="panel govuk-!-margin-bottom-7 background-light-grey"
              >
                <span class="govuk-caption-m">Submitted on</span>
                <h2
                  class="govuk-heading-m govuk-!-margin-bottom-0"
                >
                  {{ application.appliedAt | formatDate | showAlternative("Unknown") }}
                </h2>
              </div>
              <div
                v-else
                class="panel govuk-!-margin-bottom-7 background-light-grey"
              >
                <span class="govuk-caption-m">Status</span>
                <h2
                  class="govuk-heading-m govuk-!-margin-bottom-0"
                >
                  Draft
                </h2>
              </div>
            </div>

            <div class="govuk-grid-column-one-third">
              <div class="panel govuk-!-margin-bottom-7 background-light-grey">
                <span class="govuk-caption-m">
                  Extension
                </span>
                <button
                  v-if="application.dateExtension"
                  @click="$refs.modalRefExtension.openModal()"
                >
                  Change
                </button>
                <h2
                  v-if="application.dateExtension"
                  class="govuk-heading-m govuk-!-margin-bottom-0"
                >
                  {{ application.dateExtension | formatDate | showAlternative("Unknown") }}
                </h2>
                <button
                  v-else
                  class="govuk-button govuk-!-margin-bottom-0"
                  @click="$refs.modalRefExtension.openModal()"
                >
                  Give Extension
                </button>
              </div>
            </div>
          </div>

          <Modal
            ref="modalRefExtension"
          >
            <component
              :is="`SubmissionExtension`"
              v-bind="{ applicationId: applicationId, userId: application.userId, dateExtension: application.dateExtension }"
              @close="$refs.modalRefExtension.closeModal()"
            />
          </Modal>

          <TabsList
            class="print-none"
            :tabs="tabs"
            :active-tab.sync="activeTab"
          />

          <div
            v-if="activeTab == 'full' || activeTab == 'panel'"
            class="application-details"
          >
            <!---
            <div v-if="application && exercise">
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

                <PersonalDetailsSummary 
                  :application="application"
                  :editable="(editMode && authorisedToPerformAction)"
                />
              </div>  

            <div
              v-if="!isPanelView"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Character information
              </h2>

              <dl v-if="isVersion2 && application.characterInformationV2">
                <CharacterInformationSummary
                  :application="application"
                  :editable="(editMode && authorisedToPerformAction)"
                  :character-information="application.characterInformationV2"
                />
              </dl> 

              <dl
                v-else
                class="govuk-summary-list"
              >
                <CharacterInformationSummary
                  :application="application"
                  :editable="(editMode && authorisedToPerformAction)"
                />
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
                <dl>
                  <EqualityAndDiversityInformationSummary
                    :application="application"
                    :editable="editable"
                    :is-legal="isLegal"
                  />
                </dl>
              </div>
            <div
              v-if="!isPanelView"
              class="govuk-!-margin-top-9"
            >
              <PreferencesSummary
                :application="application"
                :exercise="exercise"
                :editable="(editMode && authorisedToPerformAction)"
                :is-panel-view="isPanelView"
              />
            </div>
              ---->

            <div
              v-if="isLegal"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Qualifications
              </h2>
              <QualificationsSummary />
            </div>

            <div
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Memberships
              </h2>

              <MembershipsSummary />
            </div>

            <div
              v-if="isLegal"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Post-qualification experience
              </h2>

              <PostQualificationExperienceSummary />
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
                    {{ application.feePaidOrSalariedJudge | lookup | toYesNo| showAlternative('No Answer provided') }}
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
              v-else
              class="govuk-body"
            >
              No information provided
            </div>

            <div
              v-if="isNonLegal"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Experience
              </h2>

              <div v-if="application.experience && application.experience.length">
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
                v-else
                class="govuk-body"
              >
                No information provided
              </div>
            </div>

            <div
              v-if="isLegal"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Post-qualification experience
              </h2>

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
            </div>

            <div
              v-if="!isNonLegal"
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

            <div
              v-if="hasIndependentAssessments"
              class="govuk-!-margin-top-9"
            >
              <div
                class="govuk-summary-list__row"
              >
                <dt class="govuk-summary-list__key">
                  Fee-paid or salaried judge
                </dt>
                <dd class="govuk-summary-list__value">
                  {{ application.feePaidOrSalariedJudge | lookup | toYesNo| showAlternative('No Answer provided') }}
                </dd>
              </div>

              <div
                v-if="application.feePaidOrSalariedJudge === true"
                class="govuk-summary-list__row"
              >
                <dt class="govuk-summary-list__key">
                  Sat for at least {{ exercise.pjeDays || 30 }} days
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
                  Sat for at least {{ exercise.pjeDays || 30 }} days in one or all of these appointments
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

              <dl
                v-if="applicantProvidedFirstAssessor"
                class="govuk-summary-list"
              >
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

                <div
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key">
                    Full name
                  </dt>
                  <dd class="govuk-summary-list__value">
                    {{ application.firstAssessorFullName }}
                  </dd>
                </div>

                <div
                  class="govuk-summary-list__row"
                >
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
              </dl>
              <dl
                v-else
                class="govuk-summary-list"
              >
                <dt
                  class="govuk-summary-list__key"
                >
                  No information for First Assessor
                </dt>
                <dd class="govuk-summary-list__value">
                  {{ application.canGiveReasonableLOS | toYesNo }}
                  <p v-if="application.canGiveReasonableLOS == false">
                    {{ application.cantGiveReasonableLOSDetails }}
                  </p>
                </dd>
              </dl>
            </div>

            <div
              v-if="hasIndependentAssessments"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l govuk-!-margin-bottom-0">
                Independent assessors
              </h2>

              <dl
                v-if="applicantProvidedFirstAssessor"
                class="govuk-summary-list"
              >
                <div class="govuk-summary-list__row text-right print-none button-right">
                  <dt class="govuk-summary-list__key" />
                  <dd class="govuk-summary-list__value">
                    <button
                      class="govuk-button btn-unlock"
                      @click="editAssessor(1)"
                    >
                      Add
                    </button>
                  </dd>
                </div>
              </dl>

              <hr class="govuk-section-break govuk-section-break--l">

              <dl
                v-if="applicantProvidedSecondAssessor"
                class="govuk-summary-list"
              >
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

                <div
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key">
                    Full name
                  </dt>
                  <dd class="govuk-summary-list__value">
                    {{ application.secondAssessorFullName }}
                  </dd>
                </div>

                <div
                  class="govuk-summary-list__row"
                >
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
              <dl
                v-else
                class="govuk-summary-list"
              >
                <dt
                  class="govuk-summary-list__key"
                >
                  No information for Second Assessor
                </dt>
                <dd class="govuk-summary-list__value">
                  <button
                    class="govuk-button btn-unlock"
                    @click="editAssessor(2)"
                  >
                    Add
                  </button>
                </dd>
              </dl>

              <Modal
                ref="modalRef"
              >
                <component
                  :is="`IndependentAssessorChange`"
                  v-bind="assessorDetails"
                  @close="closeModal('modalRef')"
                />
              </Modal>
            </div>

            <div
              v-if="hasLeadershipJudgeAssessment"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l govuk-!-margin-bottom-0">
                Leadership Judge details
              </h2>

              <dl
                v-if="application.leadershipJudgeDetails"
                class="govuk-summary-list"
              >
                <div class="govuk-summary-list__row text-right print-none button-right">
                  <dt class="govuk-summary-list__key" />
                  <dd class="govuk-summary-list__value">
                    <button
                      class="govuk-button btn-unlock"
                      @click="editLeadershipJudgeDetails"
                    >
                      Edit
                    </button>
                  </dd>
                </div>

                <div
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key">
                    Full name
                  </dt>
                  <dd class="govuk-summary-list__value">
                    {{ application.leadershipJudgeDetails.fullName }}
                  </dd>
                </div>

                <div
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key">
                    Title or position
                  </dt>
                  <dd class="govuk-summary-list__value">
                    {{ application.leadershipJudgeDetails.title }}
                  </dd>
                </div>

                <div
                  v-if="hasLeadershipJudgeAssessment"
                  class="govuk-!-margin-top-9"
                >
                  <h2 class="govuk-heading-l govuk-!-margin-bottom-0">
                    Leadership Judge details
                  </h2>

                  <div class="govuk-summary-list__row print-none">
                    <dt class="govuk-summary-list__key">
                      Telephone
                    </dt>
                    <dd class="govuk-summary-list__value">
                      {{ application.leadershipJudgeDetails.phone }}
                    </dd>
                  </div>
                </div>
              </dl>
              <dl
                v-else
                class="govuk-summary-list"
              >
                <dt
                  class="govuk-summary-list__key"
                >
                  No information for Leadership Judge
                </dt>
                <dd class="govuk-summary-list__value">
                  <button
                    class="govuk-button btn-unlock"
                    @click="editLeadershipJudgeDetails"
                  >
                    Add
                  </button>
                </dd>
              </dl>
              <Modal
                ref="modalLeadershipJudgeDetails"
              >
                <component
                  :is="`LeadershipJudgeDetails`"
                  v-bind="application.leadershipJudgeDetails"
                  :application-id="applicationId"
                  @close="closeModal('modalLeadershipJudgeDetails')"
                />
              </Modal>
            </div>

            <div
              v-if="exercise.aSCApply"
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
              v-if="hasStatementOfSuitability"
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
              v-if="hasSelfAssessment"
              class="govuk-!-margin-top-9"
            >
              <h2 class="govuk-heading-l">
                Self assessment competencies
              </h2>

              <dl class="govuk-summary-list">
                <div
                  v-for="(item, index) in application.selectionCriteriaAnswers"
                  :key="index"
                  class="govuk-summary-list__row"
                >
                  <dt class="govuk-summary-list__key">
                    {{ exercise.selectionCriteria[index].title }}
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
              v-if="hasStatementOfSuitability"
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
              v-if="hasSelfAssessment"
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

            <div
              v-if="hasCV"
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
              v-if="hasCoveringLetter"
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

          <div v-if="activeTab == 'notes'">
            <Notes
              title="Notes about the Application"
              :candidate-id="application.userId"
              :application-id="applicationId"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <PageNotFound
        page="Application"
      />
    </div>
  </div>
</template>

<script>
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import AgencyReport from './AgencyReport.vue';
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink';
import EventRenderer from '@jac-uk/jac-kit/draftComponents/EventRenderer';
import FileUpload from '@jac-uk/jac-kit/draftComponents/Form/FileUpload';
import jsPDF from 'jspdf';
import htmlDocx from 'html-docx-js/dist/html-docx'; //has to be imported from dist folder
import { saveAs } from 'file-saver';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import IndependentAssessorChange from '@/components/ModalViews/IndependentAssessorChange';
import LeadershipJudgeDetails from '@/components/ModalViews/LeadershipJudgeDetails';
import SubmissionExtension from '@/components/ModalViews/SubmissionExtension';
import Notes from '@/components/Notes/Notes';
import PersonalDetailsSummary from '@/views/InformationReview/PersonalDetailsSummary';
import CharacterInformationSummary from '@/views/InformationReview/CharacterInformationSummary';
import EqualityAndDiversityInformationSummary from '@/views/InformationReview/EqualityAndDiversityInformationSummary';
import PreferencesSummary from '@/views/InformationReview/PreferencesSummary';
import QualificationsSummary from '@/views/InformationReview/QualificationsSummary';
import PostQualificationExperienceSummary from '@/views/InformationReview/PostQualificationExperienceSummary';
// import MembershipsSummary from '@/views/InformationReview/MembershipsSummary';

import splitFullName from '@jac-uk/jac-kit/helpers/splitFullName';
import { authorisedToPerformAction }  from '@/helpers/authUsers';
import PageNotFound from '@/views/Errors/PageNotFound';
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';

import {
  isLegal,
  isNonLegal,
  hasRelevantMemberships,
  hasStatementOfSuitability,
  hasIndependentAssessments,
  hasLeadershipJudgeAssessment,
  hasCV,
  hasCoveringLetter,
  hasSelfAssessment
} from '@/helpers/exerciseHelper';

export default {
  components: {
    TabsList,
    AgencyReport,
    DownloadLink,
    EventRenderer,
    FileUpload,
    Modal,
    IndependentAssessorChange,
    LeadershipJudgeDetails,
    SubmissionExtension,
    Notes,
    PersonalDetailsSummary,
    CharacterInformationSummary,
    PageNotFound,
    EqualityAndDiversityInformationSummary,
    InformationReviewRenderer,
    PreferencesSummary,
    QualificationsSummary,
    PostQualificationExperienceSummary,
  },
  data() {
    return {
      authorisedToPerformAction: false,
      editMode: false,
      tabs: [
        {
          ref: 'full',
          title: 'Full information',
        },
        {
          ref: 'notes',
          title: 'Notes',
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
    editable() {
      return this.editMode && this.authorisedToPerformAction;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isLegal() {
      return isLegal(this.exercise);
    },
    isNonLegal() {
      return isNonLegal(this.exercise);
    },
    hasRelevantMemberships() {
      return hasRelevantMemberships(this.exercise);
    },
    hasStatementOfSuitability() {
      return hasStatementOfSuitability(this.exercise);
    },
    hasIndependentAssessments() {
      return hasIndependentAssessments(this.exercise);
    },
    hasLeadershipJudgeAssessment() {
      return hasLeadershipJudgeAssessment(this.exercise);
    },
    hasCV() {
      return hasCV(this.exercise);
    },
    hasCoveringLetter() {
      return hasCoveringLetter(this.exercise);
    },
    hasSelfAssessment() {
      return hasSelfAssessment(this.exercise);
    },
    isVersion2() {
      if (this.exercise._applicationVersion && this.exercise._applicationVersion === 2) {
        return true;
      }
      return false;
    },
    applications() {
      return this.$store.state.applications.records;
    },
    application() {
      return this.$store.getters['application/data']();
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
    generateFilename() {
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
    applicantProvidedFirstAssessor() {
      const { firstAssessorEmail, firstAssessorFullName, firstAssessorPhone, firstAssessorTitle } = this.application;
      return (firstAssessorEmail || firstAssessorFullName || firstAssessorPhone || firstAssessorTitle);
    },
    applicantProvidedSecondAssessor() {
      const { secondAssessorEmail, secondAssessorFullName, secondAssessorPhone, secondAssessorTitle } = this.application;
      return (secondAssessorEmail || secondAssessorFullName || secondAssessorPhone || secondAssessorTitle);
    },
    title() {
      let title = this.application.personalDetails.title;
      if (!title) {
        title = '';
      }
      return title;
    },
    firstName() {
      let firstName = this.application.personalDetails.firstName;
      const fullName = this.application.personalDetails.fullName;
      if (!firstName) {
        if (fullName) {
          const result = splitFullName(fullName);
          firstName = result[0];
        } else {
          firstName = '';
        }
      }
      return firstName;
    },
    lastName() {
      let lastName = this.application.personalDetails.lastName;
      const fullName = this.application.personalDetails.fullName;
      if (!lastName) {
        if (fullName) {
          const result = splitFullName(fullName);
          lastName = result[1];
        } else {
          lastName = '';
        }
      }
      return lastName;
    },
  },
  watch: {
    '$route.params.applicationId'() {
      this.pageLoad();
    },
  },
  created() {
    this.pageLoad();
    this.$root.$on('changeUserDetails', (obj) => this.changeUserDetails(obj));
  },
  destroyed() {
    this.$store.dispatch('application/unbind');
  },
  methods: {
    async pageLoad() {
      this.authorisedToPerformAction = await authorisedToPerformAction(this.$store.state.auth.currentUser.email);
      if (this.$route.params.tab) {
        this.activeTab = this.$route.params.tab;
      }
      if (this.$route.hash) {  // @TODO move this to within TabsList component
        this.activeTab = this.$route.hash.substring(1);
      }
      if (this.applicationId && (!this.application || this.$store.state.application.record.id !== this.applicationId)) {
        await this.$store.dispatch('application/bind', this.applicationId);
        if (this.$route.name === 'exercise-application') {  // redirect so the status side navigation is highlighted
          this.$router.replace({
            name: 'exercise-applications-application',
            params: { applicationId: this.applicationId, status: this.application.status },
          });
        }
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
    toggleEdit(){
      this.editMode = !this.editMode;
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
    doFileUpload(val, field) {
      if (val) {
        this.$store.dispatch('application/update', { data: { [field]: val }, id: this.applicationId });
      }
    },
    editAssessor(AssessorNr) {
      // this.assessorDetails = {};
      if (AssessorNr === 1) {
        this.assessorDetails = {
          AssessorNr: AssessorNr,
          applicationId: this.applicationId,
          email: this.application.firstAssessorEmail,
          fullName: this.application.firstAssessorFullName,
          phone: this.application.firstAssessorPhone,
          title: this.application.firstAssessorTitle,
        };
      }
      if (AssessorNr === 2) {
        this.assessorDetails = {
          AssessorNr: AssessorNr,
          applicationId: this.applicationId,
          email: this.application.secondAssessorEmail,
          fullName: this.application.secondAssessorFullName,
          phone: this.application.secondAssessorPhone,
          title: this.application.secondAssessorTitle,
        };
      }
      this.modalRef.openModal();
    },
    editLeadershipJudgeDetails() {
      this.$refs.modalLeadershipJudgeDetails.openModal();
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
    },
    changeApplication(objChanged) {
      this.$store.dispatch('application/update', { data: objChanged, id: this.applicationId });
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
