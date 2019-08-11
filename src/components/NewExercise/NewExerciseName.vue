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

        {{ name }}

        <input
          id="exercise-name"
          v-model="name"
          class="govuk-input"
          name="exercise-name"
          type="text"
        >
      </div>

      <button class="govuk-button" @click="saveName">
        Continue
      </button>
    </div>
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
      'setExerciseName'
    ])
  },
  methods: {
    saveName() {
      store.dispatch('setExerciseName', this.name)
    },
  }
};
</script>
