<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="">
      <div class="govuk-grid-column-full">
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
          @click="onSubmit"
        >
          Continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import Draggable from '@/components/DragAndDrop/Draggable.vue';
import Droppable from '@/components/DragAndDrop/Droppable.vue';
import { applicationContentList, unselectedApplicationParts, getExerciseSaveData } from '@/helpers/exerciseHelper';
import clone from 'clone';
import _set from 'lodash/set';
export default {
  components: {
    ErrorSummary,
    Draggable,
    Droppable,
  },
  extends: Form,
  data() {
    return {
      clonedExercise: null,
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
  },
  created() {
    this.clonedExercise = clone(this.exercise);
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
      }
    },
    updateClonedExercise(data) {
      const exerciseSavedData = getExerciseSaveData(this.clonedExercise, data);
      Object.keys(exerciseSavedData).forEach(key => {
        _set(this.clonedExercise, key, exerciseSavedData[key]);
      });
    },
    async onSubmit() {
      this.saveData['progress.applicationProcess'] = true;
      await this.$store.dispatch('exerciseDocument/save', this.saveData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-application-content'));
    },
  },
};
</script>
