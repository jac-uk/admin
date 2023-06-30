<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="">
      <div class="govuk-grid-column-full">
        <div
          v-if="!hasJourney"
          class="text-right"
        >
          <BackLink class="govuk-!-margin-top-0 govuk-!-margin-bottom-0" />
        </div>

        <h2 class="govuk-heading-l">
          Application process
        </h2>

        <ErrorSummary
          :errors="errors"
        />

        <p class="govuk-body">
          Drag and drop to configure the application process for this exercise
        </p>

        <div class="govuk-grid-row">
          <div class="govuk-grid-column-one-half">
            <div
              v-for="(state, index) in applicationContentList"
              :key="index"
            >
              <Droppable
                :id="state.ref"
                @drop="onDrop"
              >
                <h3 class="govuk-heading-m govuk-!-margin-bottom-0">
                  {{ $filters.lookup(state.ref) }}
                </h3>
                <p class="govuk-body">
                  <Draggable
                    v-for="part in state.parts"
                    :key="part"
                    :data="{
                      step: state.ref,
                      part: part,
                    }"
                    class="display-inline govuk-!-margin-right-1"
                  >
                    {{ $filters.lookup(part) }}
                  </Draggable>
                </p>
              </Droppable>
            </div>
          </div>
          <div class="govuk-grid-column-one-half">
            <Droppable
              :id="'empty'"
              @drop="onDrop"
            >
              <h3 class="govuk-heading-m govuk-!-margin-bottom-0">
                Not requested
              </h3>
              <p class="govuk-body">
                <Draggable
                  v-for="part in unselectedApplicationParts"
                  :key="part"
                  :data="{
                    step: 'empty',
                    part: part,
                  }"
                  class="display-block govuk-!-margin-right-1"
                >
                  {{ $filters.lookup(part) }}
                </Draggable>
              </p>
            </Droppable>
          </div>
        </div>

        <button
          type="button"
          class="govuk-button"
          :disabled="!snapshotHasChanged"
          @click="onSubmit"
        >
          Continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';
import Draggable from '@/components/DragAndDrop/Draggable';
import Droppable from '@/components/DragAndDrop/Droppable';
import { applicationContentList, unselectedApplicationParts, exerciseApplicationParts, configuredApplicationParts, APPLICATION_STEPS } from '@/helpers/exerciseHelper';
import clone from 'clone';
import _set from 'lodash/set';
export default {
  components: {
    ErrorSummary,
    BackLink,
    Draggable,
    Droppable,
  },
  extends: Form,
  data() {
    return {
      clonedExercise: null,
      initialSnapshot: null,
      currentSnapshot: null,
      saveData: {},
    };
  },
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationContentList() {
      return applicationContentList(this.clonedExercise);
    },
    unselectedApplicationParts() {
      return unselectedApplicationParts(this.clonedExercise);
    },
    snapshotHasChanged() {
      return this.currentSnapshot && (this.initialSnapshot !== this.currentSnapshot);
    },
  },
  created() {
    this.clonedExercise = clone(this.exercise);
    this.initialSnapshot = this.createSnapshot();
  },
  methods: {
    async onDrop(droppedItem) {
      if (droppedItem && droppedItem.id !== droppedItem.data.step) {
        if (droppedItem.id !== 'empty') {
          this.saveData[`_applicationContent.${droppedItem.id}.${droppedItem.data.part}`] = true;
        }
        if (droppedItem.data.step !== 'empty') {
          this.saveData[`_applicationContent.${droppedItem.data.step}.${droppedItem.data.part}`] = false;
        }
        this.updateClonedExercise(this.saveData);
        this.currentSnapshot = this.createSnapshot();
      }
    },
    updateClonedExercise(data) {
      const exerciseSavedData = this.getExerciseSaveData(this.clonedExercise, data);
      Object.keys(exerciseSavedData).forEach(key => {
        _set(this.clonedExercise, key, exerciseSavedData[key]);
      });
    },
    async onSubmit() {
      await this.$store.dispatch('exerciseDocument/save', this.getExerciseSaveData(this.clonedExercise, this.saveData));
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-application-content'));
    },
    createSnapshot() {
      return JSON.stringify(this.applicationContentList);
    },
    getExerciseSaveData(exercise, data) {
      // Creates the _applicationContent if it doesnt already exist
      const saveData = clone(data);
      if (JSON.stringify(saveData).indexOf('_applicationContent') === -1) {  // recalculate applicationContent (if necessary)
        const applicationParts = exerciseApplicationParts(exercise, data);
        const existingApplicationParts = configuredApplicationParts(exercise);
        const newApplicationParts = applicationParts.filter(part => existingApplicationParts.indexOf(part) === -1);
        if (newApplicationParts.length || existingApplicationParts.length !== applicationParts.length) {
          const applicationContentBefore = exercise._applicationContent ? exercise._applicationContent : {};
          const applicationContentAfter = {};
          APPLICATION_STEPS.forEach(step => {
            applicationContentAfter[step] = {};
            applicationParts.forEach(part => {
              if (applicationContentBefore[step] && (applicationContentBefore[step][part] === true || applicationContentBefore[step][part] === false)) {
                applicationContentAfter[step][part] = applicationContentBefore[step][part];
              } else if (step === 'registration' && newApplicationParts.indexOf(part) >= 0) {
                applicationContentAfter[step][part] = true;
              }
            });
          });
          if (applicationContentBefore._currentStep) {
            applicationContentAfter._currentStep = applicationContentBefore._currentStep;
          }
          saveData['_applicationContent'] = applicationContentAfter;
        }
      }
      return saveData;
    },
  },
};
</script>
