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
        No information provided
      </div>
    </div>
    <!-- PQE? -->
    <!-- <div
      v-if="isLegal"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Post-qualification experience
      </h2>

      <div
        v-if="application.declaredAppointmentInQuasiJudicialBody === true"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Sat for at least {{ application.pjeDays || 30 }} days in one or all of these appointments
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
          Skills acquisition details
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.skillsAquisitionDetails }}
        </dd>
      </div>
    </div> -->

    <!-- Judicial Experience -->
    <div
      v-if="isLegal && exercise.previousJudicialExperienceApply"
      class="govuk-!-margin-top-9"
    >
      <!-- <h2 class="govuk-heading-l">
        Judicial experience
      </h2>

      <dl
        v-if="application.experience && application.experience.length"
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
            Sat for at least {{ application.pjeDays || 30 }} days
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
      </dl>

      <div
        v-else
        class="govuk-body"
      >
        No information provided
      </div> -->

      <!-- <dl
        v-if="application.experience && application.experience.length"
        class="govuk-summary-list govuk-!-margin-bottom-8"
      > -->
      <!-- ??? may be duplicate  ??? -->
      <!-- confused -->
      <!-- <div
        v-if="application.feePaidOrSalariedSatForThirtyDays == false || application.feePaidOrSalariedJudge == false"
        class="govuk-summary-list__row"
      >
        <h2 class="govuk-heading-l">
          Memberships
        </h2>
        <InformationReviewSectionRenderer
          :data="application.memberships"
          :data-default="emptyMembershipObject"
          :edit="editable"
          field="memberships"
          @changeField="changeExperience"
        />
        <dl
          v-for="(membership, index) in application.memberships"
          :key="index"
        >
          <dt class="govuk-summary-list__key">
            {{ index }}
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="membership.date"
              :edit="editable"
              type="date"
              field="date"
              @changeField="changeExperience"
            />

            <ul class="govuk-list">
              <li>{{ membership.date | formatDate }}</li>
              <li>{{ membership.number }}</li>
              <li>{{ membership.information }}</li>
            </ul>
          </dd>
        </dl>
      </div> -->
      <!-- ??? may be duplicate  ??? -->
      <!-- </dl> -->
    </div>

    <!-- Gaps in Employment -->
    <!-- <div
      v-if="!isNonLegal"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Gaps in employment
      </h2>

      <p
        v-if="!hasEmploymentGaps"
        class="govuk-body"
      >
        No employment gaps declared.
      </p>

      <dl
        v-for="item in application.employmentGaps"
        v-else
        :key="item.name"
        class="govuk-summary-list govuk-!-margin-bottom-8"
      >
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Date of gap
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
                <p class="govuk-body govuk-!-margin-bottom-0">
                  {{ task | lookup }}
                </p>
                <p
                  v-if="task == 'other'"
                  class="govuk-body govuk-!-margin-bottom-0"
                >
                  {{ item.otherTasks }}
                </p>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div> -->

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
    <!-- <div
    v-if="isNonLegal"
    class="govuk-!-margin-top-9"
  >
    <h2 class="govuk-heading-l">
      Experience
    </h2>

    <div v-if="application.experience && application.experience.length">
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
    <div
      v-else
      class="govuk-body"
    >
      No information provided
    </div>
  </div>

  <div
    v-if="isLegal"
    class="govuk-!-margin-top-9"
  >
    <h2 class="govuk-heading-l">
      Post-qualification experience
    </h2>

    <div
      v-if="application.experience && application.experience.length"
    >
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
              <li>{{ item.jobTitle | showAlternative('Answer not provided') }}</li>
            </ul>
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Organisation or business
          </dt>
          <dd class="govuk-summary-list__value">
            <ul class="govuk-list">
              <li>{{ item.orgBusinessName | showAlternative('Answer not provided') }}</li>
            </ul>
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Dates worked
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
            <div v-else>
              No dates provided
            </div>
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Law-related tasks
          </dt>
          <dd class="govuk-summary-list__value">
            <ul
              v-if="item.tasks && item.tasks.length"
              class="govuk-list"
            >
              <li
                v-for="task in item.tasks"
                :key="task.name"
              >
                <p class="govuk-body govuk-!-margin-bottom-0">
                  {{ task | lookup }}
                </p>
                <p
                  v-if="task == 'other'"
                  class="govuk-body govuk-!-margin-bottom-0"
                >
                  {{ item.otherTasks }}
                </p>
              </li>
            </ul>
            <div v-else>
              No Answers provided
            </div>
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
          {{ application.feePaidOrSalariedJudge | lookup | toYesNo| showAlternative('No Answer provided') }}
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
          Declared an appointment or appointments in a quasi-judicial body in this application
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
          Sat for at least {{ exercise.pjeDays || 30 }} days in one or all of these appointments
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
          Skills acquisition details
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.skillsAquisitionDetails }}
        </dd>
      </div>
    </dl>
  </div>

  <div
    v-if="!isNonLegal"
    class="govuk-!-margin-top-9"
  >
    <h2 class="govuk-heading-l">
      Gaps in employment
    </h2>

    <p
      v-if="!hasEmploymentGaps"
      class="govuk-body"
    >
      No employment gaps declared.
    </p>

    <dl
      v-for="item in application.employmentGaps"
      v-else
      :key="item.name"
      class="govuk-summary-list govuk-!-margin-bottom-8"
    >
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Date of gap
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
              <p class="govuk-body govuk-!-margin-bottom-0">
                {{ task | lookup }}
              </p>
              <p
                v-if="task == 'other'"
                class="govuk-body govuk-!-margin-bottom-0"
              >
                {{ item.otherTasks }}
              </p>
            </li>
          </ul>
        </dd>
      </div>
    </dl>
  </div>

  <div
    v-if="!isPanelView"
    class="govuk-!-margin-top-9"
  >
    <h2 class="govuk-heading-l">
      Reasonable length of service
    </h2>
    <dl class="govuk-summary-list govuk-!-margin-bottom-8">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Can work a reasonable length of service
        </dt>
        <dd class="govuk-summary-list__value">
          {{ application.canGiveReasonableLOS | toYesNo }}
          <p v-if="application.canGiveReasonableLOS == false">
            {{ application.cantGiveReasonableLOSDetails }}
          </p>
        </dd>
      </div>
    </dl>
  </div> -->
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
      };
    },
  },
  methods: {
    changeExperience(obj) {

      let objChanged = this.application[obj.field] || {};

      if (obj.change && obj.extension && obj.hasOwnProperty('index')) { //nested field
        if (!objChanged[obj.index]) {
          objChanged = {
            [obj.index]: {},
          };
        }
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
