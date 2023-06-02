<template>
  <div>
    <RouterLink
      :to="{ name: 'exercise-task-finalised', params: { exerciseId: exercise.id, type: type } }"
      class="govuk-link"
    >
      All scores
    </RouterLink>

    <div
      class="govuk-grid-row"
    >
      <div
        class="govuk-grid-column-one-half"
      >
        <div
          class="background-light-grey govuk-!-padding-4"
        >
          <div class="govuk-grid-row">
            <div class="govuk-grid-column-one-third">
              <h2 class="govuk-heading-l">
                <span class="govuk-caption-m">{{ scoreType | lookup }}<br></span>
                {{ score | formatNumber(2) }}
              </h2>
            </div>
            <div class="govuk-grid-column-one-third text-center">
              <h2 class="govuk-heading-l">
                <span class="govuk-caption-m">Rank<br></span>
                {{ scoreReport.rank }}
              </h2>
            </div>
            <div class="govuk-grid-column-one-third text-right">
              <h2 class="govuk-heading-l">
                <span class="govuk-caption-m">Count<br></span>
                {{ scoreReport.count }}
              </h2>
            </div>
          </div>

          <div class="govuk-grid-row">
            <div class="govuk-grid-column-one-half">
              <span class="govuk-caption-m">Female<br></span>
              <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * scoreReport.diversity.female / scoreReport.count | formatNumber(2) }}%</span>
              <span class="govuk-caption-m">Ethnic Minority<br></span>
              <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * scoreReport.diversity.bame / scoreReport.count | formatNumber(2) }}%</span>
            </div>
            <div class="govuk-grid-column-one-half">
              <span class="govuk-caption-m">Solicitor<br></span>
              <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * scoreReport.diversity.solicitor / scoreReport.count | formatNumber(2) }}%</span>
              <span class="govuk-caption-m">Disability<br></span>
              <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * scoreReport.diversity.disability / scoreReport.count | formatNumber(2) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="higherScoreReport"
        class="govuk-grid-column-one-half"
      >
        <div
          class="background-light-grey govuk-!-padding-4"
        >
          <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">
              <h2 class="govuk-heading-l">
                <span class="govuk-caption-m">{{ scoreType | lookup }}<br></span>
                {{ higherScoreReport.score | formatNumber(2) }} <span v-if="currentIndex > 1">and above</span>
              </h2>
            </div>
            <div class="govuk-grid-column-one-third text-right">
              <h2 class="govuk-heading-l">
                <span class="govuk-caption-m">Count<br></span>
                {{ scoreReport.rank - 1 }}
              </h2>
            </div>
          </div>

          <div class="govuk-grid-row">
            <div class="govuk-grid-column-one-half">
              <span class="govuk-caption-m">Female<br></span>
              <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * higherScoreReport.cumulativeDiversity.female / (scoreReport.rank - 1) | formatNumber(2) }}%</span>
              <span class="govuk-caption-m">Ethnic Minority<br></span>
              <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * higherScoreReport.cumulativeDiversity.bame / (scoreReport.rank - 1) | formatNumber(2) }}%</span>
            </div>
            <div class="govuk-grid-column-one-half">
              <span class="govuk-caption-m">Solicitor<br></span>
              <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * higherScoreReport.cumulativeDiversity.solicitor / (scoreReport.rank - 1) | formatNumber(2) }}%</span>
              <span class="govuk-caption-m">Disability<br></span>
              <span class="govuk-heading-m govuk-!-margin-bottom-4">{{ 100 * higherScoreReport.cumulativeDiversity.disability / (scoreReport.rank - 1) | formatNumber(2) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-!-margin-bottom-3">
      <ul class="moj-pagination__list">
        <li
          class="moj-pagination__item  moj-pagination__item--prev"
        >
          <RouterLink
            v-if="lowerScoreReport"
            :to="{ name: 'exercise-task-finalised-score', params: { exerciseId: exercise.id, type: type, score: lowerScoreReport.score } }"
            class="moj-pagination__link govuk-link"
          >
            Lower score
          </RouterLink>
        </li>
        <li
          class="moj-pagination__item  moj-pagination__item--next"
        >
          <RouterLink
            v-if="higherScoreReport"
            :to="{ name: 'exercise-task-finalised-score', params: { exerciseId: exercise.id, type: type, score: higherScoreReport.score } }"
            class="moj-pagination__link govuk-link"
          >
            Higher score
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="moj-page-header-actions govuk-!-margin-bottom-0">
      <div class="moj-page-header-actions__actions">
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
              :disabled="!passMark || !selectedItems.length"
              @click="$refs['setPassOrFailModal'].openModal()"
            >
              Change outcome
            </button>
          </div>
        </div>
      </div>
    </div>

    <Table
      v-if="scoreData"
      data-key="id"
      :data="scoreData"
      :columns="tableColumns"
      multi-select
      :selection.sync="selectedItems"
      local-data
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ row.fullName }}
        </TableCell>

        <template v-if="showDetail && type == PANEL_TYPES.SIFT">
          <TableCell
            v-for="(cap, index) in capabilities"
            :key="`sift_${index}`"
            :title="cap"
            class="text-center table-cell-score"
          >
            {{ row.scoreSheet[cap] }}
          </TableCell>
        </template>

        <template v-if="showDetail && type == PANEL_TYPES.SELECTION">
          <template
            v-for="category in selectionCategories"
          >
            <TableCell
              v-for="(cap, index) in capabilities"
              :key="`${category}_${index}`"
              :title="`${category} ${cap}`"
              class="text-center table-cell-score"
            >
              <span v-if="row.scoreSheet[category]">
                {{ row.scoreSheet[category][cap] }}
              </span>
            </TableCell>
          </template>
        </template>
        <TableCell
          :title="tableColumns[tableColumns.length - 6].title"
          class="text-center table-cell-score"
        >
          <div
            class="show-hide-link"
            @click="toggleShowDetail"
          >
            {{ row.score | formatNumber(2) }}
          </div>
        </TableCell>
        <TableCell :title="tableColumns[tableColumns.length - 5].title">
          {{ row.diversity.female | toYesNo }}
        </TableCell>
        <TableCell :title="tableColumns[tableColumns.length - 4].title">
          {{ row.diversity.bame | toYesNo }}
        </TableCell>
        <TableCell :title="tableColumns[tableColumns.length - 3].title">
          {{ row.diversity.solicitor | toYesNo }}
        </TableCell>
        <TableCell :title="tableColumns[tableColumns.length - 2].title">
          {{ row.diversity.disability | toYesNo }}
        </TableCell>
        <TableCell :title="tableColumns[tableColumns.length - 1].title">
          <strong
            v-if="passMark && isPass(row)"
            class="govuk-tag govuk-tag--green"
          >PASS</strong>
          <strong
            v-else-if="passMark"
            class="govuk-tag govuk-tag--red"
          >FAIL</strong>
        </TableCell>
      </template>
    </Table>

    <Modal ref="setPassOrFailModal">
      <TitleBar>
        You have selected {{ selectedItems.length }} items
      </TitleBar>
      <SetPassOrFail
        class="govuk-!-margin-6"
        :items="selectedItems"
        @save="setPassOrFail"
        @cancel="$refs['setPassOrFailModal'].closeModal()"
      />
    </Modal>
  </div>
