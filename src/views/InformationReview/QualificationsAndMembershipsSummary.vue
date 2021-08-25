<template>
  <div>
    <!--
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

    applied shedules
    <div>
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
    </div>
    --->

    <!-- 
        <div v-if="application.professionalMemberships && application.professionalMemberships.length">
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
                Chartered Institue of Building
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
            --->

    <!--
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

            <template
              v-else-if="item.type === 'barrister'"
            >
              <div
                v-if="item.qualificationNotComplete"
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
                v-if="item.notCalledToBar === false && item.qualificationNotComplete"
                class="govuk-summary-list__row"
              >
                <dt
                  class="govuk-summary-list__key"
                >
                  Date called to bar
                </dt>
                <dd class="govuk-summary-list__value">
                  <ul class="govuk-list">
                    <li> {{ item.calledToBarDate | formatDate }}</li>
                  </ul>
                </dd>
              </div>
              <div
                v-if="item.notCalledToBar === true && item.qualificationNotComplete"
                class="govuk-summary-list__row"
              >
                <dt class="govuk-summary-list__key">
                  Called to bar
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
                v-if="item.qualificationNotComplete === true && item.notCalledToBar === true"
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
        </div>

        <div
          v-else
          class="govuk-body"
        >
          No information provided B
        </div>
      </div>
    </div>
    -->
    <!-- <h2 class="govuk-heading-l">
        Memberships
      </h2> -->
    <!-- memberships -->
    <div
      v-if="hasRelevantMemberships"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Memberships
      </h2>

      <!-- <dl
        v-for="item in application.experience"
        :key="item.name"
        class="govuk-summary-list govuk-!-margin-bottom-8"
      > -->
      <InformationReviewSectionRenderer
        :value="application.experience"
        :data="application.experience"
        :data-default="emptyExperienceObject"
        :edit="editable"
        field="experience"
        @changeField="changeQualificationOrMembership"
      />
      <!---
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
      --->
    </div>
  </div>
</template>

<script>
// import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';

import {
  hasRelevantMemberships
} from '@/helpers/exerciseHelper';

export default {
  name: 'QualificationsAndMembershipsSummary',
  components: {
    // InformationReviewRenderer,
    InformationReviewSectionRenderer,
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
    changeQualificationOrMembership(obj) {
      
      let objChanged = this.application[obj.field] || [];

      if (obj.change && obj.extension && obj.hasOwnProperty('index')) {
        objChanged[obj.index][obj.extension] = obj.change;
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
