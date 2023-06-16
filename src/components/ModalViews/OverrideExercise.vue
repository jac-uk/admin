<template>
  <div>
    <div class="modal__title text-left govuk-!-padding-2 background-blue">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Override an exercise
      </h2>
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div style="text-align: left;">
        <p
          v-if="errorMessage"
          class="govuk-error-message"
        >
          {{ errorMessage }}
        </p>
        <Select
          id="draft-exercise-select"
          v-model="referenceNumber"
          label=""
          required
        >
          <option
            v-for="exercise in draftRecords"
            :key="exercise.referenceNumber"
            :value="exercise.referenceNumber"
          >
            {{ `${exercise.referenceNumber} ${exercise.name}` }}
          </option>
        </Select>
        <button
          class="govuk-button govuk-!-margin-right-3"
          :disabled="!referenceNumber"
          @click="save"
        >
          Override
        </button>
        <button
          type="button"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeModal"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';

export default {
  name: 'OverrideExercise',
  components: {
    Select,
  },
  emits: ['close', 'confirmed'],
  data() {
    return {
      referenceNumber: '',
      errorMessage: '',
    };
  },
  computed: {
    ...mapState('exerciseCollection', [
      'draftRecords',
    ]),
  },
  mounted() {
    this.$store.dispatch('exerciseCollection/bindDraft');
  },
  unmounted() {
    this.$store.dispatch('exerciseCollection/unbindDraft');
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async save() {
      this.errorMessage = '';

      if (!this.referenceNumber) {
        this.errorMessage = 'Please select an exercise.';
        return;
      }

      const exercise = this.draftRecords.find(record => record.referenceNumber === this.referenceNumber);
      if (exercise) {
        this.$emit('confirmed', { exerciseId: exercise.id, referenceNumber: this.referenceNumber });
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Exercise does not exist.';
      }
    },
  },
};
</script>

<style scoped>
  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }
</style>
