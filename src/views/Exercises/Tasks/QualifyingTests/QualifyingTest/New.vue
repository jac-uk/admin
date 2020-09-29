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

      <RadioGroup
        id="qualifyingTest-type"
        v-model="qualifyingTest.type"
        label="Type of test"
        required
      >
        <RadioItem
          v-for="item in testTypes"
          :key="item"
          :value="item"
          :label="item | lookup"
        />
      </RadioGroup>

      <Checkbox
        id="is-dry-run"
        v-model="isDryRun"
        label="Dry run"
      >
        Yes, this is a dry run
      </Checkbox>

      <button class="govuk-button">
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';
import Checkbox from '@/components/Form/Checkbox';
import { QUALIFYING_TEST } from '@/helpers/constants';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
    Checkbox,
  },
  extends: Form,
  data(){
    const exercise = this.$store.state.exerciseDocument.record;

    const defaults = {
      type: null,
      vacancy: {
        mailbox: exercise.exerciseMailbox,
        contactPhone: exercise.exercisePhoneNumber,
        id: exercise.id,
        referenceNumber: exercise.referenceNumber,
        name: exercise.name,
      },
    };
    const data = this.$store.getters['qualifyingTest/data']();

    const qualifyingTest = { ...defaults, ...data };

    return {
      qualifyingTest: qualifyingTest,
      isDryRun: false,
    };
  },
  computed: {
    testTypes() {
      return QUALIFYING_TEST.TYPE;
    },
  },
  methods: {
    async save() {
      if (this.isDryRun) {
        this.qualifyingTest.mode = QUALIFYING_TEST.MODE.DRY_RUN;
      }
      const qualifyingTestId = await this.$store.dispatch('qualifyingTest/create', this.qualifyingTest);

      this.$router.push({
        name: 'qualifying-test-edit',
        params: {
          qualifyingTestId: qualifyingTestId,
        },
      });
    },
  },
};
</script>
