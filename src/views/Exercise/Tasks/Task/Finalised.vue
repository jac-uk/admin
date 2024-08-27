<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="govuk-grid-column-one-half text-right">
        <button
          v-if="isQualifyingTest"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-2"
          @click="btnExport"
        >
          Export
        </button>
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
      <span v-if="hasPassMark">Pass mark {{ $filters.formatNumber(task.passMark, 2) }}</span>
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
      :type="type"
      :scores="scores"
      :score-type="scoreType"
    />

    <Modal ref="setPassMarkModal">
      <TitleBar>
        Set pass mark
      </TitleBar>
      <SetPassMark
        class="govuk-!-margin-6"
        :scores="scores"
        :data="{ passMark: task.passMark }"
        @save="setPassMark"
        @cancel="$refs['setPassMarkModal'].closeModal()"
      />
    </Modal>
    <Modal ref="exportModal">
      <TitleBar>
        Export {{ $filters.lookup(type) }}
      </TitleBar>
      <ConfigureExport
        class="govuk-!-margin-6"
        :types="downloadTypes"
        @save="downloadMeritList"
        @cancel="$refs['exportModal'].closeModal()"
      />
    </Modal>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { beforeRouteEnter, btnNext } from './helper';
import { DIVERSITY_CHARACTERISTICS, hasDiversityCharacteristic } from '@/helpers/diversityCharacteristics';
import { TASK_TYPE, getTaskSteps } from '@jac-uk/jac-kit/helpers/exerciseHelper';
import { downloadMeritList, getDownloadTypes } from '@jac-uk/jac-kit/helpers/taskHelper.js';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import { functions } from '@/firebase';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import TitleBar from '@/components/Page/TitleBar.vue';
import SetPassMark from './Finalised/SetPassMark.vue';
import ConfigureExport from './Finalised/ConfigureExport.vue';
import _find from 'lodash/find';

