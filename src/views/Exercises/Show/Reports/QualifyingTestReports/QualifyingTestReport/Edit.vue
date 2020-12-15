<template>
  <div class="govuk-grid-column-two-thirds">
    <form @submit.prevent="validateAndSave">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Qualifying Test Report
      </h2>
      <h3 class="govuk-heading-l ">
        {{ qualifyingTestReport.title }}
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

      <Select
        v-if="exercise.jurisdictionQuestion"
        id="filter-jurisdiction"
        v-model="filters.jurisdiction"
        label="Filter by jurisdiction"
      >
        <option value="">
          No filter
        </option>
        <option
          v-for="(answer, index) in exercise.jurisdictionQuestionAnswers"
          :key="index"
          :value="answer.answer"
        >
          {{ answer.answer }}
        </option>
      </Select>

      <button class="govuk-button">
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';

export default {
  components: {
    ErrorSummary,
    CheckboxGroup,
    CheckboxItem,
    Select,
  },
  extends: Form,
  data() {
    const selectedIds = [];
    const qualifyingTestReport = this.$store.getters['qualifyingTestReport/data'];
    if (qualifyingTestReport && qualifyingTestReport.qualifyingTests && qualifyingTestReport.qualifyingTests.length) {
      qualifyingTestReport.qualifyingTests.forEach(qualifyingTest => {
        selectedIds.push(qualifyingTest.id);
      });
    }
    let filters = {};
    if (qualifyingTestReport.filters) {
      filters = qualifyingTestReport.filters;
    }
    return {
      qualifyingTestIds: selectedIds,
      filters: filters,
    };
  },
  computed: {
    exerciseId() {
      return this.$route.params.id;
    },
    qualifyingTestReportId() {
      return this.$route.params.qualifyingTestReportId;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    qualifyingTests() {
      return this.$store.getters['qualifyingTest/getCompletedQTs'];
    },
    qualifyingTestReport() {
      return this.$store.getters['qualifyingTestReport/data'];
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
          filters: this.filters,
        };

        await this.$store.dispatch('qualifyingTestReport/save', data);
        this.$router.push({
          name: 'qualifying-test-report-view',
          params: {
            qualifyingTestReportId: this.qualifyingTestReportId,
          },
        });
      }
    },
  },
};
</script>
