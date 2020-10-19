<template>
  <div class="govuk-grid-column-two-thirds">
    <form @submit.prevent="validateAndSave">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Qualifying Test Report
      </h2>
      <h3 class="govuk-heading-l ">
        {{ reportTitle }}
      </h3>

      <ErrorSummary
        :errors="errors"
        :show-save-button="false"
        @save="save"
      />

      <CheckboxGroup
        id="qualifyingTest-type"
        v-model="qualifyingTestIds"
        label="Tests in report"
        required
      >
        <CheckboxItem
          v-for="qualifyingTest in qualifyingTests"
          :key="qualifyingTest.id"
          :value="qualifyingTest.id"
          :label="qualifyingTest.title"
        />
      </CheckboxGroup>

      <button class="govuk-button">
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';

export default {
  components: {
    ErrorSummary,
    CheckboxGroup,
    CheckboxItem,
  },
  extends: Form,
  data(){
    const selectedIds = [];
    const qualifyingTestReport = this.$store.state.qualifyingTestReport.record;
    if (qualifyingTestReport && qualifyingTestReport.qualifyingTests && qualifyingTestReport.qualifyingTests.length) {
      qualifyingTestReport.qualifyingTests.forEach(qualifyingTest => {
        selectedIds.push(qualifyingTest.id);
      });
    }
    return {
      qualifyingTestIds: selectedIds,
    };
  },
  computed: {
    exerciseId() {
      return this.$route.params.id;
    },
    qualifyingTests() {
      return this.$store.getters['qualifyingTest/getCompletedQTs'];
    },
    qualifyingTestReport() {
      const record = this.$store.state.qualifyingTestReport.record;
      return record;
    },
    reportTitle() {
      const titles = [];
      this.qualifyingTestReport.qualifyingTests.forEach(qualifyingTest => {
        titles.push(qualifyingTest.title);
      });
      return titles.join(' + ');
    },
  },
  created() {
    if (this.$store.state.qualifyingTest.records.length === 0) {
      this.$store.dispatch('qualifyingTest/bindQTs', this.exerciseId);
    }
  },
  methods: {
    async save() {
      if (this.qualifyingTestIds.length) {
        const qualifyingTests = [];
        this.qualifyingTestIds.forEach(id => {
          const qualifyingTest = this.qualifyingTests.find(qualifyingTest => {
            return qualifyingTest.id === id;
          });
          qualifyingTests.push({
            id: qualifyingTest.id,
            title: qualifyingTest.title,
            maxScore: qualifyingTest.maxScore,
          });
        });
        const data = {
          qualifyingTests: qualifyingTests,
        };
        await this.$store.dispatch('qualifyingTestReport/save', data);
        this.$router.push({
          name: 'qualifying-test-report-view',
          params: {
            qualifyingTestReportId: this.qualifyingTestReport.id,
          },
        });
      }
    },
  },
};
</script>
