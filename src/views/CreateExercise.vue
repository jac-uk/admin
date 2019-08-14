<template>
  <div>
    <NewExerciseName
      v-if="!exerciseTitle"
      ref="newExerciseNameComponent"
    />
    <NewExerciseType
      v-else
      ref="newExerciseTypeComponent"
      @submitted="saveExercise"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import saveNewExercise from '@/helpers/saveNewExercise';

import NewExerciseName from '@/components/NewExercise/NewExerciseName';
import NewExerciseType from '@/components/NewExercise/NewExerciseType';

export default {
  components: {
    NewExerciseName,
    NewExerciseType,
  },
  computed: {
    ...mapGetters('createExercise', [
      'exerciseData', 'exerciseTitle',
    ]),
    ...mapActions('createExercise', [
      'resetNewExercise']),
  },
  methods: {
    async saveExercise () {
      await saveNewExercise(this.exerciseData);
      this.$router.push('dashboard');
      this.$store.dispatch('createExercise/resetNewExercise');
    },
  },
};
</script>
