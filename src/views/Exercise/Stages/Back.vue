<template>
  <form @submit.prevent="validateAndSave">
    <BackLink />
    <ErrorSummary
      :errors="errors"
    />
    <RadioGroup
      id="selected-status"
      v-model="moveBack"
      :label="`Move ${itemsToChange.length} ${$filters.pluralise('application', itemsToChange.length)} back to the '${lookup(previousStage)}' stage?`"
      hint=""
      required
    >
      <RadioItem
        v-for="item in choices"
        :key="item"
        :value="item"
        :label="$filters.lookup(item)"
      />
    </RadioGroup>
    <button class="govuk-button">
      Save and continue
    </button>
  </form>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink.vue';
import { DEFAULT } from '@jac-uk/jac-kit/helpers/constants';
import { getPreviousStage } from '@jac-uk/jac-kit/helpers/exerciseHelper';
import { lookup } from '../../../filters';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
    BackLink,
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
    itemsToChange() {
      const selectedItems = this.$store.state.applicationRecords.selectedItems;
      return selectedItems;
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
      this.$router.push({ name: 'exercise-stage-list' });
    },
  },
};
</script>
