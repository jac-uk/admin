<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
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
              {{ $filters.lookup(state.ref) }}
            </h3>
            <p class="govuk-body">
              <span
                v-for="part in state.parts"
                :key="part"
                class="display-block"
              >
                {{ $filters.lookup(part) }}
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
              {{ $filters.lookup(part) }}
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
              v-if="hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
              class="govuk-link"
              @click="$refs['modalEditCurrentStep'].openModal()"
            >
              Edit
            </a>
          </div>
          <div v-if="exercise._applicationContent._currentStep">
            <div class="govuk-!-font-size-27">
              {{ $filters.lookup(exercise._applicationContent._currentStep.step) }}
            </div>
            <div
              v-if="exercise._applicationContent._currentStep.start"
              class="govuk-!-margin-top-3"
            >
              <span>Open for changes</span>
              <div class="govuk-!-font-size-27">
                {{ $filters.formatDate(exercise._applicationContent._currentStep.start , 'long') }}
              </div>
            </div>
            <div
              v-if="exercise._applicationContent._currentStep.end"
              class="govuk-!-margin-top-3"
            >
              <span>Closed for changes</span>
              <div class="govuk-!-font-size-27">
                {{ $filters.formatDate(exercise._applicationContent._currentStep.end, 'long') }}
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
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import EditCurrentStep from './EditCurrentStep.vue';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'ApplicationContentView',
  components: {
    Modal,
    EditCurrentStep,
  },
  mixins: [permissionMixin],
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationContentList() {
      return applicationContentList(this.exercise);
    },
    isEditable() {
      return isEditable(this.exercise);
    },
    isProcessing() {
      return isProcessing(this.exercise);
    },
    unselectedApplicationParts() {
      return unselectedApplicationParts(this.exercise);
    },
  },
};
</script>
