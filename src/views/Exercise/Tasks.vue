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
import { isProcessing, TASK_TYPE } from '@/helpers/exerciseHelper';

export default {
  components: {
    SideNavigation,
  },
  data() {
    const exercise = this.$store.state.exerciseDocument.record;
    const path = `/exercise/${exercise.id}/tasks`;
    const sideNavigation = [];
    // sideNavigation.push({
    //   title: 'Qualifying Tests',
    //   path: `${path}/qualifying-tests`,
    //   params: {
    //     nav: '/tasks/qualifying-tests', // TODO check this is needed
    //   },
    // });
    // if (exercise.equalMeritSecondStageStartDate) {
    //   sideNavigation.push({
    //     title: 'Equal Merit Tie-breakers',
    //     path: `${path}/equal-merit-tie-breakers`,
    //   });
    // }
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
    if (exercise.shortlistingMethods && exercise.shortlistingMethods.length) {
      if (exercise.shortlistingMethods.indexOf('critical-analysis-qualifying-test') >= 0 && exercise.criticalAnalysisTestDate) {
        sideNavigation.push(
          {
            title: 'Critical Analysis Test',
            tag: {
              title: 'New',
              class: 'govuk-tag--blue',
            },
            path: `${path}/qt/${TASK_TYPE.CRITICAL_ANALYSIS}`,
          }
        );
      }
      if (exercise.shortlistingMethods.indexOf('situational-judgement-qualifying-test') >= 0 && exercise.criticalAnalysisTestDate) {
        sideNavigation.push(
          {
            title: 'Situational Judgement Test',
            tag: {
              title: 'New',
              class: 'govuk-tag--blue',
            },
            path: `${path}/qt/${TASK_TYPE.SITUATIONAL_JUDGEMENT}`,
          }
        );
      }
      if (exercise.shortlistingMethods.indexOf('scenario-test-qualifying-test') >= 0 && exercise.criticalAnalysisTestDate) {
        sideNavigation.push(
          {
            title: 'Scenario Test',
            tag: {
              title: 'New',
              class: 'govuk-tag--blue',
            },
            path: `${path}/qt/${TASK_TYPE.SCENARIO}`,
          }
        );
      }
      if (
        (exercise.shortlistingMethods.indexOf('paper-sift') >= 0 && exercise.siftStartDate)
        || (exercise.shortlistingMethods.indexOf('name-blind-paper-sift') >= 0 && exercise.nameBlindSiftStartDate)
      ) {
        sideNavigation.push(
          {
            title: 'Sift',
            tag: {
              title: 'New',
              class: 'govuk-tag--blue',
            },
            path: `${path}/sift`,
          },
        );
      }
    }
    if (exercise.selectionDays) {
      sideNavigation.push(
        {
          title: 'Selection',
          tag: {
            title: 'New',
            class: 'govuk-tag--blue',
          },
          path: `${path}/selection`,
        },
      );
    }
    // if (exercise.scenarioTestDate) {
    //   sideNavigation.push(
    //     {
    //       title: 'Scenario',
    //       tag: {
    //         title: 'Alpha',
    //         class: 'govuk-tag--blue',
    //       },
    //       path: `${path}/scenario`,
    //     }
    //   );
    // }

    return {
      sideNavigation: sideNavigation,
    };
  },
  async created() {
    const exerciseId = this.$route.params.id;
    await this.$store.dispatch('tasks/bind', { exerciseId: exerciseId } );
  },

};
</script>
