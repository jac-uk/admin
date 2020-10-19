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
        label="Type of test"
        required
      >
        <CheckboxItem
          v-for="qualifyingTest in filteredQualifyingTests"
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
import { QUALIFYING_TEST } from '@/helpers/constants';

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
      return this.$store.state.qualifyingTest.records;
    },
    filteredQualifyingTests() {
      if (this.qualifyingTests && this.qualifyingTests.length) {
        return this.qualifyingTests.filter(qualifyingTest => {
          return qualifyingTest.status === QUALIFYING_TEST.STATUS.COMPLETED
            && qualifyingTest.mode !== QUALIFYING_TEST.MODE.MOP_UP;
        });
      }
      return [];
    },
  },
  created() {
    if (this.$store.state.qualifyingTest.records.length === 0) {
      this.$store.dispatch('qualifyingTest/bindQTs', this.exerciseId);
    }
  },
  methods: {
    async save() {
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
          qualifyingTests: qualifyingTests,
        },
      };
      console.log('data to save', data);

      // const qualifyingTestId = await this.$store.dispatch('qualifyingTest/create', this.qualifyingTest);
      // this.$router.push({
      //   name: 'qualifying-test-edit',
      //   params: {
      //     qualifyingTestId: qualifyingTestId,
      //   },
      // });
    },
  },
};
</script>
