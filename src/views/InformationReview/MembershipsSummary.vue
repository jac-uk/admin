<template>
  <div>
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
      No information provided
    </div>

    <div
      v-if="isNonLegal"
      class="govuk-!-margin-top-9"
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

    <div
      v-if="hasRelevantMemberships"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Memberships
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
  </div>
</template>
