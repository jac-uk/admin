<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
        class="govuk-link"
        :to="{name: 'exercise-details-application-content-edit'}"
      >
        Update application process
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Application process
    </h2>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div
          v-for="(state, index) in applicationContentList"
          :key="index"
        >
          <div v-if="state.parts.length">
            <h3 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ state.ref | lookup }}
            </h3>
            <p class="govuk-body">
              <span
                v-for="part in state.parts"
                :key="part"
                class="display-block"
              >
                {{ part | lookup }}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="isEditable"
        class="govuk-grid-column-one-half"
      >
        <div v-if="unselectedApplicationParts.length">
          <h3 class="govuk-heading-m govuk-!-margin-bottom-0">
            Not requested
          </h3>
          <p class="govuk-body">
            <span
              v-for="part in unselectedApplicationParts"
              :key="part"
              class="display-block"
            >
              {{ part | lookup }}
            </span>
          </p>
        </div>
      </div>
      <div
        v-else-if="exercise._applicationContent"
        class="govuk-grid-column-one-half"
      >
        <div class="background-blue govuk-!-padding-3">
          <span v-if="exercise._applicationContent._currentStep && exercise._applicationContent._currentStep.start > new Date()">Next stage</span>
          <span v-else>Current stage</span>
          <div
            v-if="isProcessing"
            class="float-right"
          >
            <a
              class="govuk-link"
              @click="$refs['modalEditCurrentStep'].openModal()"
            >
              Edit
            </a>
          </div>
          <div v-if="exercise._applicationContent._currentStep">
            <div class="govuk-!-font-size-27">
              {{ exercise._applicationContent._currentStep.step | lookup }}
            </div>
            <div
              v-if="exercise._applicationContent._currentStep.start"
              class="govuk-!-margin-top-3"
            >
              <span>Open for changes</span>
              <div class="govuk-!-font-size-27">
                {{ exercise._applicationContent._currentStep.start | formatDate('long') }}
              </div>
            </div>
            <div
              v-if="exercise._applicationContent._currentStep.end"
              class="govuk-!-margin-top-3"
            >
              <span>Closed for changes</span>
              <div class="govuk-!-font-size-27">
                {{ exercise._applicationContent._currentStep.end | formatDate('long') }}
              </div>
            </div>
          </div>
          <div
            v-else
            class="govuk-!-font-size-27"
          >
            Registration
          </div>
        </div>
      </div>
    </div>
    <Modal
      ref="modalEditCurrentStep"
    >
      <EditCurrentStep
        :exercise="exercise"
        @close="$refs['modalEditCurrentStep'].closeModal()"
      />
    </Modal>
  </div>
</template>

<script>

import { isEditable, isProcessing, applicationContentList, unselectedApplicationParts } from '@/helpers/exerciseHelper';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import EditCurrentStep from './EditCurrentStep';

export default {
  components: {
    Modal,
    EditCurrentStep,
  },
  computed: {
    exercise () {
      return this.$store.state.exerciseDocument.record;
    },
    applicationContentList () {
      return applicationContentList(this.exercise);
    },
    isEditable () {
      return isEditable(this.exercise);
    },
    isProcessing () {
      return isProcessing(this.exercise);
    },
    unselectedApplicationParts () {
      return unselectedApplicationParts(this.exercise);
    },
  },
};
</script>
