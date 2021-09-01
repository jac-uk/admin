<template>
  <div>
    <!-- qualifications -->
    <!-- 
    <div>
      <h2 class="govuk-heading-l">
        Qualifications
      </h2>
      <div v-if="application.qualifications || editable">
        <dl
          v-for="(item, index) in application.qualifications"
          :key="item.name"
          class="govuk-summary-list govuk-!-margin-bottom-5"
        >
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">
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
            <dt class="govuk-summary-list__key">
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
            v-if="item.date || editable"
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
              v-if="(item.qualificationNotComplete && item.details) || editable"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
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
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
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
        </dl>
      </div>
    
      <div
        v-else
        class="govuk-body"
      >
        No information provided
      </div>
    </div> -->

    <!-- applied shedules -->
    <!-- <div>
      <dl
        v-if="exercise.schedule2Apply"
        class="govuk-summary-list"
      >
        <div
          v-if="exercise.appliedSchedule == 'schedule-2-3'"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
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
      </dl>

      <dl
        v-if="(exercise.appliedSchedule=='schedule-2-3' && application.applyingUnderSchedule2Three)
          || (exercise.appliedSchedule=='schedule-2-d' && application.applyingUnderSchedule2d)"
        class="govuk-summary-list  govuk-!-margin-bottom-8"
      >
        <dt
          class="govuk-summary-list__key"
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
    </div> -->
  
    <!-- memberships -->
    <div
      v-if="hasRelevantMemberships"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Memberships
      </h2>
      <!-- {{ otherMemberships }} -->
      <div>
        <!-- v-if="application.professionalMemberships && application.professionalMemberships.length"> -->
        <dl
          class="govuk-summary-list govuk-!-margin-bottom-8"
        >
          <!-- <div
            v-if="showMembershipOption('chartered-association-of-building-engineers')"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key">
              Chartered Association of Building Engineers
            </dt>
            <dd class="govuk-summary-list__value">
              <ul class="govuk-list">
                <li>
                  <InformationReviewRenderer
                    :data="application.charteredAssociationBuildingEngineersDate"
                    field="charteredAssociationBuildingEngineersDate"
                    :edit="editable"
                    type="date"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.charteredAssociationBuildingEngineersNumber"
                    field="charteredAssociationBuildingEngineersNumber"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.charteredAssociationBuildingEngineersInformation"
                    field="charteredAssociationBuildingEngineersInformation"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
              </ul>
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
              <ul class="govuk-list">
                <li>
                  <InformationReviewRenderer
                    :data="application.charteredInstituteBuildingDate"
                    field="charteredInstituteBuildingDate"
                    :edit="editable"
                    type="date"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.charteredInstituteBuildingNumber"
                    field="charteredInstituteBuildingNumber"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.charteredInstituteBuildingInformation"
                    field="charteredInstituteBuildingInformation"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
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
                <li>
                  <InformationReviewRenderer
                    :data="application.charteredInstituteEnvironmentalHealthDate"
                    field="charteredInstituteEnvironmentalHealthDate"
                    :edit="editable"
                    type="date"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.charteredInstituteEnvironmentalHealthNumber"
                    field="charteredInstituteEnvironmentalHealthNumber"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.charteredInstituteEnvironmentalHealthInformation"
                    field="charteredInstituteEnvironmentalHealthInformation"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
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
                <li>
                  <InformationReviewRenderer
                    :data="application.generalMedicalCouncilDate"
                    field="generalMedicalCouncilDate"
                    :edit="editable"
                    type="date"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.generalMedicalCouncilNumber"
                    field="generalMedicalCouncilNumber"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.generalMedicalCouncilInformation"
                    field="generalMedicalCouncilInformation"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
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
              <ul
                v-else-if="editable"
                class="govuk-list"
              >
                <p class="govuk-hint">
                  Conditional details
                </p>
                <li>
                  <InformationReviewRenderer
                    :data="application.generalMedicalCouncilConditionalDetails"
                    field="generalMedicalCouncilConditionalDetails"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                
                <p class="govuk-hint">
                  Start date
                </p>
                <li>
                  <InformationReviewRenderer
                    :data="application.generalMedicalCouncilConditionalStartDate"
                    field="generalMedicalCouncilConditionalStartDate"
                    type="date"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>

                <p class="govuk-hint">
                  End date
                </p>
                <li>
                  <InformationReviewRenderer
                    :data="application.generalMedicalCouncilConditionalEndDate"
                    field="generalMedicalCouncilConditionalEndDate"
                    type="date"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
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
              <ul class="govuk-list">
                <li>
                  <InformationReviewRenderer
                    :data="application.royalCollegeOfPsychiatristsDate"
                    field="royalCollegeOfPsychiatristsDate"
                    :edit="editable"
                    type="date"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.royalCollegeOfPsychiatristsNumber"
                    field="royalCollegeOfPsychiatristsNumber"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.royalCollegeOfPsychiatristsInformation"
                    field="royalCollegeOfPsychiatristsInformation"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
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
                <li>
                  <InformationReviewRenderer
                    :data="application.royalInstitutionCharteredSurveyorsDate"
                    field="royalInstitutionCharteredSurveyorsDate"
                    :edit="editable"
                    type="date"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.royalInstitutionCharteredSurveyorsNumber"
                    field="royalInstitutionCharteredSurveyorsNumber"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
                <li>
                  <InformationReviewRenderer
                    :data="application.royalInstitutionCharteredSurveyorsInformation"
                    field="royalInstitutionCharteredSurveyorsInformation"
                    :edit="editable"
                    @changeField="changeQualificationOrMembership"
                  />
                </li>
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
              <InformationReviewRenderer
                :data="application.royalInstituteBritishArchitectsDate"
                field="royalInstituteBritishArchitectsDate"
                :edit="editable"
                type="date"
                @changeField="changeQualificationOrMembership"
              />
              <InformationReviewRenderer
                :data="application.royalInstituteBritishArchitectsNumber"
                field="royalInstituteBritishArchitectsNumber"
                :edit="editable"
                @changeField="changeQualificationOrMembership"
              />
              <InformationReviewRenderer
                :data="application.royalInstituteBritishArchitectsInformation"
                field="royalInstituteBritishArchitectsInformation"
                :edit="editable"
                @changeField="changeQualificationOrMembership"
              />
            </dd>
          </div> -->

          <template
            v-if="showMembershipOption('other') || otherMemberships"
          >
            <div
              v-for="(membership, key) in otherMemberships"
              :id="membership.value"
              :key="key"
              class="govuk-summary-list__row"
              :value="membership.value"
            >
              <dt class="govuk-summary-list__key">
                {{ membership.value }}
              </dt>
              <dd class="govuk-summary-list__value">
                <!-- {{ application.memberships ? application.memberships[membership.value].date : 'null' }} -->
                {{ application.memberships }}
                <strong v-if="editable">
                  date
                </strong>
                <InformationReviewRenderer
                  :data="(application.memberships && application.memberships[membership.value]) ? application.memberships[membership.value].date : null"
                  field="memberships"
                  extension="date"
                  :index="key"
                  :edit="editable"
                  type="date"
                  @changeField="changeQualificationOrMembership"
                />
                <strong v-if="editable">
                  number
                </strong>
                  <InformationReviewRenderer
                  :data="(application.memberships && application.memberships[membership.value]) ? application.memberships[membership.value].number : null"
                  field="memberships"
                  extension="number"
                  :index="key"
                  :edit="editable"
                  @changeField="changeQualificationOrMembership"
                />
                <!-- 
                <InformationReviewRenderer
                  :data="memberships[key].information"
                  field="memberships"
                  extension="information"
                  :index="key"
                  :edit="editable"
                  @changeField="changeQualificationOrMembership"
                /> -->
              </dd>
            </div>
          </template>
        </dl>
      </div>
    </div>

    <!-- experience -->
    <!-- <div
      v-if="isNonLegal"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Experience
      </h2>
      <div v-if="application.experience && application.experience.length">
        <InformationReviewSectionRenderer
          :value="application.experience"
          :data="application.experience"
          :data-default="emptyExperienceObject"
          :edit="editable"
          field="experience"
          @changeField="changeQualificationOrMembership"
        />
      </div>
      <div
        v-else
        class="govuk-body"
      >
        No information provided
      </div>
    </div> -->
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
// import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';

