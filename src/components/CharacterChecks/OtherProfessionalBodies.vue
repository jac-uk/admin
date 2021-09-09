<template>
  <div>
    <div
      class="govuk-!-margin-top-9"
    >
      <h2
        class="govuk-heading-l"
        style="display:inline-block;"
      >
        Other professional bodies
      </h2>
    </div>
    <div v-if="application.professionalMemberships && application.professionalMemberships.length">
      <dl
        class="govuk-summary-list govuk-!-margin-bottom-8"
      >
        <div
          v-if="showMembershipOption('chartered-association-of-building-engineers')"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Chartered Association of Building Engineers
          </dt>
          <dd class="govuk-summary-list__value">
            <ul class="govuk-list">
              <li>{{ application.charteredAssociationBuildingEngineersDate | formatDate }}</li>
              <li>{{ application.charteredAssociationBuildingEngineersNumber }}</li>
              <li>{{ application.charteredAssociationBuildingEngineersStatus }}</li>
            </ul>
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
            <ul class="govuk-list">
              <li>{{ application.charteredInstituteBuildingDate | formatDate }}</li>
              <li>{{ application.charteredInstituteBuildingNumber }}</li>
              <li>{{ application.charteredInstituteBuildingStatus }}</li>
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
              <li>{{ application.charteredInstituteEnvironmentalHealthStatus }}</li>
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
              <li>{{ application.generalMedicalCouncilStatus }}</li>
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
              <li>{{ application.royalCollegeOfPsychiatristsStatus }}</li>
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
              <li>{{ application.royalInstitutionCharteredSurveyorsStatus }}</li>
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
              <li>{{ application.royalInstituteBritishArchitectsStatus }}</li>
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
              <li>{{ application.otherProfessionalMembershipsStatus }}</li>
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
              <li>{{ membership.status }}</li>
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
</template>

<script>
export default {
  name: 'OtherProfessionalBodies',
  props: {
    application: {
      type: Object,
      required: true,
    },
    exercise: {
      type: Object,
      required: true,
    },
  },
  computed: {
    otherMemberships() {
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
  methods: {
    showMembershipOption(ref) {
      if (this.application && this.application.professionalMemberships) {
        return this.application.professionalMemberships.indexOf(ref) >= 0;
      }
      return false;
    },
  },
};
</script>

<style>
  .change-link {
    float: right;
  }
  .widerColumn {
    width: 70%;
  }
</style>
