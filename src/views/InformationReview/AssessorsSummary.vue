<template>
  <div>
    <!--  -->
    <div
      v-if="hasIndependentAssessments"
      class="govuk-!-margin-top-9"
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

      <dl
        v-if="applicantProvidedFirstAssessor"
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row text-right print-none button-right">
          <dt class="govuk-summary-list__key" />
          <dd class="govuk-summary-list__value">
            <button
              class="govuk-button btn-unlock"
              @click="editAssessor(1)"
            >
              Edit
            </button>
          </dd>
        </div>

        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Full name
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.firstAssessorFullName }}
          </dd>
        </div>

        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Title or position
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.firstAssessorTitle }}
          </dd>
        </div>

        <div class="govuk-summary-list__row print-none">
          <dt class="govuk-summary-list__key">
            Email
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.firstAssessorEmail }}
          </dd>
        </div>

        <div class="govuk-summary-list__row print-none">
          <dt class="govuk-summary-list__key">
            Telephone
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.firstAssessorPhone }}
          </dd>
        </div>
      </dl>
    </div>
    <!--  -->
    <div
      v-if="hasIndependentAssessments"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l govuk-!-margin-bottom-0">
        Independent assessors
      </h2>

      <dl
        v-if="applicantProvidedFirstAssessor"
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row text-right print-none button-right">
          <dt class="govuk-summary-list__key" />
          <dd class="govuk-summary-list__value">
            <button
              class="govuk-button btn-unlock"
              @click="editAssessor(1)"
            >
              Add
            </button>
          </dd>
        </div>
      </dl>

      <dl
        v-else
        class="govuk-summary-list"
      >
        <dt
          class="govuk-summary-list__key"
        >
          No information for First Assessor
        </dt>
      </dl>

      <hr class="govuk-section-break govuk-section-break--l">

      <dl
        v-if="applicantProvidedSecondAssessor"
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row text-right print-none button-right">
          <dt class="govuk-summary-list__key" />
          <dd class="govuk-summary-list__value">
            <button
              class="govuk-button btn-unlock"
              @click="editAssessor(2)"
            >
              Edit
            </button>
          </dd>
        </div>

        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Full name
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.secondAssessorFullName }}
          </dd>
        </div>

        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Title or position
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.secondAssessorTitle }}
          </dd>
        </div>

        <div class="govuk-summary-list__row print-none">
          <dt class="govuk-summary-list__key">
            Email
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.secondAssessorEmail }}
          </dd>
        </div>

        <div class="govuk-summary-list__row print-none">
          <dt class="govuk-summary-list__key">
            Telephone
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.secondAssessorPhone }}
          </dd>
        </div>
      </dl>
      <dl
        v-else
        class="govuk-summary-list"
      >
        <dt
          class="govuk-summary-list__key"
        >
          No information for Second Assessor
        </dt>
        <dd class="govuk-summary-list__value">
          <button
            class="govuk-button btn-unlock"
            @click="editAssessor(2)"
          >
            Add
          </button>
        </dd>
      </dl>

      <Modal
        ref="modalRef"
      >
        <component
          :is="`IndependentAssessorChange`"
          v-bind="assessorDetails"
          @close="closeModal('modalRef')"
        />
      </Modal>
    </div>
    <!--  -->
    <div
      v-if="hasLeadershipJudgeAssessment"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l govuk-!-margin-bottom-0">
        Leadership Judge details
      </h2>

      <dl
        v-if="application.leadershipJudgeDetails"
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row text-right print-none button-right">
          <dt class="govuk-summary-list__key" />
          <dd class="govuk-summary-list__value">
            <button
              class="govuk-button btn-unlock"
              @click="editLeadershipJudgeDetails"
            >
              Edit
            </button>
          </dd>
        </div>

        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Full name
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.leadershipJudgeDetails.fullName }}
          </dd>
        </div>

        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Title or position
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.leadershipJudgeDetails.title }}
          </dd>
        </div>

        <div
          v-if="hasLeadershipJudgeAssessment"
          class="govuk-!-margin-top-9"
        >
          <h2 class="govuk-heading-l govuk-!-margin-bottom-0">
            Leadership Judge details
          </h2>

          <div class="govuk-summary-list__row print-none">
            <dt class="govuk-summary-list__key">
              Telephone
            </dt>
            <dd class="govuk-summary-list__value">
              {{ application.leadershipJudgeDetails.phone }}
            </dd>
          </div>
        </div>
      </dl>
      <dl
        v-else
        class="govuk-summary-list"
      >
        <dt
          class="govuk-summary-list__key"
        >
          No information for Leadership Judge
        </dt>
        <dd class="govuk-summary-list__value">
          <button
            class="govuk-button btn-unlock"
            @click="editLeadershipJudgeDetails"
          >
            Add
          </button>
        </dd>
      </dl>
      <Modal
        ref="modalLeadershipJudgeDetails"
      >
        <component
          :is="`LeadershipJudgeDetails`"
          v-bind="application.leadershipJudgeDetails"
          :application-id="applicationId"
          @close="closeModal('modalLeadershipJudgeDetails')"
        />
      </Modal>
    </div>
  </div>
</template>
<script>
import { hasLeadershipJudgeAssessment, hasIndependentAssessments } from '@/helpers/exerciseHelper';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import IndependentAssessorChange from '@/components/ModalViews/IndependentAssessorChange';
import LeadershipJudgeDetails from '@/components/ModalViews/LeadershipJudgeDetails';

export default {
  components: {
    Modal,
    IndependentAssessorChange,
    LeadershipJudgeDetails,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      assessorDetails: {},
    };
  },
  computed: {
    applicantProvidedFirstAssessor() {
      const { firstAssessorEmail, firstAssessorFullName, firstAssessorPhone, firstAssessorTitle } = this.application;
      return (firstAssessorEmail || firstAssessorFullName || firstAssessorPhone || firstAssessorTitle);
    },
    applicantProvidedSecondAssessor() {
      const { secondAssessorEmail, secondAssessorFullName, secondAssessorPhone, secondAssessorTitle } = this.application;
      return (secondAssessorEmail || secondAssessorFullName || secondAssessorPhone || secondAssessorTitle);
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    hasLeadershipJudgeAssessment() {
      return hasLeadershipJudgeAssessment(this.exercise);
    },
    hasIndependentAssessments() {
      return hasIndependentAssessments(this.exercise);
    },
  },
  methods: {
    editAssessor(AssessorNr) {
      // this.assessorDetails = {};
      if (AssessorNr === 1) {
        this.assessorDetails = {
          AssessorNr: AssessorNr,
          applicationId: this.applicationId,
          email: this.application.firstAssessorEmail,
          fullName: this.application.firstAssessorFullName,
          phone: this.application.firstAssessorPhone,
          title: this.application.firstAssessorTitle,
        };
      }
      if (AssessorNr === 2) {
        this.assessorDetails = {
          AssessorNr: AssessorNr,
          applicationId: this.applicationId,
          email: this.application.secondAssessorEmail,
          fullName: this.application.secondAssessorFullName,
          phone: this.application.secondAssessorPhone,
          title: this.application.secondAssessorTitle,
        };
      }
      this.modalRef.openModal();
    },
    editLeadershipJudgeDetails() {
      this.$refs.modalLeadershipJudgeDetails.openModal();
    },
  },
};
</script>
