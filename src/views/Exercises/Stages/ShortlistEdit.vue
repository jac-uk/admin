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
      v-model="editEMPFlag"
      label="Equal Merit Provision"
      hint=""
      required
      :messages="{
        required: 'Please specify whether you\'d like to add more information'
      }"          
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
      editEMPFlag: null,
      editEMPFlagStatus: null,
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
      await this.$store.dispatch('stageShortlisted/updateStatus', { applicationId: this.applicationId, status: this.newSelectedStatus, empVal: { shouldUpdate: this.editEMPFlag, newStatus: this.editEMPFlagStatus } });
      this.$router.push({ name: 'exercise-stages-shortlist-list' });
    },
  },
};
</script>
