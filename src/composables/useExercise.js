import { computed } from 'vue';
import { useStore } from 'vuex';

export const useExercise = () => {
  const store = useStore();

  const exercise = computed(() => {
    return store.state.exerciseDocument.record;
  });

  const getExerciseProgress = () => {
    return computed(() => {
      const exerciseValue = exercise.value;
      if (exerciseValue && exerciseValue.progress) {
        return exerciseValue.progress;
      } else {
        return {};
      }
    });
  };

  return {
    exercise,
    getExerciseProgress,
  };
};
