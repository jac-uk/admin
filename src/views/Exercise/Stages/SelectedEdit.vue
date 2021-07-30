<template>
  <form @submit.prevent="validateAndSave">
    <div
      v-if="showWarning"
    >
      <Banner
        :message="warningMessage"
      />
      <button
        class="govuk-button govuk-!-margin-right-1"
        @click="confirm"
      >
        Proceed with change
      </button>
      <button
        class="govuk-button govuk-button--secondary"
        @click="cancel"
      >
        Cancel and amend
      </button>
    </div>
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
          required
          :messages="{
            required: 'Please specify a value'
          }"
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
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';
import { EXERCISE_STAGE, APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';

export default {
  components: {
    Banner,
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
      confirmedSave: false,
      showWarning: false,
      editEmpApplied: null,
      empApplied: null,
    };
  },
  computed: {
    applicationRecords() {
      return this.$store.state.stageSelected.records;
    },
    availableStatuses() {
      return this.$store.getters['stageSelected/availableStatuses'];
    },
    itemsToChange() {
      const selectedItems = this.$store.state.stageSelected.selectedItems;
      return selectedItems;
    },
    warningMessage() {
      return 'This application has issues';
    },
  },
  created() {
    // on refresh if there's no IDs to change => redirect to the list
    if (this.itemsToChange.length === 0) {
      this.$router.push({ name: 'exercise-stages-selected-list' });
    }
  },
  methods: {
    itemsHaveIssues() {
      const selectedApplications = this.applicationRecords.filter(item => this.itemsToChange.indexOf(item.application.id) >= 0);
      return selectedApplications.filter(item => item.flags.eligibilityIssues || item.flags.characterIssues).length;
    },
    confirm(){
      this.confirmedSave = true;
    },
    cancel(){
      this.showWarning = false;
    },
    async save() {
      if (!this.confirmedSave && this.itemsHaveIssues()){
        this.showWarning = true;
      } else {
        let stageValue = EXERCISE_STAGE.SELECTED;
        if (this.newSelectedStatus === APPLICATION_STATUS.PASSED_SELECTION) {
          stageValue = EXERCISE_STAGE.RECOMMENDED;
        }
        const data = {
          status: this.newSelectedStatus,
          nextStage: stageValue,
        };
        if (this.editEmpApplied[0]) {
          data.empApplied = this.empApplied;
        }
        await this.$store.dispatch('stageSelected/updateStatus', data);
        this.$router.push({ name: 'exercise-stages-selected-list' });
      }
    },
  },
};
</script>
