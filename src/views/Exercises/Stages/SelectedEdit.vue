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
    <button class="govuk-button">
      Save and continue
    </button>      
  </form>
</template>

<script>
import Banner from '@/components/Page/Banner';
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';
import { EXERCISE_STAGE, APPLICATION_STATUS } from '@/helpers/constants';

export default {
  components: {
    Banner,
    ErrorSummary,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  data() {
    return {
      newSelectedStatus: null,
      confirmedSave: false,
      showWarning: false,
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
        await this.$store.dispatch('stageSelected/updateStatus', { 
          applicationId: this.applicationId, 
          status: this.newSelectedStatus,
          nextStage: stageValue,
        });
        this.$router.push({ name: 'exercise-stages-selected-list' });
      }
    },
  },
};
</script>
