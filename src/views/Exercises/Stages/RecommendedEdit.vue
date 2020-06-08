<template>
  <form @submit.prevent="validateAndSave">
    <div
      v-if="showWarning"
    >
      <Banner
        :message="warningMessage"
      />
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
      showWarning: false,
      confirmedSave: false,
    };
  },
  computed: {
    applicationRecords() {
      return this.$store.state.stageRecommended.records;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    availableStatuses() {
      return this.$store.getters['stageRecommended/availableStatuses'];
    },
    itemsToChange() {
      const selectedItems = this.$store.state.stageRecommended.selectedItems;
      return selectedItems;
    },
    warningMessage() {
      return (this.itemsWithIssues() > 1) ? `${this.itemsWithIssues()} candidates have issues` : '1 candidate has issues';
    },
  },
  created() {
    // on refresh if there's no IDs to change => redirect to the list
    if (this.itemsToChange.length === 0) {
      this.$router.push({ name: 'exercise-stages-recommended-list' });
    }
  },
  methods: {
    itemsWithIssues() {
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
      if (this.itemsWithIssues() && this.newSelectedStatus === APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT){
        this.showWarning = true;
      } else {
        let stageValue = EXERCISE_STAGE.RECOMMENDED;
        if (this.newSelectedStatus === APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT) {
          stageValue = EXERCISE_STAGE.HANDOVER;
        }
        await this.$store.dispatch('stageRecommended/updateStatus', { 
          applicationId: this.applicationId, 
          status: this.newSelectedStatus, 
          nextStage: stageValue,
        });
        this.$router.push({ name: 'exercise-stages-recommended-list' });
      }
    },
  },
};
</script>
