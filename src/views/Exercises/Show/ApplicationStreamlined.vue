<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <BackLink class="govuk-!-margin-top-0" />

      <div v-if="application && exercise">
        <div class="govuk-!-margin-top-1">
          <h1
            class="govuk-heading-xl"
            style="display:inline-block;"
          >
            Panel Pack Application View
          </h1>
        </div>
        <div>
          <p class="govuk-body-l">
            Application reference: {{ application.referenceNumber }}
          </p>
          <p class="govuk-body-l">
            Application submitted on: {{ application.appliedAt | formatDate }}
          </p>
        </div>

        <div class="govuk-!-margin-top-9">
          <h2
            class="govuk-heading-l"
            style="display:inline-block;"
          >
            Welsh posts
          </h2>
        </div>
        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">
              Are you applying for a Welsh post?
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
              Can you speak Welsh?
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
              Can you read and write in Welsh?
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

        <div v-if="isLegal">
          <div
            class="govuk-!-margin-top-9"
          >
            <h2
              class="govuk-heading-l"
              style="display:inline-block;"
            >
              Qualifications
            </h2>
          </div>

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

        <div v-if="showMemberships">
          <div
            class="govuk-!-margin-top-9"
          >
            <h2
              class="govuk-heading-l"
              style="display:inline-block;"
            >
              Memberships
            </h2>
          </div>

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

        <div v-if="isNonLegal">
          <div
            class="govuk-!-margin-top-9"
          >
            <h2
              class="govuk-heading-l"
              style="display:inline-block;"
            >
              Experience
            </h2>
          </div>

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

        <div v-if="isLegal">
          <div
            class="govuk-!-margin-top-9"
          >
            <h2
              class="govuk-heading-l"
              style="display:inline-block;"
            >
              Post-qualification experience
            </h2>
          </div>

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
                    <p
                      v-if="task == 'other'"
                      class="govuk-body govuk-!-margin-bottom-0"
                    >
                      <span class="govuk-caption-m">{{ task | lookup }}</span>
                      {{ item.otherTasks }}
                    </p>
                    <span v-else>{{ task | lookup }}</span>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div v-if="isLegal">
          <div class="govuk-!-margin-top-9">
            <h2
              class="govuk-heading-l"
              style="display:inline-block;"
            >
              Judicial experience
            </h2>
          </div>

          <dl
            class="govuk-summary-list govuk-!-margin-bottom-8"
          >
            <div
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Are you a fee-paid or salaried judge?
              </dt>
              <dd class="govuk-summary-list__value">
                {{ application.feePaidOrSalariedJudge | toYesNo }}
              </dd>
            </div>

            <div
              v-if="application.feePaidOrSalariedJudge === true"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                Have you sat for at least 30 days?
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
                Have you declared an appointment or appointments in a quasi-judicial body in this application?
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
                Have you sat for at least 30 days in one or all of these appointments?
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
                details of how you have acquired the necessary
                skills for this role in some other significant way
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
          <h2
            class="govuk-heading-l"
            style="display:inline-block;"
          >
            Gaps in employment
          </h2>
        </div>

        <dl
          v-for="item in application.employmentGaps"
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
                  <p
                    v-if="task == 'other'"
                    class="govuk-body govuk-!-margin-bottom-0"
                  >
                    <span class="govuk-caption-m">{{ task | lookup }}</span>
                    {{ item.otherTasks }}
                  </p>
                  <span v-else>{{ task | lookup }}</span>
                </li>
              </ul>
            </dd>
          </div>
        </dl>

        <div class="govuk-!-margin-top-9">
          <h2
            class="govuk-heading-l"
            style="display:inline-block;"
          >
            Reasonable length of service
          </h2>
        </div>
        <dl class="govuk-summary-list govuk-!-margin-bottom-8">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">
              Can work a resonable length of service
            </dt>
            <dd class="govuk-summary-list__value">
              {{ application.canGiveReasonableLOS | toYesNo }}
              <p v-if="application.canGiveReasonableLOS == false">
                {{ application.cantGiveReasonableLOSDetails }}
              </p>
            </dd>
          </div>
        </dl>

        <div class="govuk-!-margin-top-9">
          <h2
            class="govuk-heading-l"
            style="display:inline-block;"
          >
            Independent assessors
          </h2>
        </div>

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
              {{ application.firstAssessorEmail }}
            </dd>
          </div>

          <hr class="govuk-section-break govuk-section-break--xl">

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
              {{ application.secondAssessorEmail }}
            </dd>
          </div>
        </dl>

        <div
          v-if="showStatementOfSuitability"
          id="assessments-heading"
          class="govuk-!-margin-top-9"
        >
          <h2
            class="govuk-heading-l"
            style="display:inline-block;"
          >
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
                <span v-else>I do not meet this requirement</span>
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
                    :title="CV"
                  />
                </div>
                <span v-else>Not yet received</span>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="showStatementOfEligibility"
          id="assessments-heading"
          class="govuk-!-margin-top-9"
        >
          <h2
            class="govuk-heading-l"
            style="display:inline-block;"
          >
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
                <span v-else>I do not meet this requirement</span>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="showSelfAssessment"
          id="self-assessment-heading"
          class="govuk-!-margin-top-9"
        >
          <h2
            class="govuk-heading-l"
            style="display:inline-block;"
          >
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
                    title="Self Assessment Competencies"
                  />
                </div>
                <span v-else>Not yet received</span>
              </dd>
            </div>
          </dl>
        </div>

        <div
          v-if="showCV"
          id="cv-heading"
          class="govuk-!-margin-top-9"
        >
          <h2
            class="govuk-heading-l"
            style="display:inline-block;"
          >
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
import BackLink from '@/components/BackLink';
import DownloadLink from '@/components/DownloadLink';

export default {
  components: {
    BackLink,
    DownloadLink,
  },
  computed: {
    application () {
      return this.$store.state.application.record;
    },
    exercise () {
      return this.$store.state.exerciseDocument.record;
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
  },
  created() {
    if (this.$route.params.applicationId) {
      this.$store.dispatch('application/bind', this.$route.params.applicationId).then( (application) => {
        this.$store.dispatch('exerciseDocument/bind', application.exerciseId);
      });
    }
  },
  destroyed() {
    this.$store.dispatch('application/unbind');
  },
  methods: {
    showMembershipOption(ref) {
      return this.application.professionalMemberships.indexOf(ref) >= 0;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
