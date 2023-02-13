<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l">
          {{ type | lookup }}
        </h1>
      </div>
      <div class="govuk-grid-column-one-half text-right">
        <button
          class="govuk-button govuk-!-margin-right-2"
          :class="{ 'govuk-button--secondary': task.passMark }"
          type="button"
          @click="$refs['setPassMarkModal'].openModal()"
        >
          <span v-if="task.passMark >= 0">Pass mark {{ task.passMark | formatNumber(2) }}</span>
          <span v-else>Set pass mark</span>
        </button>
        <ActionButton
          v-if="task.passMark >= 0"
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
      v-if="!task.passMark"
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
    exerciseDiversity() {
      return this.$store.state.exerciseDiversity.record ? this.$store.state.exerciseDiversity.record.applicationsMap : {};
    },
    scores() {
      if (!this.task) return [];
      if (!this.exerciseDiversity) return [];
      if (!this.task.finalScores) return [];

      // group scores
      const scoreMap = {};
      this.task.finalScores.forEach(scoreData => { // id | panelId | ref | score | scoreSheet
        if (!scoreMap[scoreData.score]) {
          scoreMap[scoreData.score] = {
            fullName: this.getFullName(scoreData.id),
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
        scoreMap[scoreData.score].count += 1;
        const ref = scoreData.ref.split('-')[1];
        if (this.exerciseDiversity[ref]) {
          if (this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE)) scoreMap[scoreData.score].diversity.female += 1;
          if (this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME)) scoreMap[scoreData.score].diversity.bame += 1;
          if (this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR)) scoreMap[scoreData.score].diversity.solicitor += 1;
          if (this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED)) scoreMap[scoreData.score].diversity.disability += 1;
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
      if (this.task.passMark) {
        scoresInDescendingOrder.forEach(key => {
          const score = parseFloat(key);
          if (score > this.task.passMark) { scoreMap[score].outcome.pass = scoreMap[score].count; }
          if (score === this.task.passMark) {
            if (this.task.overrides && this.task.overrides.fail) {
              scoreMap[score].outcome.pass = scoreMap[score].count - this.task.overrides.fail.length; // TODO should we check contents of fail (or pass) are all at this score?
              scoreMap[score].outcome.fail = this.task.overrides.fail.length;
            } else {
              scoreMap[score].outcome.pass = scoreMap[score].count;
            }
          }
          if (score === this.task.passMark - 1) {
            if (this.task.overrides && this.task.overrides.pass) {
              scoreMap[score].outcome.pass = this.task.overrides.pass.length;
              scoreMap[score].outcome.fail = scoreMap[score].count - this.task.overrides.pass.length;
            } else {
              scoreMap[score].outcome.fail = scoreMap[score].count;
            }
          }
          if (score < this.task.passMark - 1) { scoreMap[score].outcome.fail = scoreMap[score].count; }
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
    async setPassMark(data) {
      if (data) {
        await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: { passMark: parseFloat(data.passMark), overrides: {} } } );
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
