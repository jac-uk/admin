<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="govuk-grid-column-one-half text-right">
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <p
      v-if="!hasPassMark"
      class="govuk-body govuk-!-margin-bottom-4"
    >
      Please set a pass mark.
    </p>
    <p
      v-else
      class="govuk-body govuk-!-margin-bottom-4"
    >
      {{ $filters.lookup(type) }} can now be completed. {{ totalPassed }} <span v-if="totalPassed === 1">application</span><span v-else>applications</span> will be updated as passed and {{ totalFailed }}  <span v-if="totalFailed === 1">application</span><span v-else>applications</span> will be updated as failed.
    </p>

    <button
      class="govuk-button govuk-!-margin-right-2"
      :class="{ 'govuk-button--secondary': task.passMark }"
      type="button"
      @click="$refs['setPassMarkModal'].openModal()"
    >
      <span v-if="hasPassMark">Pass mark {{ scoreType == 'gradeScore' ? task.passMark : $filters.formatNumber(task.passMark, 2) }}</span>
      <span v-else>Set pass mark</span>
    </button>
    <ActionButton
      v-if="hasPassMark"
      class="govuk-!-margin-bottom-1 govuk-!-margin-right-2"
      type="primary"
      :action="btnComplete"
    >
      Complete
    </ActionButton>

    <RouterView
      :exercise-id="exercise.id"
      :task="task"
      :scores="scores"
      :score-data="scoreData"
      :score-type="scoreType"
      :editable="true"
    />

    <Modal ref="setPassMarkModal">
      <TitleBar>
        Set pass mark
      </TitleBar>
      <SetPassMark
        class="govuk-!-margin-6"
        :scores="scores"
        :score-type="scoreType"
        :data="{ passMark: task.passMark }"
        @save="setPassMark"
        @cancel="$refs['setPassMarkModal'].closeModal()"
      />
    </Modal>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { beforeRouteEnter, btnNext } from './helper';
import { scoreType, scores, scoreData, totalPassed, totalFailed } from './Finalised/meritListHelper';
import { getTaskSteps } from '@/helpers/exerciseHelper';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import { functions } from '@/firebase';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import TitleBar from '@/components/Page/TitleBar.vue';
import SetPassMark from './Finalised/SetPassMark.vue';
import _find from 'lodash/find';

export default {
  components: {
    ActionButton,
    FullScreenButton,
    Modal,
    TitleBar,
    SetPassMark,
    ProgressBar,
  },
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
    exerciseDiversity() {
      return this.$store.state.exerciseDiversity.record ? this.$store.state.exerciseDiversity.record.applicationsMap : {};
    },
    hasPassMark() {
      return this.task.hasOwnProperty('passMark');
    },
    scores() {
      return scores(this.task, this.scoreType, this.exerciseDiversity);
    },
    scoreData() {
      return scoreData(this.task, this.scoreType, this.exerciseDiversity);
    },
    totalPassed() {
      return totalPassed(this.task, this.scoreType, this.scores);
    },
    totalFailed() {
      return totalFailed(this.task, this.scoreType, this.scores);
    },
  },
  async created() {
    await this.$store.dispatch('exerciseDiversity/bind', this.exercise.id);
  },
  methods: {
    btnNext,
    async btnComplete() {
      await httpsCallable(functions, 'updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
      return true;
    },
    async setPassMark(data) {
      if (data) {
        const passMark = this.scoreType === 'gradeScore' ? data.passMark : parseFloat(data.passMark);
        await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: { passMark: passMark, scoreType: this.scoreType } } );
        this.$refs['setPassMarkModal'].closeModal();
      }
    },
    getFullName(id) {
      let fullName = '';
      if (this.task) {
        const match = _find(this.task.applications, app => {
          return app.id === id;
        });
        if (match) fullName = match.fullName;
      }
      return fullName;
    },
  },
};
</script>
