<template>
  <form @submit.prevent="validateAndSave">
    <ErrorSummary
      :errors="errors"
    />
    <RadioGroup
      id="selected-status"
      v-model="moveBack"
      :label="`Move back to the '${lookup(previousStage)}' stage?`"
      hint=""
      required
    >
      <RadioItem
        v-for="item in choices"
        :key="item"
        :value="item"
        :label="item | lookup"
      />
    </RadioGroup>
    <button class="govuk-button">
      Save and continue
    </button>
  </form>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';
import { DEFAULT } from '@jac-uk/jac-kit/helpers/constants';
import { getPreviousStage } from '../../../helpers/exerciseHelper';
import { lookup } from '../../../filters';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  data() {
    return {
      moveBack: null,
      choices: [
        DEFAULT.YES,
        DEFAULT.NO,
      ],
    };
  },
  computed: {
    stage() {
      return this.$route.params.stage;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    previousStage() {
      return getPreviousStage(this.exercise, this.stage);
    },
  },
  methods: {
    lookup,
    async save() {
      if (this.moveBack === DEFAULT.YES) {
        await this.$store.dispatch('applicationRecords/updateStatus', {
          stage: this.previousStage,
        });
      }
      this.$router.push({ name: 'exercise-stages-list' });
    },
  },
};
</script>
