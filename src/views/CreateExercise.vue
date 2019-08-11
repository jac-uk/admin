<template>
  <div>
    <NewExerciseName />
    <NewExerciseType />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import NewExerciseName from '@/components/NewExercise/NewExerciseName';
import NewExerciseType from '@/components/NewExercise/NewExerciseType';

export default {
  components: {
    NewExerciseName,
    NewExerciseType
  },
  data: function () {
    return {
      name: '',
    };
  },
};
</script>