import {
  hasRelevantMemberships,
  isNonLegal
} from '@/helpers/exerciseHelper';

export default {
  name: 'QualificationsAndMembershipsSummary',
  components: {
    InformationReviewRenderer,
    // InformationReviewSectionRenderer,
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
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    hasRelevantMemberships() {
      return hasRelevantMemberships(this.exercise);
    },
    isNonLegal() {
      return isNonLegal(this.exercise);
    },
    otherMemberships() {
      return this.exercise.otherMemberships;
    },
    emptyExperienceObject() {
      return {
        'orgBusinessName': '',
        'jobTitle': '',
        'startDate': new Date(),
        'endDate': new Date(),
      };
    },
  },
  methods: {
    showMembershipOption(ref) {
      return this.exercise.memberships.indexOf(ref) >= 0;
    },
    changeQualificationOrMembership(obj) {

      let objChanged = this.application[obj.field] || [];
      console.log(objChanged);
      
      if (obj.change && obj.extension && obj.hasOwnProperty('index')) { //nested field
        console.log('a');
        objChanged[obj.index][obj.extension] = obj.change;
      } else if (obj.change && obj.hasOwnProperty('index')) { //direct field
        objChanged[obj.index] = obj.change;
      } else if (obj.hasOwnProperty('index') && obj.remove) { // REMOVE
        if (objChanged.length > 0){
          objChanged.splice(obj.index, 1);
        } else {
          objChanged = [];
        } 
      } else {
        objChanged = obj;
      }
      const updatedApplication = { ...this.application, ...objChanged };

      console.log(updatedApplication);

      // this.$store.dispatch('application/update', { data: updatedApplication, id: this.applicationId });

    },
  },
};
</script>
