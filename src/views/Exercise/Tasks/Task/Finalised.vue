<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l">
          {{ type | lookup }}
        </h1>
      </div>
      <div class="govuk-grid-column-one-half text-right">
        <ActionButton
          class="govuk-!-margin-bottom-1 govuk-!-margin-right-2"
          @click="btnExport"
        >
          Export
        </ActionButton>
        <button
          class="govuk-button govuk-!-margin-right-2"
          :class="{ 'govuk-button--secondary': task.passMark }"
          type="button"
          @click="$refs['setPassMarkModal'].openModal()"
        >
          <span v-if="hasPassMark">Pass mark {{ task.passMark | formatNumber(2) }}</span>
          <span v-else>Set pass mark</span>
        </button>
        <ActionButton
          v-if="hasPassMark"
          class="govuk-!-margin-bottom-1 govuk-!-margin-right-2"
          type="primary"
          @click="btnComplete"
        >
          Complete
        </ActionButton>
        <FullScreenButton />
      </div>
    </div>

    <p
      v-if="!hasPassMark"
      class="govuk-body-l govuk-!-margin-bottom-4"
    >
      Please set a pass mark.
    </p>
    <p
      v-else
      class="govuk-body-l govuk-!-margin-bottom-4"
    >
      {{ type | lookup }} can now be completed. {{ totalPassed }} <span v-if="totalPassed === 1">application</span><span v-else>applications</span> will be updated as passed and {{ totalFailed }}  <span v-if="totalFailed === 1">application</span><span v-else>applications</span> will be updated as failed.
    </p>

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
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
import { DIVERSITY_CHARACTERISTICS, hasDiversityCharacteristic } from '@/helpers/diversityCharacteristics';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { functions } from '@/firebase';
import FullScreenButton from '@/components/Page/FullScreenButton';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import TitleBar from '@/components/Page/TitleBar';
import SetPassMark from './Finalised/SetPassMark';
import _find from 'lodash/find';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
export default {
  components: {
    ActionButton,
    FullScreenButton,
    Modal,
    TitleBar,
    SetPassMark,
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
    meritList() {
      if (!this.task.applications) return [];
      if (!this.task.finalScores) return [];
      const applicationData = {};
      this.task.applications.forEach(application => applicationData[application.id] = application);
      return this.task.finalScores.map(scoreData => {
        return {
          ...applicationData[scoreData.id],
          ...scoreData,
        };
      });
    },
    xlsxData() {
      const rows = [];
      const headers = [];
      headers.push('Ref');
      headers.push('Full name');
      headers.push('SJT %');
      headers.push('SJT Z');
      headers.push('CAT %');
      headers.push('CAT Z');
      headers.push('Average %');
      headers.push('Average Z');
      headers.push('Female');
      headers.push('Ethnic minority');
      headers.push('Solicitor');
      headers.push('Disabled');
      rows.push(headers);
      this.meritList.forEach(item => {
        const row = [];
        row.push(item.ref);
        row.push(item.fullName);
        row.push(item.scoreSheet.qualifyingTest.SJ.percent);
        row.push(item.scoreSheet.qualifyingTest.SJ.zScore);
        row.push(item.scoreSheet.qualifyingTest.CA.percent);
        row.push(item.scoreSheet.qualifyingTest.CA.zScore);
        row.push(item.percent);
        row.push(item.zScore);
        const ref = item.ref.split('-')[1];
        if (this.exerciseDiversity[ref]) {
          row.push(this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE));
          row.push(this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME));
          row.push(this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR));
          row.push(this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED));
        } else {
          row.push();
          row.push();
          row.push();
          row.push();
        }
        rows.push(row);
      });
      return rows;
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
      await functions.httpsCallable('updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.$store.dispatch('ui/exitFullScreen');
      this.btnNext();
    },
    async btnExport() {
      await downloadXLSX(
        this.xlsxData,
        {
          title: 'QT Merit List',
          sheetName: 'QT merit list',
          fileName: 'qt-merit-list.xlsx',
        }
      );
      return true;
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
