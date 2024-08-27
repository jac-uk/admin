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
          :is-asked="isApplicationPartAsked('relevantExperience')"
          @change-field="changeInfo"
          @remove-field="removeInfo"
          @add-field="addInfo"
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
          :is-asked="isApplicationPartAsked('postQualificationWorkExperience')"
          @change-field="changeInfo"
          @change-judicial-functions="changeJudicialFunctions"
          @change-task-details="changeTaskDetails"
          @remove-field="removeInfo"
          @add-field="addInfo"
        />
      </div>
      <div
        v-if="totalJudicialDays < exercise.pjeDays"
        class="govuk-!-margin-top-8"
      >
        <dl class="govuk-summary-list govuk-!-margin-bottom-8">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key widerColumn">
              Details of how you have acquired the necessary skills
            </dt>
            <dd class="govuk-summary-list__value">
              <InformationReviewRenderer
                :data="application.experienceDetails"
                :edit="editable"
                field="experienceDetails"
                :is-asked="isApplicationPartAsked('postQualificationWorkExperience')"
                @change-field="changeInfo"
              />
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Judicial Experience -->
    <div v-if="isJAC00164">
      <dl class="govuk-summary-list govuk-!-margin-bottom-8">
        <div
          class="govuk-summary-list__row"
        >
          <dt
            v-if="exercise.previousJudicialExperienceApply"
            class="govuk-summary-list__key"
          >
            Are you a fee-paid or salaried medical member?
          </dt>
          <dd class="govuk-summary-list__value">
            {{ $filters.toYesNo(application.feePaidOrSalariedJudge) }}
          </dd>
        </div>
        <div
          v-if="application.feePaidOrSalariedJudge === true"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            {{ `Have you sat for at least ${exercise.pjeDays || 30 } days?` }}
          </dt>
          <dd class="govuk-summary-list__value">
            <p class="govuk-body">
              {{ $filters.toYesNo(application.feePaidOrSalariedSatForThirtyDays) }}
            </p>
            <p
              v-if="application.feePaidOrSalariedSatForThirtyDays"
              class="govuk-body"
            >
              {{ application.feePaidOrSalariedSittingDaysDetails }}
            </p>
          </dd>
        </div>
        <div
          v-if="!application.feePaidOrSalariedJudge || !application.feePaidOrSalariedSatForThirtyDays"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            If you do not have previous experience as a Fee-paid Medical Member in the Social Entitlement Chamber, please tell us what equivalent experience and skills you have in the box below
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.skillsAquisitionDetails }}
          </dd>
        </div>
      </dl>
    </div>
    <div
      v-if="isLegal && exercise.previousJudicialExperienceApply && isApplicationVersionLessThan3"
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
              :is-asked="isApplicationPartAsked('judicialExperience')"
              @change-field="changeInfo"
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
              :is-asked="isApplicationPartAsked('judicialExperience')"
              @change-field="changeInfo"
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
                :is-asked="isApplicationPartAsked('judicialExperience')"
                @change-field="changeInfo"
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
              :is-asked="isApplicationPartAsked('judicialExperience')"
              @change-field="changeInfo"
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
                :is-asked="isApplicationPartAsked('judicialExperience')"
                @change-field="changeInfo"
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
                :is-asked="isApplicationPartAsked('judicialExperience')"
                @change-field="changeInfo"
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
              :is-asked="isApplicationPartAsked('judicialExperience')"
              @change-field="changeInfo"
            />
          </dd>
        </div>
      </dl>
    </div>

    <!-- Medical Experience for JAC00164 -->
    <div
      v-if="isJAC00164"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Experience
      </h2>

      <dl
        class="govuk-summary-list govuk-!-margin-bottom-8"
      >
        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            Fee-paid or salaried medical member
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.feePaidOrSalariedJudge"
              :options="[true, false]"
              :edit="editable"
              type="selection"
              field="feePaidOrSalariedJudge"
              :is-asked="isApplicationPartAsked('judicialExperience')"
              @change-field="changeInfo"
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
              :is-asked="isApplicationPartAsked('judicialExperience')"
              @change-field="changeInfo"
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
                :is-asked="isApplicationPartAsked('judicialExperience')"
                @change-field="changeInfo"
              />
            </div>
          </dd>
        </div>

        <div
          v-if="!application.feePaidOrSalariedJudge || !application.feePaidOrSalariedSatForThirtyDays"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Equivalent experience and skills
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.skillsAquisitionDetails"
              :edit="editable"
              field="skillsAquisitionDetails"
              :is-asked="isApplicationPartAsked('judicialExperience')"
              @change-field="changeInfo"
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
          :is-asked="isApplicationPartAsked('employmentGaps')"
          @change-field="changeInfo"
          @remove-field="removeInfo"
          @add-field="addInfo"
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
              :is-asked="isApplicationPartAsked('reasonableLengthOfService')"
              @change-field="changeInfo"
            />
            <p v-if="application.canGiveReasonableLOS == false">
              <InformationReviewRenderer
                :data="application.cantGiveReasonableLOSDetails"
                :edit="editable"
                field="cantGiveReasonableLOSDetails"
                :is-asked="isApplicationPartAsked('reasonableLengthOfService')"
                @change-field="changeInfo"
              />
            </p>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer.vue';
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer.vue';
import { isNonLegal, isLegal, isApplicationPartAsked, isApplicationVersionLessThan } from '@jac-uk/jac-kit/helpers/exerciseHelper';

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
  emits: ['updateApplication'],
  data() {
    return {
      currentIndex: null,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isJAC00164() {
      if (!this.exercise) { return false; }
      // [develop, staging, prod]
      return ['JAC00507','JAC00660','JAC00164'].includes(this.exercise.referenceNumber);
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
    isApplicationVersionLessThan3() {
      return isApplicationVersionLessThan(this.exercise, 3);
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
        judicialFunctions: {
          type: '',
          duration: '',
          isLegalQualificationRequired: '',
          details: '',
        },
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
    totalJudicialDays() {
      let total = 0;
      if (Array.isArray(this.application.experience)) {
        this.application.experience.forEach((experience) => {
          if (
            Array.isArray(experience.tasks) &&
            experience.tasks.includes('judicial-functions') &&
            experience?.judicialFunctions?.duration
          ) {
            total += parseInt(experience.judicialFunctions.duration, 10);
          }
        });
      }
      return total;
    },
  },
  methods: {
    emitUpdate(update) {
      this.$emit('updateApplication', update );
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

      if (changedObj.length > 0){
        changedObj = [...changedObj, obj.change];
      } else {
        changedObj = [obj.change];
      }

      this.formatUpdate(obj.field, changedObj);

    },
    removeInfo(obj) {
      let changedObj = this.application[obj.field] || {};

      this.application[obj.field];

      if (changedObj.length > 0){
        changedObj.splice(obj.index, 1);
      } else {
        changedObj = [];
      }

      this.formatUpdate(obj.field, changedObj);

    },
    changeJudicialFunctions(obj) {
      const changedObj = this.application[obj.field] || {};

      if (!changedObj[obj.index].judicialFunctions) {
        changedObj[obj.index].judicialFunctions = {}; // ensure judicialFunctions exists
      }
      changedObj[obj.index].judicialFunctions[obj.extension] = obj.change;

      this.formatUpdate(obj.field, changedObj);
    },
    changeTaskDetails(obj) {
      const changedObj = this.application[obj.field] || {};

      if (!changedObj[obj.index].taskDetails) {
        changedObj[obj.index].taskDetails = {}; // ensure taskDetails exists
      }
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
