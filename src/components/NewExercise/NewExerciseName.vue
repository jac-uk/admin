<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <div class="govuk-form-group">
        <label
          class="govuk-heading-xl"
          for="exercise-name"
        >
          Exercise name
        </label>
        
        <input
          id="exercise-name"
          v-model="name"
          class="govuk-input"
          name="exercise-name"
          type="text"
        >
      </div>

      <button
        ref="submitSaveName"
        class="govuk-button"
        @click="saveName"
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
      name: '',
    };
  },
  computed: {
    ...mapActions('createExercise', [
      'setExerciseTitle',
    ]),
  },
  methods: {
    saveName () {
      this.$store.dispatch('createExercise/setExerciseTitle', this.name);
      this.$emit('submitted');
    },
  },
};
</script>
