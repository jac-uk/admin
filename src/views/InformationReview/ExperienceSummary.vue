<template>
  <div>
    <!-- Experience -->
    <div
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
          :data-default="emptyNonLegalExperienceObject"
          :edit="editable"
          field="experience"
          @changeField="changeExperience"
        />
      </div>
      <div
        v-else
        class="govuk-body"
      >
        No information provided
      </div>
    </div>
    <!-- PQE -->
    <div
      v-if="isLegal"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Post-qualification experience
      </h2>
      <div v-if="(application.experience && application.experience.length) || editable">
        <InformationReviewSectionRenderer
          :value="application.experience"
          :data="application.experience"
          :data-default="emptyExperienceObject"
          :task-options="['judicial-functions', 'acting-arbitrator', 'practice-or-employment-as-lawyer', 'advising-application-of-law', 'assisting-in-proceedings-for-resolution-of-issues-under-law', 'acting-mediator-in-resolving-issues-that-are-of-proceedings', 'drafting-documents-that-affect-rights-obligations', 'teaching-researching-law', 'other']"
          :edit="editable"
          field="experience"
          @changeField="changeExperience"
        />
      </div>
      <div
        v-else
        class="govuk-body"
      >
        No information provided
      </div>
    </div>
    <!-- Judicial Experience -->
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
            <InformationReviewRenderer
              :data="application.feePaidOrSalariedJudge"
              :options="[true, false]"
              :edit="editable"
              type="selection"
              field="feePaidOrSalariedJudge"
              @changeField="changeExperience"
            />
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
            <InformationReviewRenderer
              :data="application.feePaidOrSalariedSatForThirtyDays"
              :options="[true, false]"
              :edit="editable"
              type="selection"
              field="feePaidOrSalariedSatForThirtyDays"
              @changeField="changeExperience"
            />
            <div
              v-if="application.feePaidOrSalariedSittingDaysDetails || editable"
              class="govuk-body"
            >
              <dt class="govuk-summary-list__key">
                Details
              </dt>
              <InformationReviewRenderer
                :data="application.feePaidOrSalariedSittingDaysDetails"
                :edit="editable"
                field="feePaidOrSalariedSittingDaysDetails"
                @changeField="changeExperience"
              />
            </div>
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
            <InformationReviewRenderer
              :data="application.declaredAppointmentInQuasiJudicialBody"
              :options="[true, false]"
              :edit="editable"
              type="selection"
              field="declaredAppointmentInQuasiJudicialBody"
              @changeField="changeExperience"
            />
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
              <InformationReviewRenderer
                :data="application.quasiJudicialSatForThirtyDays"
                :options="[true, false]"
                :edit="editable"
                type="selection"
                field="quasiJudicialSatForThirtyDays"
                @changeField="changeExperience"
              />
            </p>
            <div
              v-if="application.quasiJudicialSittingDaysDetails || editable"
              class="govuk-body"
            >
              <dt class="govuk-summary-list__key">
                Details
              </dt>
              <InformationReviewRenderer
                :data="application.quasiJudicialSittingDaysDetails"
                :edit="editable"
                field="quasiJudicialSittingDaysDetails"
                @changeField="changeExperience"
              />
            </div>
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
            <InformationReviewRenderer
              :data="application.skillsAquisitionDetails"
              :edit="editable"
              field="skillsAquisitionDetails"
              @changeField="changeExperience"
            />
          </dd>
        </div>
      </dl>
    </div>
    <!-- Gaps in Employment -->
    <div
      v-if="!isNonLegal"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Gaps in employment
      </h2>
      <div v-if="hasEmploymentGaps || editable">
        <InformationReviewSectionRenderer
          :data="application.employmentGaps"
          :data-default="emptyExperienceObject"
          :edit="editable"
          field="experience"
          @changeField="changeExperience"
        />
      </div>
      <div
        v-else
        class="govuk-body"
      >
        No employment gaps declared.
      </div>
    </div>
    <!-- Reasonable length of service -->
    <div
      v-if="!isPanelView"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Reasonable length of service
      </h2>
      <dl class="govuk-summary-list govuk-!-margin-bottom-8">
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key widerColumn">
            Can work a reasonable length of service
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.canGiveReasonableLOS"
              :options="[true, false]"
              :edit="editable"
              type="selection"
              field="canGiveReasonableLOS"
              @changeField="changeExperience"
            />
            <p v-if="application.canGiveReasonableLOS == false">
              <InformationReviewRenderer
                :data="application.cantGiveReasonableLOSDetails"
                :edit="editable"
                field="cantGiveReasonableLOSDetails"
                @changeField="changeExperience"
              />
            </p>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';
import { isNonLegal, isLegal } from '@/helpers/exerciseHelper';

export default {
  name: 'QualificationsAndMembershipsSummary',
  components: {
    InformationReviewRenderer,
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
    isPanelView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentIndex: null,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    isLegal() {
      return isLegal(this.exercise);
    },
    isNonLegal() {
      return isNonLegal(this.exercise);
    },
    emptyMembershipObject() {
      return {
        date: new Date(),
        number: '',
        information: '',
      };
    },
    emptyExperienceObject() {
      return {
        orgBusinessName: '',
        jobTitle: '',
        startDate: new Date(),
        endDate: new Date(),
        tasks: [],
        taskDetails: {
          location: '',
          jurisdiction: '',
          workingBasis: '',
          totalDaysInRole: '',
        },
      };
    },
    emptyNonLegalExperienceObject() {
      return {
        orgBusinessName: '',
        jobTitle: '',
        startDate: new Date(),
        endDate: new Date(),
      };
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
  },
  methods: {
    changeExperience(obj) {
      
      let objChanged = this.application[obj.field] || {};
      
      if (obj.taskDetails) {
        objChanged[obj.index].taskDetails[obj.extension] = obj.change;
      } else if (obj.change && obj.extension && obj.hasOwnProperty('index')) { //nested field
        if (!objChanged[obj.index]) {
          objChanged = {
            [obj.index]: {},
          };
        }
        objChanged[obj.index][obj.extension] = obj.change;
      } else if (obj.hasOwnProperty('index') && obj.change && !obj.remove) { // ADD

        if (objChanged.length > 0){
          objChanged[obj.field] = [...objChanged, obj.change];
        } else {
          objChanged[obj.field] = [obj.change];
        } 

      } else if (obj.hasOwnProperty('index') && obj.remove) { // REMOVE
        if (objChanged.length > 0){
          objChanged.splice(obj.index, 1);
        } else {
          objChanged = [];
        } 
      } else if (obj.change && obj.hasOwnProperty('index')) { //direct field
        objChanged[obj.index] = obj.change;
      } else {
        objChanged = obj;
      }
      const updatedApplication = { ...this.application, ...objChanged };

      // console.log('done: ', updatedApplication);

      this.$store.dispatch('application/update', { data: updatedApplication, id: this.applicationId });
    },

  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
