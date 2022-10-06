<template>
  <div class="govuk-grid-column-two-thirds">
    <form @submit.prevent="validateAndSave">
      <h2 class="govuk-heading-l">
        Create a {{ tieBreakers ? 'an equal merit tie-breaker' : 'a qualifying test' }} report
      </h2>

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
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';

export default {
  name: 'QualifyingTestReportCreate',
  components: {
    ErrorSummary,
    CheckboxGroup,
    CheckboxItem,
  },
  extends: Form,
  props: {
    tieBreakers: {
      required: true,
      type: Boolean,
    },
  },
  data(){
    return {
      qualifyingTestIds: [],
    };
  },
  computed: {
    exerciseId() {
      return this.$route.params.id;
    },
    qualifyingTests() {
      return this.$store.getters['qualifyingTest/getCompletedQTs'].filter(row => {
        return this.tieBreakers == (row.isTieBreaker == true); // to cater for the isTieBreaker field being absent
      });
    },
    routeNamePrefix() {
      return this.tieBreakers ? 'equal-merit-tie-breaker' : 'qualifying-test';
    },
  },
  created() {
    if (this.$store.state.qualifyingTest.records.length === 0) {
      this.$store.dispatch('qualifyingTest/bindQTs', { exerciseId: this.exerciseId });
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
          exercise: {
            id: this.exerciseId,
          },
          tieBreakers: this.tieBreakers,
          qualifyingTests: qualifyingTests,
        };
        await this.$store.dispatch('qualifyingTestReport/create', data);
        this.$router.push({
          name: `${this.routeNamePrefix}-reports`,
        });
      }
    },
  },
};
</script>
