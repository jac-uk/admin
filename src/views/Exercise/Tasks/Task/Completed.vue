<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="text-right govuk-grid-column-one-half">
        <ActionButton
          v-if="showEmailButton && hasPermissions([
            PERMISSIONS.applications.permissions.canReadApplications.value,
            PERMISSIONS.exercises.permissions.canReadExercises.value,
          ])"
          type="primary"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3 govuk-!-margin-bottom-0"
          :action="notifyCandidates"
        >
          Send report notification
        </ActionButton>
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <MeritList
      v-if="hasMeritList"
      :exercise-id="exercise.id"
      :task="task"
      :scores="scores"
      :score-data="scoreData"
      :score-type="scoreType"
      :show-diversity="false"
    />

    <div v-else class="panel govuk-!-margin-bottom-6 govuk-!-padding-bottom-2">
      <span class="govuk-caption-m">
        Applications
      </span>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-third">
          <span class="govuk-body-s govuk-!-margin-bottom-0">
            Total
          </span>
          <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
            {{ task._stats.totalApplications }}
          </h2>
        </div>
        <div class="govuk-grid-column-one-third">
          <span class="govuk-body-s govuk-!-margin-bottom-0">
            Completed
          </span>
          <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
            {{ task._stats.completed }}
          </h2>
        </div>
        <div class="govuk-grid-column-one-third">
          <span class="govuk-body-s govuk-!-margin-bottom-0">
            Not completed
          </span>
          <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
            {{ task._stats.notCompleted }}
          </h2>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { beforeRouteEnter } from './helper';
import { getTaskSteps } from '@/helpers/exerciseHelper';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';
import { TASK_TYPE } from '@/helpers/constants';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import permissionMixin from '@/permissionMixin';
import { scoreType, scores, scoreData } from './Finalised/meritListHelper';
import MeritList from './Finalised/List.vue';

export default {
  components: {
    FullScreenButton,
    ProgressBar,
    ActionButton,
    MeritList,
  },
  mixins: [permissionMixin],
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseId() {
      return this.exercise ? this.exercise.id : null;
    },
    exerciseDiversity() {
      return this.$store.state.exerciseDiversity.record ? this.$store.state.exerciseDiversity.record.applicationsMap : {};
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
    scoreType() {
      return scoreType(this.task);
    },
    scores() {
      return scores(this.task, this.scoreType, this.exerciseDiversity);
    },
    scoreData() {
      return scoreData(this.task, this.scoreType, this.exerciseDiversity);
    },
    showEmailButton() {
      return [
        TASK_TYPE.CRITICAL_ANALYSIS,
        TASK_TYPE.QUALIFYING_TEST,
        TASK_TYPE.SCENARIO,
        TASK_TYPE.SITUATIONAL_JUDGEMENT,
      ].includes(this.type);
    },
    hasMeritList() {
      return this.task?.finalScores;
    },
  },
  async created() {
    await this.$store.dispatch('exerciseDiversity/bind', this.exercise.id);
  },
  methods: {
    notifyCandidates() {
      // Dont do this async as we just want to fire and forget
      httpsCallable(functions, 'sendPublishedFeedbackReportNotifications')({ exerciseId: this.exerciseId, type: this.type });
      return true;
    },
  },
};
</script>
