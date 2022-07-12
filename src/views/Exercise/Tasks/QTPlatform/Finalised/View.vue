<template>
  <div>
    <RouterLink
      :to="{ name: 'qt-platform-finalised', params: { exerciseId: exercise.id, type: type } }"
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
                <span class="govuk-caption-m">Score<br></span>
                {{ score }}
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
              <span class="govuk-caption-m">BAME<br></span>
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
                <span class="govuk-caption-m">Score<br></span>
                {{ higherScoreReport.score }} <span v-if="currentIndex > 1">and above</span>
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
              <span class="govuk-caption-m">BAME<br></span>
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
            :to="{ name: 'qt-platform-finalised-score', params: { exerciseId: exercise.id, type: type, score: lowerScoreReport.score } }"
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
            :to="{ name: 'qt-platform-finalised-score', params: { exerciseId: exercise.id, type: type, score: higherScoreReport.score } }"
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
              :disabled="!selectedItems.length"
              @click="setStatus"
            >
              Set status
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
          {{ row.ref }}
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
          :title="tableColumns[tableColumns.length - 5].title"
          class="text-center table-cell-score"
        >
          <div
            class="show-hide-link"
            @click="toggleShowDetail"
          >
            {{ row.score }}
          </div>
        </TableCell>
        <TableCell :title="tableColumns[tableColumns.length - 4].title">
          {{ row.diversity.female | toYesNo }}
        </TableCell>
        <TableCell :title="tableColumns[tableColumns.length - 3].title">
          {{ row.diversity.bame | toYesNo }}
        </TableCell>
        <TableCell :title="tableColumns[tableColumns.length - 2].title">
          {{ row.diversity.solicitor | toYesNo }}
        </TableCell>
        <TableCell :title="tableColumns[tableColumns.length - 1].title">
          {{ row.diversity.disability | toYesNo }}
        </TableCell>
      </template>
    </Table>

    <Modal
      ref="SetStatusModal"
    >
      <component
        :is="`SetStatus`"
        :selected-items="selectedItems"
        @close="closeModal('SetStatusModal')"
      />
    </Modal>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import SetStatus from '@/components/ModalViews/SetStatus';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import { PANEL_TYPES } from '../../Task/Panel/Constants';
import { CAPABILITIES, SELECTION_CATEGORIES } from '@/helpers/exerciseHelper';

export default {
  components: {
    Table,
    TableCell,
    SetStatus,
    Modal,
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
    capabilities() {
      if (!this.task) return [];
      return CAPABILITIES.filter(cap => this.task.capabilities.indexOf(cap) >= 0);  // Using CAPABILITIES to ensure display order of selected capabilities
    },
    selectionCategories() {
      if (!this.task) return [];
      return SELECTION_CATEGORIES.filter(cap => this.task.selectionCategories.indexOf(cap) >= 0); // Using SELECTION_CATEGORIES to ensure display order
    },
    tableColumns() {
      const columns = [];
      columns.push({ title: 'Application', class: 'table-cell-application' });
      if (this.showDetail) {
        if (this.type === PANEL_TYPES.SIFT) {
          this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
        }
        if (this.type === PANEL_TYPES.SELECTION) {
          this.selectionCategories.forEach(() => this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' })));
        }
      }
      columns.push({ title: 'Score', class: 'text-center' });
      columns.push({ title: 'Female' });
      columns.push({ title: 'BAME' });
      columns.push({ title: 'Solicitor' });
      columns.push({ title: 'Disability' });
      return columns;
    },
    exerciseDiversity() {
      return this.$store.state.exerciseDiversity.record;
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

      return this.task.finalScores.filter(scoreData => scoreData.score == this.score).map(scoreData => {
        return {
          id: scoreData.id,
          ref: scoreData.ref,
          score: scoreData.score,
          scoreSheet: scoreData.scoreSheet,
          diversity: {
            female: this.exerciseDiversity[scoreData.id].gender === 'female',
            bame: this.exerciseDiversity[scoreData.id].ethnicity === 'bame',
            solicitor: this.exerciseDiversity[scoreData.id].professionalBackground.indexOf('solicitor') >= 0,
            disability: this.exerciseDiversity[scoreData.id].disability === 'yes',
          },
        };
      }).sort((a, b) => b - a);
    },
  },
  watch: {
    score() {
      this.selectedItems = [];
    },
  },
  methods: {
    toggleShowDetail() {
      this.showDetail = !this.showDetail;
    },
    clearSelectedItems() {
      console.log('clear selected items', this.selectedItems);
      this.selectedItems = [];
      console.log('clear selected items (after)', this.selectedItems);
    },
    setStatus() {
      this.openModal('SetStatusModal');
    },
    openModal(modalRef){
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
      this.selectedItems = [];
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
