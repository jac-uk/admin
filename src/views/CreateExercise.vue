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
  computed: mapGetters([
    'exerciseData',
  ]),
  methods: {
    saveExercise () {
      saveNewExercise(this.exerciseData);
    },
  },
};
</script>
