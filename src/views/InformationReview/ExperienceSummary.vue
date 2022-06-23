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
      <div>
        <InformationReviewSectionRenderer
          :value="application.experience"
          :data="application.experience"
          :data-default="emptyNonLegalExperienceObject"
          :edit="editable"
          field="experience"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
        />
      </div>
    </div>

    <!-- Post-qualification experience/PQE -->
    <div
      v-if="isLegal"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Post-qualification experience
      </h2>
      <div>
        <InformationReviewSectionRenderer
          :data="application.experience"
          :data-default="emptyExperienceObject"
          :task-options="['judicial-functions', 'acting-arbitrator', 'practice-or-employment-as-lawyer', 'advising-application-of-law', 'assisting-in-proceedings-for-resolution-of-issues-under-law', 'acting-mediator-in-resolving-issues-that-are-of-proceedings', 'drafting-documents-that-affect-rights-obligations', 'teaching-researching-law', 'other']"
          :edit="editable"
          :display-month-year-only="true"
          field="experience"
          @changeField="changeInfo"
          @changeTaskDetails="changeTaskDetails"
          @removeField="removeInfo"
          @addField="addInfo"
        />
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
          <dt class="govuk-summary-list__key widerColumn">
            Fee-paid or salaried judge
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.feePaidOrSalariedJudge"
              :options="[true, false]"
              :edit="editable"
              type="selection"
              field="feePaidOrSalariedJudge"
              @changeField="changeInfo"
            />
          </dd>
        </div>

        <div
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
              @changeField="changeInfo"
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
                @changeField="changeInfo"
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
              @changeField="changeInfo"
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
                @changeField="changeInfo"
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
                @changeField="changeInfo"
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
              @changeField="changeInfo"
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
      <div>
        <InformationReviewSectionRenderer
          :data="application.employmentGaps"
          :data-default="emptyEmploymentGapObject"
          :task-options="['judicial-functions', 'acting-arbitrator', 'practice-or-employment-as-lawyer', 'advising-application-of-law', 'assisting-in-proceedings-for-resolution-of-issues-under-law', 'acting-mediator-in-resolving-issues-that-are-of-proceedings', 'drafting-documents-that-affect-rights-obligations', 'teaching-researching-law', 'other']"
          :edit="editable"
          :display-month-year-only="true"
          field="employmentGaps"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
        />
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
              @changeField="changeInfo"
            />
            <p v-if="application.canGiveReasonableLOS == false">
              <InformationReviewRenderer
                :data="application.cantGiveReasonableLOSDetails"
                :edit="editable"
                field="cantGiveReasonableLOSDetails"
                @changeField="changeInfo"
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
  name: 'ExperienceSummary',
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
    emptyEmploymentGapObject() {
      const model = {
        details: '',
        startDate: new Date(),
        endDate: new Date(),
      };
      if (this.isLegal) {
        model.tasks = [];
      }
      return model;
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
  },
  methods: {
    emitUpdate(update) {
      this.$emit('updateApplication', update);
    },
    formatUpdate(field, changedObj) {
      if (field) {
        this.emitUpdate({ ...this.application, ...{ [field]: changedObj } });
      } else {
        this.emitUpdate({ ...this.application, ...changedObj });
      }
    },
    addInfo(obj) {
      let changedObj = this.application[obj.field] || {};

      if (changedObj.length > 0) {
        changedObj = [...changedObj, obj.change];
      } else {
        changedObj = [obj.change];
      }

      this.formatUpdate(obj.field, changedObj);
    },
    removeInfo(obj) {
      let changedObj = this.application[obj.field] || {};

      this.application[obj.field];

      if (changedObj.length > 0) {
        changedObj.splice(obj.index, 1);
      } else {
        changedObj = [];
      }

      this.formatUpdate(obj.field, changedObj);
    },
    changeTaskDetails(obj) {
      const changedObj = this.application[obj.field] || {};

      changedObj[obj.index].taskDetails[obj.extension] = obj.change;

      this.formatUpdate(obj.field, changedObj);
    },
    changeInfo(obj) {
      let changedObj = this.application[obj.field] || {};

      if (obj.hasOwnProperty('change') && obj.hasOwnProperty('extension') && obj.hasOwnProperty('index')) { // extension ie. field[index].extension
        if (!changedObj[obj.index]) {
          changedObj = {
            [obj.index]: {},
          };
        }

        changedObj[obj.index][obj.extension] = obj.change;
      } else {
        changedObj = obj;
      }

      this.formatUpdate(obj.field, changedObj);
    },

  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
