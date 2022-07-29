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
import { isProcessing, getTaskTypes } from '@/helpers/exerciseHelper';
import { lookup } from '@/filters';

export default {
  components: {
    SideNavigation,
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    stage() {
      return this.$route.params.stage;
    },
    sideNavigation() {
      const exercise = this.exercise;
      const stage = this.stage;
      const path = `/exercise/${exercise.id}/tasks/${this.stage}`;
      const sideNavigation = [];
      switch (stage) {
      case 'shortlisting':
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
        getTaskTypes(exercise, stage).forEach(taskType => {
          sideNavigation.push(
            {
              title: lookup(taskType),
              tag: {
                title: 'New',
                class: 'govuk-tag--blue',
              },
              path: `${path}/${taskType}`,
            }
          );
        });
        break;
      case 'selection':
        getTaskTypes(exercise, stage).forEach(taskType => {
          sideNavigation.push(
            {
              title: lookup(taskType),
              tag: {
                title: 'New',
                class: 'govuk-tag--blue',
              },
              path: `${path}/${taskType}`,
            }
          );
        });
        break;
      }
      return sideNavigation;
    },
  },
  watch: {
    '$route.name': {
      handler: function(name) {
        if (!name) this.gotoTask();
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    const exerciseId = this.$route.params.id;
    await this.$store.dispatch('tasks/bind', { exerciseId: exerciseId } );
  },
  methods: {
    gotoTask() {
      if (!this.$route.name) {
        switch (this.stage) {
        case 'shortlisting':
          this.$router.replace({ path: 'shortlisting/independent-assessments' });
          break;
        case 'selection':
          this.$router.replace({ path: 'selection/selection' }).catch(() => {});
          break;
        }
      }
    },
  },
};
</script>
