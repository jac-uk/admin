<template>
  <div>
    <NewExerciseName
      ref="newExerciseNameComponent"
      @submitted="saveExercise"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import saveNewExercise from '@/helpers/saveNewExercise';

import NewExerciseName from '@/components/NewExercise/NewExerciseName';

export default {
  components: {
    NewExerciseName,
  },
  computed: mapGetters('createExercise', [
    'exerciseData',
  ]),
  methods: {
    async saveExercise () {
      await saveNewExercise(this.exerciseData);
      this.$router.push('dashboard');
    },
  },
};
</script>