</template>

<script>
import firebase from '@firebase/app';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import SetPassOrFail from './SetPassOrFail';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import TitleBar from '@/components/Page/TitleBar';
import { PANEL_TYPES } from '../Panel/Constants';
import { CAPABILITIES, SELECTION_CATEGORIES } from '@/helpers/exerciseHelper';
import { DIVERSITY_CHARACTERISTICS, hasDiversityCharacteristic } from '@/helpers/diversityCharacteristics';
import _has from 'lodash/has';
import _find from 'lodash/find';

export default {
  components: {
    Table,
    TableCell,
    SetPassOrFail,
    Modal,
    TitleBar,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
    scores: {
      required: true,
      type: Array,
    },
    scoreType: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      PANEL_TYPES,
      showDetail: false,
      selectedItems: [],
    };
  },
  computed: {
    score() {
      return this.$route.params.score;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    passMark() {
      return this.task && this.task.passMark || null;
    },
    defaultOutcome() {
      if (this.score && this.passMark) {
        if (this.score < this.passMark) {
          return 'fail';
        } else {
          return 'pass';
        }
      }
      return null;
    },
    capabilities() {
      let capabilities = [];
      if (this.task && _has(this.task, 'capabilities')) {
        capabilities = CAPABILITIES.filter(cap => this.task.capabilities.indexOf(cap) >= 0);  // Using CAPABILITIES to ensure display order of selected capabilities
      }
      return capabilities;
    },
    selectionCategories() {
      let categories = [];
      if (this.task && _has(this.task, 'selectionCategories')) {
        categories = SELECTION_CATEGORIES.filter(cap => this.task.selectionCategories.indexOf(cap) >= 0); // Using SELECTION_CATEGORIES to ensure display order
      }
      return categories;
    },
    tableColumns() {
      const columns = [];
      columns.push({ title: 'Candidate', class: 'table-cell-application' });
      if (this.showDetail) {
        if (this.type === PANEL_TYPES.SIFT) {
          this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
        }
        if (this.type === PANEL_TYPES.SELECTION) {
          this.selectionCategories.forEach(() => this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' })));
        }
      }
      columns.push({ title: this.$options.filters.lookup(this.scoreType), class: 'text-center' });
      columns.push({ title: 'Female' });
      columns.push({ title: 'Ethnic Minority' });
      columns.push({ title: 'Solicitor' });
      columns.push({ title: 'Disability' });
      columns.push({ title: 'Outcome' });
      return columns;
    },
    exerciseDiversity() {
      return this.$store.state.exerciseDiversity.record ? this.$store.state.exerciseDiversity.record.applicationsMap : {};
    },
    currentIndex() {
      return this.scores.findIndex(scoreData => scoreData.score == this.score);
    },
    scoreReport() {
      return this.scores[this.currentIndex];
    },
    higherScoreReport() {
      if (this.currentIndex > 0) {
        return this.scores[this.currentIndex - 1];
      }
      return null;
    },
    lowerScoreReport() {
      if (this.currentIndex < this.scores.length - 1) {
        return this.scores[this.currentIndex + 1];
      }
      return null;
    },
    scoreData() {
      if (!this.task) return [];
      if (!this.task.finalScores) return [];
      if (!this.exerciseDiversity) return [];
      return this.task.finalScores.filter(scoreData => scoreData[this.scoreType] == this.score).map(scoreData => {
        const application = _find(this.task.applications, application => {
          return application.id === scoreData.id;
        });
        const data = {
          id: scoreData.id,
          ref: scoreData.ref,
          fullName: application.fullName,
          score: scoreData[this.scoreType],
          scoreSheet: scoreData.scoreSheet,
          diversity: {},
        };
        const ref = scoreData.ref.split('-')[1];
        if (this.exerciseDiversity[ref]) {
          data.diversity = {
            female: this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE),
            bame: this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME),
            solicitor: this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR),
            disability: this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED),
          };
        }
        return data;
      }).sort((a, b) => b - a);
    },
  },
  watch: {
    score() {
      this.selectedItems = [];
    },
  },
  methods: {
    hasDiversityCharacteristic,
    isPass(row) {
      if (this.task && this.task.overrides && this.task.overrides.pass && this.task.overrides.pass.indexOf(row.id) >= 0) {
        return true;
      }
      if (this.task && this.task.overrides && this.task.overrides.fail && this.task.overrides.fail.indexOf(row.id) >= 0) {
        return false;
      }
      if (this.task && this.task.passMark && this.task.passMark <= row.score) {
        return true;
      }
      return false;
    },
    toggleShowDetail() {
      this.showDetail = !this.showDetail;
    },
    getOppositeOutcome(outcome) {
      if (outcome === 'pass') return 'fail';
      if (outcome === 'fail') return 'pass';
      return null;
    },
    async setPassOrFail(params) {
      this.$refs['setPassOrFailModal'].closeModal();
      if (!this.selectedItems.length) return false;
      if (!this.passMark) return false;
      const data = {};
      if (params.outcome === this.defaultOutcome) {
        data[`overrides.${this.getOppositeOutcome(params.outcome)}`] = firebase.firestore.FieldValue.arrayRemove(...this.selectedItems);
      } else {
        data[`overrides.${params.outcome}`] = firebase.firestore.FieldValue.arrayUnion(...this.selectedItems);
      }
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: data } );
    },
  },
};
</script>

<style scoped>
.moj-pagination__list {
  display: block;
}
.moj-pagination__list > .moj-pagination__item--prev,
.moj-pagination__list > .moj-pagination__item--next {
  width: 50%;
}
.moj-pagination__list > .moj-pagination__item--prev > .moj-pagination__link {
  text-align: left;
}
.moj-pagination__list > .moj-pagination__item--next > .moj-pagination__link {
  text-align: right;
}
.show-hide-link {
  text-decoration-line: underline;
  text-decoration-style: dotted;
  text-underline-offset: 5px;
  cursor: pointer;
}
</style>
