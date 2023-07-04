<template>
  <div>
    <!-- qualifications -->
    <div>
      <h2
        class="govuk-heading-l govuk-!-margin-top-6"
      >
        Qualifications
      </h2>
      <div v-if="applicationHasQualifications">
        <dl
          v-for="(qualification, index) in application.qualifications"
          :key="qualification.name"
        >
          <button
            v-if="editable"
            class="govuk-button govuk-button--warning govuk-button--secondary govuk-!-margin-bottom-0 float-right"
            @click="openModal(index)"
          >
            Remove
          </button>
          <div
            class="govuk-summary-list govuk-!-margin-bottom-0"
          >
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key widerColumn">
                Qualification
              </dt>
              <dd class="govuk-summary-list__value">
                <InformationReviewRenderer
                  :data="application.qualifications[index].type"
                  field="qualifications"
                  extension="type"
                  :index="index"
                  :edit="editable"
                  :options="qualificationOptions"
                  type="selection"
                  :is-asked="isApplicationPartAsked('relevantQualifications')"
                  @change-field="changeQualificationOrMembership"
                />
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key widerColumn">
                Location
              </dt>
              <dd class="govuk-summary-list__value">
                <InformationReviewRenderer
                  :data="application.qualifications[index].location"
                  field="qualifications"
                  extension="location"
                  :index="index"
                  :edit="editable"
                  :options="['england-wales', 'northern-ireland', 'scotland']"
                  type="selection"
                  :is-asked="isApplicationPartAsked('relevantQualifications')"
                  @change-field="changeQualificationOrMembership"
                />
              </dd>
            </div>
            <div
              v-if="qualification.type !== 'barrister' && (qualification.hasOwnProperty('date') || editable)"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key widerColumn">
                Date qualified
              </dt>
              <dd class="govuk-summary-list__value">
                <InformationReviewRenderer
                  :data="application.qualifications.hasOwnProperty(index) ? application.qualifications[index].date : null"
                  field="qualifications"
                  extension="date"
                  :index="index"
                  :edit="editable"
                  type="date"
                  :is-asked="isApplicationPartAsked('relevantQualifications')"
                  @change-field="changeQualificationOrMembership"
                />
              </dd>
            </div>

            <div
              v-if="qualification.type === 'barrister' && (qualification.hasOwnProperty('calledToBarDate') || editable)"
              class="govuk-summary-list__row"
            >
              <dt
                class="govuk-summary-list__key widerColumn"
              >
                Date called to the Bar
              </dt>
              <dd class="govuk-summary-list__value">
                <InformationReviewRenderer
                  :data="application.qualifications.hasOwnProperty(index) ? application.qualifications[index].calledToBarDate : null"
                  field="qualifications"
                  extension="calledToBarDate"
                  :index="index"
                  :edit="editable"
                  type="date"
                  :is-asked="isApplicationPartAsked('relevantQualifications')"
                  @change-field="changeQualificationOrMembership"
                />
              </dd>
            </div>
            <div
              v-if="qualification.type === 'barrister' && (qualification.hasOwnProperty('completedPupillage') || editable)"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key widerColumn">
                Has completed pupillage
              </dt>
              <dd class="govuk-summary-list__value">
                <InformationReviewRenderer
                  :data="application.qualifications[index].completedPupillage"
                  field="qualifications"
                  extension="completedPupillage"
                  :index="index"
                  :edit="editable"
                  :options="[true, false]"
                  type="selection"
                  :is-asked="isApplicationPartAsked('relevantQualifications')"
                  @change-field="changeQualificationOrMembership"
                />
              </dd>
            </div>

            <div
              v-if="qualification.type === 'barrister' && qualification.completedPupillage && (qualification.hasOwnProperty('date') || editable)"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key widerColumn">
                Date completed pupillage
              </dt>
              <dd class="govuk-summary-list__value">
                <InformationReviewRenderer
                  :data="application.qualifications.hasOwnProperty(index) ? application.qualifications[index].date : null"
                  field="qualifications"
                  extension="date"
                  :index="index"
                  :edit="editable"
                  type="date"
                  :is-asked="isApplicationPartAsked('relevantQualifications')"
                  @change-field="changeQualificationOrMembership"
                />
              </dd>
            </div>

            <div
              v-if="qualification.type === 'barrister' && !qualification.completedPupillage && (qualification.hasOwnProperty('notCompletePupillageReason') || editable)"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key widerColumn">
                Reason for being exempt from pupillage
              </dt>
              <dd class="govuk-summary-list__value">
                <InformationReviewRenderer
                  type="selection"
                  :options="Object.values(NOT_COMPLETE_PUPILLAGE_REASONS)"
                  :data="application.qualifications[index].notCompletePupillageReason"
                  field="qualifications"
                  extension="notCompletePupillageReason"
                  :index="index"
                  :edit="editable"
                  :is-asked="isApplicationPartAsked('relevantQualifications')"
                  @change-field="changeQualificationOrMembership"
                />
              </dd>
            </div>

            <div
              v-if="qualification.type === 'barrister' && !qualification.completedPupillage && qualification.notCompletePupillageReason === NOT_COMPLETE_PUPILLAGE_REASONS.OTHER && (qualification.hasOwnProperty('details') || editable)"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key widerColumn">
                Did not complete pupillage notes
              </dt>
              <dd class="govuk-summary-list__value">
                <InformationReviewRenderer
                  :data="application.qualifications[index].details"
                  field="qualifications"
                  extension="details"
                  :index="index"
                  :edit="editable"
                  :is-asked="isApplicationPartAsked('relevantQualifications')"
                  @change-field="changeQualificationOrMembership"
                />
              </dd>
            </div>

            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key widerColumn">
                {{ membershipNumberLabel(qualification.type) }}
              </dt>
              <dd class="govuk-summary-list__value">
                <InformationReviewRenderer
                  :data="application.qualifications.hasOwnProperty(index) ? application.qualifications[index].membershipNumber : null"
                  field="qualifications"
                  extension="membershipNumber"
                  :index="index"
                  :edit="editable"
                  :is-asked="isApplicationPartAsked('relevantQualifications')"
                  @change-field="changeQualificationOrMembership"
                />
              </dd>
            </div>
          </div>
        </dl>

        <template v-if="notCompletedPupillage">
          <dl>
            <div
              class="govuk-summary-list govuk-!-margin-bottom-0"
            >
              <div class="govuk-summary-list__row">
                <dt class="govuk-summary-list__key widerColumn">
                  Uploaded Pupillage Exemption Certificate
                </dt>
                <dd class="govuk-summary-list__value">
                  <div v-if="application.uploadedExemptionCertificate">
                    <DownloadLink
                      :file-name="application.uploadedExemptionCertificate"
                      :exercise-id="exercise.id"
                      :user-id="application.userId"
                      title="Exemption Certificate"
                    />
                  </div>
                  <span v-else>Not yet received</span>
                  <div v-if="editable">
                    <FileUpload
                      id="exemption-certificate-upload"
                      ref="exemption-certificate"
                      v-model="application.uploadedExemptionCertificate"
                      name="exemption-certificate"
                      :enable-delete="true"
                      :path="uploadPath"
                      @input="val => doFileUpload(val, 'uploadedExemptionCertificate')"
                    />
                  </div>
                </dd>
              </div>
            </div>
          </dl>

          <dl>
            <div
              class="govuk-summary-list govuk-!-margin-bottom-0"
            >
              <div class="govuk-summary-list__row">
                <dt class="govuk-summary-list__key widerColumn">
                  Uploaded Pupillage Practicing Certificate
                </dt>
                <dd class="govuk-summary-list__value">
                  <div v-if="application.uploadedPracticingCertificate">
                    <DownloadLink
                      :file-name="application.uploadedPracticingCertificate"
                      :exercise-id="exercise.id"
                      :user-id="application.userId"
                      title="Practicing Certificate"
                    />
                  </div>
                  <span v-else>Not yet received</span>
                  <div v-if="editable">
                    <FileUpload
                      id="practicing-certificate-upload"
                      ref="practicing-certificate"
                      v-model="application.uploadedPracticingCertificate"
                      name="practicing-certificate"
                      :enable-delete="true"
                      :path="uploadPath"
                      @input="val => doFileUpload(val, 'uploadedPracticingCertificate')"
                    />
                  </div>
                </dd>
              </div>
            </div>
          </dl>
        </template>
      </div>
      <div
        class="govuk-body"
      >
        <div
          v-if="!applicationHasQualifications"
        >
          No information
          <span v-if="!isApplicationPartAsked('relevantQualifications')">
            (not asked)
          </span>
          <hr>
        </div>
        <button
          v-if="editable"
          style="display: inline-block;"
          class="print-none govuk-button govuk-!-margin-bottom-0 float-right"
          @click="addQualification"
        >
          Add
        </button>
      </div>
      <Modal
        ref="removeModal"
      >
        <ModalInner
          @close="closeModal"
          @confirmed="removeQualification"
        />
      </Modal>
    </div>
    <!-- applied schedules -->
    <div>
      <dl
        v-if="exercise.schedule2Apply"
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <div
          v-if="exercise.appliedSchedule == 'schedule-2-3'"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Are you applying under Schedule 2(3)?
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.applyingUnderSchedule2Three"
              field="applyingUnderSchedule2Three"
              :edit="editable"
              :options="[true, false]"
              type="selection"
              :is-asked="isApplicationPartAsked('relevantQualifications')"
              @change-field="changeQualificationOrMembership"
            />
          </dd>
        </div>

        <div
          v-if="exercise.appliedSchedule == 'schedule-2-d'"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Are you applying under Schedule 2(d)?
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.applyingUnderSchedule2d"
              field="applyingUnderSchedule2d"
              :edit="editable"
              :options="[true, false]"
              type="selection"
              :is-asked="isApplicationPartAsked('relevantQualifications')"
              @change-field="changeQualificationOrMembership"
            />
          </dd>
        </div>
      </dl>

      <dl
        v-if="scheduleApplies"
        class="govuk-summary-list govuk-!-margin-bottom-8"
      >
        <dt
          class="govuk-summary-list__key widerColumn"
        >
          Explain how you've gained experience in law.
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li v-if="exercise.appliedSchedule=='schedule-2-3'">
              <InformationReviewRenderer
                :data="application.experienceUnderSchedule2Three"
                field="experienceUnderSchedule2Three"
                :edit="editable"
                :is-asked="isApplicationPartAsked('relevantQualifications')"
                @change-field="changeQualificationOrMembership"
              />
            </li>
            <li v-if="exercise.appliedSchedule=='schedule-2-d'">
              <InformationReviewRenderer
                :data="application.experienceUnderSchedule2D"
                field="experienceUnderSchedule2D"
                :edit="editable"
                :is-asked="isApplicationPartAsked('relevantQualifications')"
                @change-field="changeQualificationOrMembership"
              />
            </li>
          </ul>
        </dd>
      </dl>
    </div>
    <!-- memberships + professional Memberships -->
    <div
      v-if="hasRelevantMemberships"
    >
      <h2
        class="govuk-heading-l govuk-!-margin-top-6"
      >
        Memberships
      </h2>
      <div v-if="hasMemberships || editable">
        <!-- professionalMemberships -->
        <dl
          v-if="exercise.memberships.length || application.professionalMemberships || editable"
        >
          <div
            class="govuk-summary-list govuk-!-margin-bottom-0"
          >
            <div
              v-if="showMembershipOption('chartered-association-of-building-engineers')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key widerColumn">
                Chartered Association of Building Engineers
              </dt>
              <dd class="govuk-summary-list__value">
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Date
                </h5>
                <InformationReviewRenderer
                  :data="application.charteredAssociationBuildingEngineersDate"
                  :edit="editable"
                  type="date"
                  field="charteredAssociationBuildingEngineersDate"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Number
                </h5>
                <InformationReviewRenderer
                  :data="application.charteredAssociationBuildingEngineersNumber"
                  :edit="editable"
                  type="text"
                  field="charteredAssociationBuildingEngineersNumber"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Information
                </h5>
                <InformationReviewRenderer
                  :data="application.charteredAssociationBuildingEngineersInformation"
                  :edit="editable"
                  type="text"
                  field="charteredAssociationBuildingEngineersInformation"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
              </dd>
            </div>

            <div
              v-if="showMembershipOption('chartered-institute-of-building')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Chartered Institute of Building
              </dt>
              <dd class="govuk-summary-list__value">
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Date
                </h5>
                <InformationReviewRenderer
                  :data="application.charteredInstituteBuildingDate"
                  :edit="editable"
                  type="date"
                  field="charteredInstituteBuildingDate"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Number
                </h5>
                <InformationReviewRenderer
                  :data="application.charteredInstituteBuildingNumber"
                  :edit="editable"
                  type="text"
                  field="charteredInstituteBuildingNumber"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Information
                </h5>
                <InformationReviewRenderer
                  :data="application.charteredInstituteBuildingInformation"
                  :edit="editable"
                  type="text"
                  field="charteredInstituteBuildingInformation"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
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
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Date
                </h5>
                <InformationReviewRenderer
                  :data="application.charteredInstituteEnvironmentalHealthDate"
                  :edit="editable"
                  type="date"
                  field="charteredInstituteEnvironmentalHealthDate"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Number
                </h5>
                <InformationReviewRenderer
                  :data="application.charteredInstituteEnvironmentalHealthNumber"
                  :edit="editable"
                  type="text"
                  field="charteredInstituteEnvironmentalHealthNumber"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Information
                </h5>
                <InformationReviewRenderer
                  :data="application.charteredInstituteEnvironmentalHealthInformation"
                  :edit="editable"
                  type="text"
                  field="charteredInstituteEnvironmentalHealthInformation"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
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
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Date
                </h5>
                <InformationReviewRenderer
                  :data="application.generalMedicalCouncilDate"
                  :edit="editable"
                  type="date"
                  field="generalMedicalCouncilDate"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Number
                </h5>
                <InformationReviewRenderer
                  :data="application.generalMedicalCouncilNumber"
                  :edit="editable"
                  type="text"
                  field="generalMedicalCouncilNumber"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Information
                </h5>
                <InformationReviewRenderer
                  :data="application.generalMedicalCouncilInformation"
                  :edit="editable"
                  type="text"
                  field="generalMedicalCouncilInformation"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <ul
                  v-if="application.generalMedicalCouncilConditional"
                  class="govuk-list"
                >
                  <p class="govuk-hint">
                    Conditions
                  </p>
                  <li
                    v-if="(application.generalMedicalCouncilConditionalStartDate
                      && application.generalMedicalCouncilConditionalEndDate) && !editable"
                  >
                    {{ $filters.formatDate(application.generalMedicalCouncilConditionalStartDate) }}
                    to {{ $filters.formatDate(application.generalMedicalCouncilConditionalEndDate) }}
                  </li>
                  <li
                    v-if="(application.generalMedicalCouncilConditionalStartDate
                      && !application.generalMedicalCouncilConditionalEndDate) && !editable"
                  >
                    {{ $filters.formatDate(application.generalMedicalCouncilConditionalStartDate) }} — current
                  </li>
                  <li
                    v-if="editable"
                  >
                    <h5
                      class="govuk-hint govuk-!-margin-1"
                    >
                      Start Date
                    </h5>
                    <InformationReviewRenderer
                      :data="application.generalMedicalCouncilConditionalStartDate"
                      :edit="editable"
                      type="date"
                      field="generalMedicalCouncilConditionalStartDate"
                      :is-asked="isApplicationPartAsked('relevantMemberships')"
                      @change-field="changeProfessionalMembership"
                    />
                    <h5
                      class="govuk-hint govuk-!-margin-1"
                    >
                      End Date
                    </h5>
                    <InformationReviewRenderer
                      :data="application.generalMedicalCouncilConditionalEndDate"
                      :edit="editable"
                      type="date"
                      field="generalMedicalCouncilConditionalEndDate"
                      :is-asked="isApplicationPartAsked('relevantMemberships')"
                      @change-field="changeProfessionalMembership"
                    />
                  </li>
                  <li>
                    <h5
                      v-if="editable"
                      class="govuk-hint govuk-!-margin-1"
                    >
                      Details
                    </h5>
                    <InformationReviewRenderer
                      :data="application.generalMedicalCouncilConditionalDetails"
                      :edit="editable"
                      type="text"
                      field="generalMedicalCouncilConditionalDetails"
                      :is-asked="isApplicationPartAsked('relevantMemberships')"
                      @change-field="changeProfessionalMembership"
                    />
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
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Date
                </h5>
                <InformationReviewRenderer
                  :data="application.royalCollegeOfPsychiatristsDate"
                  :edit="editable"
                  type="date"
                  field="royalCollegeOfPsychiatristsDate"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Number
                </h5>
                <InformationReviewRenderer
                  :data="application.royalCollegeOfPsychiatristsNumber"
                  :edit="editable"
                  type="text"
                  field="royalCollegeOfPsychiatristsNumber"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Information
                </h5>
                <InformationReviewRenderer
                  :data="application.royalCollegeOfPsychiatristsInformation"
                  :edit="editable"
                  type="text"
                  field="royalCollegeOfPsychiatristsInformation"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
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
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Date
                </h5>
                <InformationReviewRenderer
                  :data="application.royalInstitutionCharteredSurveyorsDate"
                  :edit="editable"
                  type="date"
                  field="royalInstitutionCharteredSurveyorsDate"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Number
                </h5>
                <InformationReviewRenderer
                  :data="application.royalInstitutionCharteredSurveyorsNumber"
                  :edit="editable"
                  type="text"
                  field="royalInstitutionCharteredSurveyorsNumber"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Information
                </h5>
                <InformationReviewRenderer
                  :data="application.royalInstitutionCharteredSurveyorsInformation"
                  :edit="editable"
                  type="text"
                  field="royalInstitutionCharteredSurveyorsInformation"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
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
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Date
                </h5>
                <InformationReviewRenderer
                  :data="application.royalInstituteBritishArchitectsDate"
                  :edit="editable"
                  type="date"
                  field="royalInstituteBritishArchitectsDate"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Number
                </h5>
                <InformationReviewRenderer
                  :data="application.royalInstituteBritishArchitectsNumber"
                  :edit="editable"
                  type="text"
                  field="royalInstituteBritishArchitectsNumber"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Information
                </h5>
                <InformationReviewRenderer
                  :data="application.royalInstituteBritishArchitectsInformation"
                  :edit="editable"
                  type="text"
                  field="royalInstituteBritishArchitectsInformation"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeProfessionalMembership"
                />
              </dd>
            </div>

            <div
              v-for="(membership, key) in exercise.otherMemberships"
              :key="key"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key widerColumn">
                {{ membership.label }}
              </dt>
              <dd class="govuk-summary-list__value">
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Date
                </h5>
                <InformationReviewRenderer
                  :data="(application.memberships.hasOwnProperty(membership.value)) ? application.memberships[membership.value].date : null"
                  :edit="editable"
                  :index="membership.value"
                  extension="date"
                  type="date"
                  field="memberships"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeQualificationOrMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Number
                </h5>
                <InformationReviewRenderer
                  :data="(application.memberships.hasOwnProperty(membership.value)) ? application.memberships[membership.value].number : null"
                  :edit="editable"
                  :index="membership.value"
                  extension="number"
                  type="text"
                  field="memberships"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeQualificationOrMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Information
                </h5>
                <InformationReviewRenderer
                  :data="application.memberships.hasOwnProperty(membership.value) ? application.memberships[membership.value].information : null"
                  :edit="editable"
                  :index="membership.value"
                  extension="information"
                  type="text"
                  field="memberships"
                  :is-asked="isApplicationPartAsked('relevantMemberships')"
                  @change-field="changeQualificationOrMembership"
                />
              </dd>
            </div>
          </div>
        </dl>
      </div>
      <div
        v-else
        class="govuk-body"
      >
        No information
        <span v-if="!isApplicationPartAsked('relevantMemberships')">
          (not asked)
        </span>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import { NOT_COMPLETE_PUPILLAGE_REASONS } from '@jac-uk/jac-kit/helpers/constants';
