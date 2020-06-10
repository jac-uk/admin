<template>
  <form @submit.prevent="validateAndSave">
    <ErrorSummary
      :errors="errors"
    />
    <RadioGroup
      id="selected-status"
      v-model="newSelectedStatus"
      label="Move back to the 'shortlisted' stage?"
      hint=""
      required
    >
      <RadioItem
        v-for="item in availableStatuses"
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
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';
import { DEFAULT, EXERCISE_STAGE } from '@/helpers/constants';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  data() {
    return {
      newSelectedStatus: null,
    };
  },
  computed: {
    applicationId() {
      return this.$route.params.applicationId;
    },
    availableStatuses() {
      const myStatus = [
        DEFAULT.YES,
        DEFAULT.NO,
      ];
      return myStatus;
    },
  },
  methods: {
    async save() {
      let stageValue = EXERCISE_STAGE.SELECTED;
      if (this.newSelectedStatus === DEFAULT.YES) {
        stageValue = EXERCISE_STAGE.SHORTLISTED;
        await this.$store.dispatch('stageSelected/updateStatus', { 
          applicationId: this.applicationId, 
          nextStage: stageValue,
        });
      }
      this.$router.push({ name: 'exercise-stages-selected-list' });
    },
  },
};
</script>
