<template>
  <div>
    <div
      v-if="hasIndependentAssessments"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l govuk-!-margin-bottom-4">
        Independent assessors
      </h2>

      <dl
        v-if="applicantProvidedFirstAssessor"
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <div class="govuk-summary-list__row text-right print-none button-right">
          <dt class="govuk-summary-list__key" />
          <dd class="govuk-summary-list__value">
            <button
              v-if="editable"
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
            Type
          </dt>
          <dd class="govuk-summary-list__value">
            {{ $filters.lookup(application.firstAssessorType) }} assessor
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

      <dl
        v-else
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <dt
          class="govuk-summary-list__key widerColumn"
        >
          No information for First Assessor
          <span v-if="!isApplicationPartAsked('assessorsDetails')">
            (not asked)
          </span>
        </dt>
        <dd
          v-if="editable"
          class="govuk-summary-list__value"
        >
          <button
            class="govuk-button btn-unlock float-right"
            @click="editAssessor(1)"
          >
            Add
          </button>
        </dd>
      </dl>

      <dl
        v-if="applicantProvidedSecondAssessor"
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row text-right print-none button-right">
          <dt class="govuk-summary-list__key" />
          <dd class="govuk-summary-list__value">
            <button
              v-if="editable"
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
            Type
          </dt>
          <dd class="govuk-summary-list__value">
            {{ $filters.lookup(application.secondAssessorType) }} assessor
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
          class="govuk-summary-list__key widerColumn"
        >
          No information for Second Assessor
          <span v-if="!isApplicationPartAsked('assessorsDetails')">
            (not asked)
          </span>
        </dt>
        <dd
          v-if="editable"
          class="govuk-summary-list__value"
        >
          <button
            class="govuk-button btn-unlock float-right"
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
          :application="application"
          :application-id="applicationId"
          @close="closeModal('modalRef')"
        />
      </Modal>
    </div>

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
              v-if="editable"
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

        <div class="govuk-summary-list__row print-none">
          <dt class="govuk-summary-list__key">
            Email
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.leadershipJudgeDetails.email }}
          </dd>
        </div>

        <div class="govuk-summary-list__row print-none">
          <dt class="govuk-summary-list__key">
            Telephone
          </dt>
          <dd class="govuk-summary-list__value">
            {{ application.leadershipJudgeDetails.phone }}
          </dd>
        </div>
      </dl>

      <dl
        v-else
        class="govuk-summary-list"
      >
        <dt
          class="govuk-summary-list__key widerColumn"
        >
          No information for Leadership Judge
        </dt>
        <dd
          v-if="editable"
          class="govuk-summary-list__value"
        >
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
          :application="application"
          :application-id="applicationId"
          @close="closeModal('modalLeadershipJudgeDetails')"
        />
      </Modal>
    </div>
  </div>
</template>
<script>
import { hasLeadershipJudgeAssessment, hasIndependentAssessments, isApplicationPartAsked } from '@/helpers/exerciseHelper';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import IndependentAssessorChange from '@/components/ModalViews/IndependentAssessorChange.vue';
import LeadershipJudgeDetails from '@/components/ModalViews/LeadershipJudgeDetails.vue';

export default {
  name: 'AssessorsSummary',
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
    applicationId: {
      type: String,
      required: true,
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  data() {
    return {
      assessorDetails: {},
    };
  },
  computed: {
    applicantProvidedFirstAssessor() {
      const { firstAssessorType, firstAssessorEmail, firstAssessorFullName, firstAssessorPhone, firstAssessorTitle } = this.application;
      return (firstAssessorType || firstAssessorEmail || firstAssessorFullName || firstAssessorPhone || firstAssessorTitle);
    },
    applicantProvidedSecondAssessor() {
      const { secondAssessorType, secondAssessorEmail, secondAssessorFullName, secondAssessorPhone, secondAssessorTitle } = this.application;
      return (secondAssessorType || secondAssessorEmail || secondAssessorFullName || secondAssessorPhone || secondAssessorTitle);
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
    closeModal(modal){
      this.$refs[modal].closeModal();
    },
    editAssessor(AssessorNr) {
      if (AssessorNr === 1) {
        this.assessorDetails = {
          AssessorNr: AssessorNr,
          applicationId: this.applicationId,
          type: this.application.firstAssessorType,
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
          type: this.application.secondAssessorType,
          email: this.application.secondAssessorEmail,
          fullName: this.application.secondAssessorFullName,
          phone: this.application.secondAssessorPhone,
          title: this.application.secondAssessorTitle,
        };
      }
      this.$refs.modalRef.openModal();
    },
    editLeadershipJudgeDetails() {
      this.$refs.modalLeadershipJudgeDetails.openModal();
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
