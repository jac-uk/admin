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
                  {{ state.ref | lookup }}
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
                    {{ part | lookup }}
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
                  {{ part | lookup }}
                </Draggable>
              </p>
            </Droppable>
          </div>
        </div>

        <button
          type="button"
          class="govuk-button"
          @click="nextPage"
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
import { applicationContentList, unselectedApplicationParts } from '@/helpers/exerciseHelper';

export default {
  components: {
    ErrorSummary,
    BackLink,
    Draggable,
    Droppable,
  },
  extends: Form,
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationContentList() {
      return applicationContentList(this.exercise);
    },
    unselectedApplicationParts() {
      return unselectedApplicationParts(this.exercise);
    },
  },
  methods: {
    async onDrop(data) {
      if (data && data.id !== data.data.step) {
        const saveData = {};
        if (data.id !== 'empty') {
          saveData[`applicationContent.${data.id}.${data.data.part}`] = true;
        }
        if (data.data.step !== 'empty') {
          saveData[`applicationContent.${data.data.step}.${data.data.part}`] = false;
        }
        await this.$store.dispatch('exerciseDocument/save', saveData);
      }
    },
    nextPage() {
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-application-content'));
    },
  },
};
</script>
