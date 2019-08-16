<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <fieldset class="govuk-fieldset govuk-!-padding-bottom-9">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
          <h2 class="govuk-fieldset__heading">
            Type of exercise
          </h2>
        </legend>
        <div class="govuk-radios govuk-radios">
          <div class="govuk-radios__item">
            <input
              id="legal"
              v-model="type"
              class="govuk-radios__input"
              name="legal"
              type="radio"
              value="legal"
            >
            <label
              class="govuk-label govuk-radios__label"
              for="legal"
            >
              Legal
            </label>
          </div>
          <div class="govuk-radios__item">
            <input
              id="non-legal"
              v-model="type"
              class="govuk-radios__input"
              name="non-legal"
              type="radio"
              value="non-legal"
            >
            <label
              class="govuk-label govuk-radios__label"
              for="non-legal"
            >
              Non legal
            </label>
          </div>
          <div class="govuk-radios__item">
            <input
              id="senior"
              v-model="type"
              class="govuk-radios__input"
              name="senior"
              type="radio"
              value="senior"
              disabled=""
            >
            <label
              class="govuk-label govuk-radios__label"
              for="senior"
              disabled=""
            >
              Senior
            </label>
          </div>
          <div class="govuk-radios__item">
            <input
              id="leadership"
              v-model="type"
              class="govuk-radios__input"
              name="leadership"
              type="radio"
              value="leadership"
              disabled=""
            >
            <label
              class="govuk-label govuk-radios__label"
              for="leadership"
              disabled=""
            >
              Leadership
            </label>
          </div>
        </div>
      </fieldset>

      <button
        ref="submitSaveType"
        class="govuk-button"
        @click="saveType"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data: function () {
    return {
      type: '',
    };
  },
  methods: {
    ...mapActions('createExercise', [
      'setExerciseType',
    ]),
    saveType () {
      this.$store.dispatch('createExercise/setExerciseType', this.type);
      this.$router.push({ name: 'viewExercise' });
    },
  },
};
</script>
