<template>
  <div>
    <div class="modal__title text-left govuk-!-padding-2 background-blue">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Exercise Advert Type
      </h2>
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form
          @submit.prevent="validateAndSave"
        >
          <ErrorSummary
            :errors="errors"
          />
          <fieldset>
            <Select
              id="exercise-advert-type"
              v-model="formData.advertType"
              required
            >
              <option
                v-for="exerciseAdvertType in exerciseAdvertTypes"
                :key="exerciseAdvertType"
                :value="exerciseAdvertType"
              >
                {{ exerciseAdvertType | lookup }}
              </option>
            </Select>
          </fieldset>
          <button
            class="govuk-button govuk-!-margin-right-3"
          >
            Save
          </button>
          <button
            type="button"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="closeModal"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import { exerciseAdvertTypes } from '@/helpers/exerciseHelper';
import { ADVERT_TYPES } from '@/helpers/constants';

export default {
  name: 'ChangeExerciseAdvertType',
  components: {
    Select,
    ErrorSummary,
  },
  extends: Form,
  props: {
    advertType: {
      type: String,
      required: true,
      default: ADVERT_TYPES.FULL,
    },
  },
  data() {
    const exercise = this.$store.state.exerciseDocument.record;
    return {
      formData: {
        state: 'review',
      },
      exerciseAdvertTypes: exerciseAdvertTypes(exercise),
    };
  },
  created() {
    this.formData.advertType = this.advertType;
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmModal() {
      this.modalOpen = false;
      this.$emit('confirmed');
      document.body.style.overflow = '';
    },
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.closeModal();
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
