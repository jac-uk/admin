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
                  :options="['advocate-scotland', 'barrister', 'CILEx', 'solicitor']"
                  type="selection"
                  @changeField="changeQualificationOrMembership"
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
                  @changeField="changeQualificationOrMembership"
                />
              </dd>
            </div>
            <div
              v-if="qualification.hasOwnProperty('date') || editable"
              class="govuk-summary-list__row"
            >
              <dt
                class="govuk-summary-list__key widerColumn"
              >
                {{ qualification.type === 'barrister' ? 'Date completed pupillage' : 'Date qualified' }} 
              </dt>
              <dd class="govuk-summary-list__value">
                <InformationReviewRenderer
                  :data="application.qualifications[index].date"
                  field="qualifications"
                  extension="date"
                  :index="index"
                  :edit="editable"
                  type="date"
                  @changeField="changeQualificationOrMembership"
                />
              </dd>
            </div> 

            <template>
              <div
                v-if="qualification.type === 'barrister' && ((qualification.qualificationNotComplete && qualification.details) || editable)"
                class="govuk-summary-list__row"
              >
                <dt class="govuk-summary-list__key widerColumn">
                  Has not completed pupillage
                </dt>
                <dd class="govuk-summary-list__value">
                  <InformationReviewRenderer
                    :data="application.qualifications[index].qualificationNotComplete"
                    field="qualifications"
                    extension="qualificationNotComplete"
                    :index="index"
                    :edit="editable"
                    :options="[true, false]"
                    type="selection"
                    @changeField="changeQualificationOrMembership"
                  />
                </dd>
              </div>

              <div
                v-if="qualification.type === 'barrister' && (qualification.qualificationNotComplete === true)"
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
                    @changeField="changeQualificationOrMembership"
                  />
                </dd>
              </div>
            </template>
          </div>
        </dl>
      </div>
      <div
        class="govuk-body"
      >
        <div
          v-if="!applicationHasQualifications"
        >
          No answers provided
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
          @closed="closeModal"
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
              @changeField="changeQualificationOrMembership"
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
              @changeField="changeQualificationOrMembership"
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
              @changeField="changeQualificationOrMembership"
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
                @changeField="changeQualificationOrMembership"
              />
            </li>
            <li v-if="exercise.appliedSchedule=='schedule-2-d'">
              <InformationReviewRenderer
                :data="application.experienceUnderSchedule2D"
                field="experienceUnderSchedule2D"
                :edit="editable"
                @changeField="changeQualificationOrMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
                />
              </dd>
            </div>

            <div
              v-if="showMembershipOption('chartered-institute-of-building')"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Chartered Institue of Building
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                    {{ application.generalMedicalCouncilConditionalStartDate | formatDate }}
                    to {{ application.generalMedicalCouncilConditionalEndDate | formatDate }}
                  </li>
                  <li
                    v-if="(application.generalMedicalCouncilConditionalStartDate
                      && !application.generalMedicalCouncilConditionalEndDate) && !editable"
                  >
                    {{ application.generalMedicalCouncilConditionalStartDate | formatDate }} — current
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
                      @changeField="changeProfessionalMembership"
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
                      @changeField="changeProfessionalMembership"
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
                      @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
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
                  @changeField="changeProfessionalMembership"
                />
              </dd>
            </div>

            {{  }}

            <div
              v-for="(membership, key) in exercise.otherMemberships"
              :key="key"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key widerColumn">
                {{ membership.label }}
                <!-- {{ application.memberships[membership.label] }}  -->
              </dt>
              <dd class="govuk-summary-list__value">
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Date
                </h5>
                <InformationReviewRenderer
                  :data="application.memberships[membership.label].date || null"
                  :edit="editable"
                  :index="membership.label"
                  extension="date"
                  type="date"
                  field="memberships"
                  @changeField="changeQualificationOrMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Number
                </h5>
                <InformationReviewRenderer
                  :data="application.memberships[membership.label].number"
                  :edit="editable"
                  :index="membership.label"
                  extension="number"
                  type="text"
                  field="memberships"
                  @changeField="changeQualificationOrMembership"
                />
                <h5
                  v-if="editable"
                  class="govuk-hint govuk-!-margin-1"
                >
                  Information
                </h5>
                <InformationReviewRenderer
                  :data="application.memberships[membership.label].information"
                  :edit="editable"
                  :index="membership.label"
                  extension="information"
                  type="text"
                  field="memberships"
                  @changeField="changeQualificationOrMembership"
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
        No answers provided
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';

import {
  hasRelevantMemberships,
  isNonLegal
} from '@/helpers/exerciseHelper';

export default {
  name: 'QualificationsAndMembershipsSummary',
  components: {
    InformationReviewRenderer,
    Modal,
    ModalInner,
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
  data() {
    return {
      dataDefault: {
        type: null,
        location: null,
        date: null,
        qualificationNotComplete: null,
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
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationId() {
      return this.$route.params.applicationId;
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
  },
  methods: {
    fieldContains(field, item) {
      if (field && item) {
        if (field === item) {
          return true;
        }
        if (Array.isArray(field) && field.includes(item)) {
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

      if (changedObj.length){
        changedObj = [...changedObj, this.dataDefault];
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

      const updatedApplication = { 
        [obj.field]: {
          ...this.application[obj.field], ...changedObj },
      };
      
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
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
