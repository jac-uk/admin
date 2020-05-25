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
        :key="item.ref"
        :value="item.ref"
        :label="item.title"
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
      return this.$store.getters['stageReview/availableStatuses'];
    },
  },
  methods: {
    async save() {
      await this.$store.dispatch('stageReview/updateStatus', { applicationId: this.applicationId, status: this.newSelectedStatus });
      this.$router.push({ name: 'exercise-stages-review-list' });
    },
  },
};
</script>
