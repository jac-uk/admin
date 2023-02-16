<template>
  <div>
    <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
      Tasks
    </h1>
    <p class="govuk-body">
      Please choose a task from the menu on the left
    </p>
  </div>
</template>

<script>
import store from '@/store.js';
export default {
  beforeRouteEnter(to, from, next) {
    console.log('before route enter', store.state.exerciseDocument.record);
    const exercise = store.state.exerciseDocument.record;
    if (exercise && exercise._useQTPlatform) {
      next();
    } else {
      next({
        name: 'exercise-tasks-qualifying-tests',
        params: to.params,
      });
    }
  },
};
</script>
