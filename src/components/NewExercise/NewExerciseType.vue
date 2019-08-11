<template>
  <div class="govuk-form-group">
    <fieldset class="govuk-fieldset">
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
        <h2 class="govuk-fieldset__heading">
          Type of exercise
        </h2>
      </legend>
      <div class="govuk-radios govuk-radios">
        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="legal-yes" name="legal" type="radio" value="true">
          <label class="govuk-label govuk-radios__label" for="legal-yes">
            Legal
          </label>
        </div>
        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="legal-no" name="legal" type="radio" value="false">
          <label class="govuk-label govuk-radios__label" for="legal-no">
            Non legal
          </label>
        </div>
      </div>
    </fieldset>
    <button class="govuk-button" @click="saveType">Continue</button>
  </div>

  
</template>

<script>
import { mapActions } from 'vuex';
import store from '@/store';

export default {
  data: function () {
    return {
      name: ""
    }
  },
  computed: {
    ...mapActions('createExercise', [
      'setExerciseType'
    ])
  },
  methods: {
    saveType() {
      // store.dispatch('setExerciseType', this.type)
    },
  }
};
</script>
