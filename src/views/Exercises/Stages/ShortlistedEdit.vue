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
      id="emp-edit-toggle"
      v-model="editEmpApplied"
      label="Equal Merit Provision"
      hint=""       
    >
      <CheckboxItem
        :value="true"
        label="Update EMP"
      >
        <RadioGroup
          id="emp-edit-input"
          v-model="empApplied"
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
import { EXERCISE_STAGE, APPLICATION_STATUS } from '@/helpers/constants';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';

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
      empApplied: null,
      editEmpApplied: null,
    };
  },
  computed: {
    applicationId() {
      return this.$route.params.applicationId;
    },
    availableStatuses() {
      return this.$store.getters['stageShortlisted/availableStatuses'];
    },
  },
  methods: {
    async save() {
      let stageValue = EXERCISE_STAGE.SHORTLISTED;
      if (this.newSelectedStatus === APPLICATION_STATUS.INVITED_TO_SELECTION_DAY) {
        stageValue = EXERCISE_STAGE.SELECTED;
      }
      const data = {
        status: this.newSelectedStatus, 
        nextStage: stageValue,
      };
      if (this.editEmpApplied[0]) {  
        data.empApplied = this.empApplied;
      }
      await this.$store.dispatch('stageShortlisted/updateStatus', data );
      this.$router.push({ name: 'exercise-stages-shortlisted-list' });
    },
  },
};
</script>
