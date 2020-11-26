<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <BackLink />
      <h1
        class="govuk-heading-l"
      >
        Export Exercise Data
      </h1>
      <form @submit.prevent="validateAndSave">
        <ErrorSummary
          :errors="errors"
        />
        <button class="govuk-button">
          Download XLSX
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import BackLink from '@/components/BackLink';

export default {
  components: {
    ErrorSummary,
    BackLink,
  },
  extends: Form,
  computed: {
    selectedItems() {
      return this.$store.state.exerciseCollection.selectedItems;
    },
  },
  created() {
    if (this.selectedItems.length === 0) {
      this.$router.push({ name: 'dashboard' });
    }
  },
  methods: {
    async save() {
      console.log('download data', this.selectedItems);
    },
  },
};
</script>