export default {
  components: {
    ActionButton,
    FullScreenButton,
    Modal,
    TitleBar,
    SetPassMark,
    ConfigureExport,
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
      if (!this.task) return 'score';
      if (this.task.scoreType) return this.task.scoreType;
      if (this.task.finalScores[0].hasOwnProperty('percent')) return 'percent';
      return 'score';
    },
    exerciseDiversity() {
      return this.$store.state.exerciseDiversity.record ? this.$store.state.exerciseDiversity.record.applicationsMap : {};
    },
    hasPassMark() {
      return this.task.hasOwnProperty('passMark');
    },
    isQualifyingTest() {
      return this.type === TASK_TYPE.QUALIFYING_TEST;
    },
    downloadTypes() {
      return getDownloadTypes(this.task);
    },
    scores() {
      if (!this.task) return [];
      if (!this.exerciseDiversity) return [];
      if (!this.task.finalScores) return [];

      // group scores
      const scoreMap = {};
      this.task.finalScores.forEach(scoreData => { // id | panelId | ref | score | scoreSheet
        if (!scoreMap[scoreData[this.scoreType]]) {
          scoreMap[scoreData[this.scoreType]] = {
            applicationIds: [],
            count: 0,
            rank: 0,
            diversity: {
              female: 0,
              bame: 0,
              solicitor: 0,
              disability: 0,
            },
            cumulativeDiversity: {
              female: 0,
              bame: 0,
              solicitor: 0,
              disability: 0,
            },
            outcome: {
              pass: 0,
              fail: 0,
            },
          };
        }
        scoreMap[scoreData[this.scoreType]].applicationIds.push(scoreData.id);
        scoreMap[scoreData[this.scoreType]].count += 1;
        const ref = scoreData.ref.split('-')[1];
        if (this.exerciseDiversity[ref]) {
          if (this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE)) scoreMap[scoreData[this.scoreType]].diversity.female += 1;
          if (this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME)) scoreMap[scoreData[this.scoreType]].diversity.bame += 1;
          if (this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR)) scoreMap[scoreData[this.scoreType]].diversity.solicitor += 1;
          if (this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED)) scoreMap[scoreData[this.scoreType]].diversity.disability += 1;
        }
      });

      // add rank and cumulative diversity
      const scoresInDescendingOrder = Object.keys(scoreMap).sort((a, b) => b - a);
      let prevScore;
      scoresInDescendingOrder.forEach(score => {
        if (prevScore) {
          scoreMap[score].rank = scoreMap[prevScore].rank + scoreMap[prevScore].count;
          scoreMap[score].cumulativeDiversity.female = scoreMap[prevScore].cumulativeDiversity.female;
          scoreMap[score].cumulativeDiversity.bame = scoreMap[prevScore].cumulativeDiversity.bame;
          scoreMap[score].cumulativeDiversity.solicitor = scoreMap[prevScore].cumulativeDiversity.solicitor;
          scoreMap[score].cumulativeDiversity.disability = scoreMap[prevScore].cumulativeDiversity.disability;
        } else {
          scoreMap[score].rank = 1;
        }
        scoreMap[score].cumulativeDiversity.female += scoreMap[score].diversity.female;
        scoreMap[score].cumulativeDiversity.bame += scoreMap[score].diversity.bame;
        scoreMap[score].cumulativeDiversity.solicitor += scoreMap[score].diversity.solicitor;
        scoreMap[score].cumulativeDiversity.disability += scoreMap[score].diversity.disability;
        prevScore = score;
      });

      // add outcome stats
      if (this.task.hasOwnProperty('passMark')) {
        scoresInDescendingOrder.forEach(key => {
          const score = parseFloat(key);
          if (score >= this.task.passMark) {
            if (this.task.overrides && this.task.overrides.fail) {
              const failMatches = this.task.overrides.fail.filter(id => scoreMap[score].applicationIds.indexOf(id) >= 0);
              scoreMap[score].outcome.fail = failMatches.length;
              scoreMap[score].outcome.pass = scoreMap[score].count - failMatches.length;
            } else {
              scoreMap[score].outcome.pass = scoreMap[score].count;
            }
          } else {
            if (this.task.overrides && this.task.overrides.pass) {
              const passMatches = this.task.overrides.pass.filter(id => scoreMap[score].applicationIds.indexOf(id) >= 0);
              scoreMap[score].outcome.pass = passMatches.length;
              scoreMap[score].outcome.fail = scoreMap[score].count - passMatches.length;
            } else {
              scoreMap[score].outcome.fail = scoreMap[score].count;
            }
          }
        });
      }

      // return
      return scoresInDescendingOrder.map(score => {
        return {
          score: parseFloat(score),
          ...scoreMap[score],
        };
      });
    },
    totalPassed() {
      if (!this.scores.length) return 0;
      if (!this.task) return 0;
      if (!this.task.passMark) return 0;
      const scoreData = this.scores.find(scoreData => scoreData.score === this.task.passMark);
      let total = scoreData.rank + scoreData.count - 1;
      if (this.task.overrides) {
        if (this.task.overrides.fail && this.task.overrides.fail.length) {
          total = total - this.task.overrides.fail.length;
        } else if (this.task.overrides.pass && this.task.overrides.pass.length) {
          total = total + this.task.overrides.pass.length;
        }
      }
      return total;
    },
    totalFailed() {
      if (!this.task) return 0;
      if (!this.task.passMark) return 0;
      return this.task.finalScores.length - this.totalPassed;
    },
  },
  async created() {
    await this.$store.dispatch('exerciseDiversity/bind', this.exercise.id);
  },
  methods: {
    hasDiversityCharacteristic,
    btnNext,
    async btnComplete() {
      await httpsCallable(functions, 'updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
      return true;
    },
    btnExport() {
      this.$refs['exportModal'].openModal();
    },
    downloadMeritList(saveData) {
      const fileName = `${this.exercise.referenceNumber}-qt-merit-list`;
      // get CAT & SJT applications
      const CAT = this.$store.getters['tasks/getTask'](TASK_TYPE.CRITICAL_ANALYSIS);
      const SJT = this.$store.getters['tasks/getTask'](TASK_TYPE.SITUATIONAL_JUDGEMENT);
      const didNotTakeCAT = CAT.applications.filter(item => !CAT.finalScores.find(scoreData => scoreData.id === item.id));
      const didNotTakeSJT = SJT.applications.filter(item => !SJT.finalScores.find(scoreData => scoreData.id === item.id));
      const didNotTake = didNotTakeCAT.filter(item => didNotTakeSJT.find(app => app.id === item.id));
      const failedCATIDs = CAT.finalScores.filter(scoreData => scoreData.pass === false).map(item => item.id);
      const failedSJTIDs = SJT.finalScores.filter(scoreData => scoreData.pass === false).map(item => item.id);
      const failedIDs = failedCATIDs.concat(failedSJTIDs).filter((value, index, array) => array.indexOf(value) === index);
      const failed = CAT.applications.filter(item => failedIDs.indexOf(item.id) >= 0);
      downloadMeritList(didNotTake, failed, this.task, this.exerciseDiversity, saveData.type, fileName);
      this.$refs['exportModal'].closeModal();
    },
    async setPassMark(data) {
      if (data) {
        await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: { passMark: parseFloat(data.passMark), scoreType: this.scoreType } } );
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
