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
import { isProcessing } from '@/helpers/exerciseHelper';

export default {
  components: {
    SideNavigation,
  },
  data() {
    const exercise = this.$store.state.exerciseDocument.record;
    const path = `/exercise/${exercise.id}/tasks`;
    const sideNavigation = [];
    sideNavigation.push({
      title: 'Qualifying Tests',
      path: `${path}/qualifying-tests`,
      params: {
        nav: '/tasks/qualifying-tests', // TODO check this is needed
      },
    });
    if (exercise.equalMeritSecondStageStartDate) {
      sideNavigation.push({
        title: 'Equal Merit Tie-breakers',
        path: `${path}/equal-merit-tie-breakers`,
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
    if (exercise.shortlistingMethods && exercise.shortlistingMethods.length) {
      if (
        (exercise.shortlistingMethods.indexOf('sift') >= 0 && exercise.siftStartDate)
        || (exercise.shortlistingMethods.indexOf('name-blind-paper-sift') >= 0 && exercise.nameBlindSiftStartDate)
      ) {
        sideNavigation.push(
          {
            title: 'Sift',
            path: `${path}/sift`,
          }
        );
      }
    }
    if (exercise.selectionDays) {
      sideNavigation.push(
        {
          title: 'Selection day',
          path: `${path}/selection`,
        }
      );
    }
    if (exercise.scenarioTestDate) {
      sideNavigation.push(
        {
          title: 'Scenario Responses',
          path: `${path}/scenario`,
        }
      );
    }
    return {
      sideNavigation: sideNavigation,
    };
  },
};
</script>
