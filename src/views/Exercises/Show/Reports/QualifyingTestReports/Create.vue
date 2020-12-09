<template>
  <div class="govuk-grid-column-two-thirds">
    <form @submit.prevent="validateAndSave">
      <h2 class="govuk-heading-l">
        Create a qualifying test
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
  components: {
    ErrorSummary,
    CheckboxGroup,
    CheckboxItem,
  },
  extends: Form,
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
      return this.$store.getters['qualifyingTest/getCompletedQTs'];
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
          exercise: {
            id: this.exerciseId,
          },
          qualifyingTests: qualifyingTests,
        };
        await this.$store.dispatch('qualifyingTestReport/create', data);
        this.$router.push({
          name: 'qualifying-test-reports',
        });
      }
    },
  },
};
</script>
