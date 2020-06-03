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
      return this.itemsHaveIssues > 1 ? `${this.itemsHaveIssues()} candidates have issues` : '1 candidate has issues';
    },
  },
  created() {
    // on refresh if there's no IDs to change => redirect to the list
    if (this.itemsToChange.length === 0) {
      this.$router.push({ name: 'exercise-stages-recommended-list' });
    }
  },
  methods: {
    itemsHaveIssues() {
      const selectedApplications = this.applicationRecords.filter(item => this.itemsToChange.indexOf(item.application.id) >= 0);
      return selectedApplications.filter(item => item.flags.eligibilityIssues || item.flags.characterIssues).length;
    },
    async save() {
      if (this.itemsHaveIssues()) {
        this.showWarning = true;
      } else {
        await this.$store.dispatch('stageRecommended/updateStatus', { status: this.newSelectedStatus });
        this.$router.push({ name: 'exercise-stages-recommended-list' });
      }
    },
  },
};
</script>