import {
  hasRelevantMemberships,
  isNonLegal,
  isApplicationPartAsked
} from '@/helpers/exerciseHelper';
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink';
import FileUpload from '@jac-uk/jac-kit/draftComponents/Form/FileUpload';
import _has from 'lodash/has';

const membershipNumbers = {
  barrister: 'Bar membership number',
  solicitor: 'Solicitors Regulation Authority number',
  default: 'Membership number',
};

export default {
  name: 'QualificationsAndMembershipsSummary',
  components: {
    InformationReviewRenderer,
    Modal,
    ModalInner,
    DownloadLink,
    FileUpload,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  emits: ['updateApplication'],
  data() {
    return {
      NOT_COMPLETE_PUPILLAGE_REASONS,
      membershipNumbers,
      dataDefault: {
        type: null,
        location: null,
        date: null,
        completedPupillage: null,
        notCompletePupillageReason: null,
        details: null,
      },
      currentIndex: null,
    };
  },
  computed: {
    applicationHasQualifications() {
      if (this.application.qualifications) {
        return Object.values(this.application.qualifications).length > 0;
      } else {
        return false;
      }
    },
    qualificationOptions() {
      return this.exercise.otherQualifications ? [...['advocate-scotland', 'barrister', 'CILEx', 'solicitor'], this.exercise.otherQualifications] : ['advocate-scotland', 'barrister', 'CILEx', 'solicitor'];
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    uploadPath() {
      return `/exercise/${this.exercise.id}/user/${this.application.userId}`;
    },
    hasRelevantMemberships() {
      return hasRelevantMemberships(this.exercise);
    },
    hasMemberships() {
      if (this.exercise.memberships) {
        return this.exercise.memberships.length;
      } else if (this.application.memberships) {
        return Object.keys(this.application.memberships).length;
      } else if (this.application.professionalMemberships) {
        return this.application.professionalMemberships;
      } else {
        return false;
      }
    },
    isNonLegal() {
      return isNonLegal(this.exercise);
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
    scheduleApplies(){
      return (this.exercise.appliedSchedule == 'schedule-2-3' && this.application.applyingUnderSchedule2Three) ||
        (this.exercise.appliedSchedule == 'schedule-2-d' && this.application.applyingUnderSchedule2d);
    },
    notCompletedPupillage() {
      if (_has(this.application, 'qualifications') && Array.isArray(this.application.qualifications)) {
        const matches = this.application.qualifications.filter(qualification => {
          return qualification.type === 'barrister'
            && 'completedPupillage' in qualification
            && qualification.completedPupillage === false;
        });
        return matches.length > 0;
      }
      return null;
    },
  },
  methods: {
    membershipNumberLabel(type) {
      return membershipNumbers[type] || membershipNumbers.default;
    },
    fieldContains(field, item) {
      if (field && item) {
        if (field === item) {
          return true;
        }
        if (Array.isArray(field) && field.includes(item)) {
          return true;
        }
        if (field.hasOwnProperty(item)){
          return true;
        }
      }
      return false;
    },
    showMembershipOption(ref) {
      if (this.application && this.application.professionalMemberships) {
        return this.application.professionalMemberships.indexOf(ref) >= 0;
      } else if (this.exercise.memberships) {
        return this.exercise.memberships.indexOf(ref) >= 0;
      }
      return false;
    },
    addQualification() {
      let changedObj = this.application.qualifications || [];

      if (changedObj && Array.isArray(changedObj) && changedObj.length) {
        changedObj = [...changedObj, this.dataDefault];
      } else if (changedObj && typeof changedObj === 'object' && Object.values(changedObj).length) {
        changedObj = [...Object.values(changedObj), this.dataDefault];
      } else {
        changedObj = [this.dataDefault];
      }

      this.$emit('updateApplication', { qualifications: changedObj });

    },
    removeQualification() {

      let changedObj = this.application.qualifications || [];

      if (changedObj.length > 0){
        changedObj.splice(this.currentIndex, 1);
      } else {
        changedObj = [];
      }

      this.$emit('updateApplication', { qualifications: changedObj });

      this.$refs.removeModal.closeModal();

    },
    changeQualificationOrMembership(obj) {

      let changedObj = this.application[obj.field] || {};

      if (obj.hasOwnProperty('change') && obj.extension && obj.hasOwnProperty('index')) { //nested field
        if (!changedObj[obj.index]) {
          changedObj = {
            [obj.index]: {},
          };
        }
        changedObj[obj.index][obj.extension] = obj.change;
      } else {
        changedObj = obj;
      }

      let updatedApplication = null;
      // check if field is array
      if (Array.isArray(this.application[obj.field])) {
        updatedApplication = {
          [obj.field]: changedObj,
        };
      } else {
        updatedApplication = {
          [obj.field]: {
            ...this.application[obj.field], ...changedObj },
        };
      }

      this.$emit('updateApplication', updatedApplication);

    },
    changeProfessionalMembership(obj) {
      this.$emit('updateApplication', obj);
    },
    closeModal() {
      this.currentIndex = null;
      this.$refs.removeModal.closeModal();
    },
    openModal(index) {
      this.currentIndex = index;
      this.$refs.removeModal.openModal();
    },
    doFileUpload(val, field) {
      if (val) {
        this.$emit('updateApplication', { [field]: val });
      }
    },
    isApplicationPartAsked(part) {
      return isApplicationPartAsked(this.exercise, part);
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
