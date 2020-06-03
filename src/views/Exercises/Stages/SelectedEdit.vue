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
    applicationId() {
      return this.$route.params.applicationId;
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
    hasIssues(applicationId) {
      const individualApplication = this.applicationRecords.filter(item => item.application.id === applicationId)[0];
      return (individualApplication.flags.eligibilityIssues || individualApplication.flags.characterIssues);
    },
    confirm(){
      this.confirmedSave = true;
    },
    cancel(){
      this.showWarning = false;
    },
    async save() {
      if (!this.confirmedSave && this.hasIssues(this.applicationId)){
        this.showWarning = true;
      } else {
        await this.$store.dispatch('stageSelected/updateStatus', { status: this.newSelectedStatus });
        this.$router.push({ name: 'exercise-stages-selected-list' });
      }
    },
  },
};
</script>
