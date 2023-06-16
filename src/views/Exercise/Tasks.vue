<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-one-quarter print-none">
      <SideNavigation
        :pages="sideNavigation"
      />
    </div>
    <div class="govuk-grid-column-three-quarters print-full-width">
      <RouterView />
    </div>
  </div>
</template>

<script>
import SideNavigation from '@/components/Navigation/SideNavigation';
import { isProcessing, getTaskTypes, TASK_STATUS } from '@/helpers/exerciseHelper';
import { lookup } from '@/filters';

export default {
  name: 'Tasks',
  components: {
    SideNavigation,
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    sideNavigation() {
      const exercise = this.exercise;
      const path = `/exercise/${exercise.id}/tasks`;
      const sideNavigation = [];
      if (exercise._useQTPlatform === false) {  // temporary flag to enable usage of the new QT platform (recently updated so that default is to use new platform until it is specifically turned off)
        sideNavigation.push({
          title: 'Qualifying Tests',
          path: `${path}/qualifying-tests`,
          params: {
            nav: '/tasks/qualifying-tests', // TODO check this is needed
          },
        });
      } else {
        getTaskTypes(exercise).forEach(taskType => {
          const task = this.$store.getters['tasks/getTask'](taskType);
          let tag;
          if (task && task.status === TASK_STATUS.COMPLETED) {
            tag = {
              title: 'Done',
              class: 'govuk-tag--blue',
            };
          }
          sideNavigation.push(
            {
              title: lookup(taskType),
              tag: tag,
              path: `${path}/${taskType}`,
            }
          );
        });
      }
      if (isProcessing(exercise)) {
        if (!(exercise.assessmentMethods && exercise.assessmentMethods.independentAssessments === false)) {
          sideNavigation.push({
            title: 'Independent Assessments',
            path: `${path}/independent-assessments`,
          });
        }
        sideNavigation.push(
          {
            title: 'Character Checks',
            path: `${path}/character-checks`,
          }
        );
      }
      return sideNavigation;
    },
  },
  async created() {
    const exerciseId = this.$route.params.id;
    await this.$store.dispatch('tasks/bind', { exerciseId: exerciseId } );
  },
};
</script>
