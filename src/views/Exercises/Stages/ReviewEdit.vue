<template>
  <form @submit.prevent="validateAndSave">
    <ErrorSummary
      :errors="errors"
    />
    <RadioGroup
      id="selected-status"
      v-model="newSelectedStatus"
      label="Update status (TBC)"
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
    <CheckboxGroup
      id="shortlist"
      v-model="nextStageStatus"
      label="Move to next stage"
      hint=""
      value=""
    >
      <CheckboxItem
        :value="nextStageValueStatus"
        label="Shortlisted"
      />
    </CheckboxGroup> 
    <CheckboxGroup
      id="emp-edit-toggle"
      v-model="editEMPFlag"
      label="Equal Merit Provision"
      hint=""
    >
      <CheckboxItem
        :value="true"
        label="Update EMP"
      >
        <RadioGroup
          id="emp-edit-input"
          v-model="editEMPFlagStatus"
          label=""
          hint=""
          required
          :messages="{
            required: 'Please specify a value'
          }"          
        >
          <RadioItem
            :value="true"
            label="Yes - EMP has been Applied"
          />
          <RadioItem
            :value="false"
            label="No - EMP has not been Applied"
          />                  
        </RadioGroup> 
      </CheckboxItem>
    </CheckboxGroup>
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
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import { EXERCISE_STAGE } from '@/helpers/constants';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
    CheckboxGroup,
    CheckboxItem,
  },
  extends: Form,
  data() {
    return {
      newSelectedStatus: null,
      nextStageStatus: null,
      nextStageValueStatus: EXERCISE_STAGE.SHORTLISTED,
      editEMPFlag: null,
      editEMPFlagStatus: null,
    };
  },
  computed: {
    availableStatuses() {
      const shortlistingMethods = this.exercise.shortlistingMethods;
      const otherShortlistingMethod = this.exercise.otherShortlistingMethod || [];
      return this.$store.getters['stageReview/availableStatuses'](shortlistingMethods, otherShortlistingMethod) ;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    itemsToChange() {
      const selectedItems = this.$store.state.stageReview.selectedItems;
      return selectedItems;
    },
  },
  created() {
    // on refresh if there's no IDs to change => redirect to the list
    if (this.itemsToChange.length === 0) {
      this.$router.push({ name: 'exercise-stages-review-list' });
    }
  },
  methods: {
    async save() {
      const updateEmpVAL = this.editEMPFlag[0] ? this.editEMPFlagStatus : '';
      // console.log(updateEmpVAL, this.editEMPFlag[0], this.editEMPFlagStatus);
      
      await this.$store.dispatch('stageReview/updateStatus', { 
        status: this.newSelectedStatus, 
        nextStage: this.nextStageStatus, 
        empVal: updateEmpVAL, 
      });
      this.$router.push({ name: 'exercise-stages-review-list' });
    },
  },
};
</script>
