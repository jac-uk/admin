<template>
  <div>
    <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-bottom-2">
      <span class="govuk-caption-m">
        Applications
      </span>
      <div class="govuk-grid-row">
        <div :class="hasParticipation ? 'govuk-grid-column-one-quarter' : 'govuk-grid-column-one-third'">
          <span class="govuk-body-s govuk-!-margin-bottom-0">
            Total
          </span>
          <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
            {{ totalApplications }}
          </h2>
        </div>
        <div :class="hasParticipation ? 'govuk-grid-column-one-quarter' : 'govuk-grid-column-one-third'">
          <span class="govuk-body-s govuk-!-margin-bottom-0">
            Passed
          </span>
          <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
            {{ totalPassed }}
          </h2>
        </div>
        <div :class="hasParticipation ? 'govuk-grid-column-one-quarter' : 'govuk-grid-column-one-third'">
          <span class="govuk-body-s govuk-!-margin-bottom-0">
            Failed
          </span>
          <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
            {{ totalFailed }}
          </h2>
        </div>
        <div
          v-if="hasParticipation"
          class="govuk-grid-column-one-quarter"
        >
          <span class="govuk-body-s govuk-!-margin-bottom-0">
            Not started
          </span>
          <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
            {{ totalDidNotParticipate }}
          </h2>
        </div>
      </div>
    </div>

    <div class="govuk-grid-row govuk-!-margin-bottom-1">
      <span class="govuk-!-margin-left-3 govuk-heading-s">Diversity stats reflect total representation when each band is included, descending from the top</span>
    </div>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <a
          class="govuk-link"
          @click="btnFind"
        >Find an application</a>
        <a
          class="govuk-link govuk-!-margin-left-4"
          @click="btnExport"
        >Download merit list</a>
      </div>
      <!-- <div class="govuk-grid-column-one-half">
        <label class="govuk-label govuk-!-display-inline" for="search">
          <span class="govuk-body-s">Search</span>
        </label>
        <input class="search-input govuk-input govuk-input--width-10 govuk-!-margin-left-2" id="search" name="search" type="text">
      </div> -->
      <div class="govuk-grid-column-one-half text-right">
        <!-- TODO: Ranked by Overall grade + score -->
        <span class="govuk-body-s">Ranked by {{ $filters.lookup(scoreType) }}</span>
        <a
          class="govuk-link govuk-!-margin-left-4"
          @click="toggleAll"
        ><span v-if="areAllScoresExpanded">Collapse all</span><span v-else>Expand all</span></a>
      </div>
    </div>

    <Table
      data-key="score"
      :data="takenTestScores"
      :columns="tableColumns"
      local-data
      class="merit-list"
    >
      <template #row="{row}">
        <TableCell :title="titleLookup('rank')">
          <span class="govuk-body">{{ row.rank }}</span>
        </TableCell>
        <TableCell :title="titleLookup('count')">
          {{ row.count }}
        </TableCell>
        <TableCell :title="titleLookup(scoreType)">
          <template v-if="scoreType == 'gradeScore'">
            {{ row.score }}
          </template>
          <template v-else>
            {{ $filters.formatNumber(row.score, 2) }}
          </template>
        </TableCell>
        <!-- Percentile Rank -->
        <template v-if="showPercentileRank">
          <TableCell :title="titleLookup('percentile')">
            {{ row.percentileRank }}%
          </TableCell>
        </template>

        <template v-if="showDiversity">
          <TableCell :title="titleLookup('female')">
            {{ $filters.formatNumber(100 * (row.cumulativeDiversity.female / (row.rank + row.count - 1)), 2) }}%
          </TableCell>
          <TableCell :title="titleLookup('bame')">
            {{ $filters.formatNumber(100 * (row.cumulativeDiversity.bame / (row.rank + row.count - 1)), 2) }}%
          </TableCell>
          <TableCell :title="titleLookup('solicitor')">
            {{ $filters.formatNumber(100 * (row.cumulativeDiversity.solicitor / (row.rank + row.count - 1)), 2) }}%
          </TableCell>
          <TableCell :title="titleLookup('disability')">
            {{ $filters.formatNumber(100 * (row.cumulativeDiversity.disability / (row.rank + row.count - 1)), 2) }}%
          </TableCell>
        </template>
        <TableCell :title="titleLookup('outcome')">
          <template v-if="!isScoreExpanded(row.score)">
            <div
              v-if="row.outcome.pass"
              :class="{'govuk-!-margin-bottom-2': row.outcome.fail}"
            >
              <strong
                class="govuk-tag govuk-tag--green"
              >PASS</strong>
              <span v-if="row.outcome.fail"> x {{ row.outcome.pass }}</span>
            </div>
            <div v-if="row.outcome.fail">
              <strong
                class="govuk-tag govuk-tag--red"
              >FAIL</strong>
              <span v-if="row.outcome.pass"> x {{ row.outcome.fail }}</span>
            </div>
          </template>
        </TableCell>
        <TableCell
          title="Expand/collapse"
          class="expand-collapse"
        >
          <div
            class="govuk-!-padding-left-2 govuk-!-padding-right-2 clickable"
            @click="toggleScore(row.score)"
          >
            <span
              class="icon-expand govuk-!-margin-left-0"
              :class="isScoreExpanded(row.score) ? 'open' : 'close'"
            >
              <img src="@/assets/expand.svg">
            </span>
          </div>
        </TableCell>
      </template>

      <template #extra-row="{row}">
        <template v-if="isScoreExpanded(row.score)">
          <tr
            v-for="item in getScoreDataForScore(row.score)"
            :key="item.id"
            class="govuk-table__row extra-row"
            :class="{ 'highlight': item.ref == selectedApplication}"
          >
            <TableCell colspan="4">
              {{ item.fullName || item.ref }}
            </TableCell>

            <template v-if="showDiversity">
              <TableCell :title="titleLookup('female')">
                {{ $filters.toYesNo(item.diversity.female) }}
              </TableCell>
              <TableCell :title="titleLookup('bame')">
                {{ $filters.toYesNo(item.diversity.bame) }}
              </TableCell>
              <TableCell :title="titleLookup('solicitor')">
                {{ $filters.toYesNo(item.diversity.solicitor) }}
              </TableCell>
              <TableCell :title="titleLookup('disability')">
                {{ $filters.toYesNo(item.diversity.disability) }}
              </TableCell>
            </template>
            <TableCell :title="titleLookup('outcome')">
              <strong
                v-if="passMark && isPass(item)"
                class="govuk-tag govuk-tag--green"
                :class="{ 'clickable': editable }"
                @click="openChangeOutcomeModal(item)"
              >PASS</strong>
              <strong
                v-else-if="passMark"
                class="govuk-tag govuk-tag--red"
                :class="{ 'clickable': editable }"
                @click="openChangeOutcomeModal(item)"
              >FAIL</strong>
            </TableCell>
            <TableCell
              title="Expand collapse all rows"
              class="expand-collapse"
            >
              <div
                class="govuk-!-padding-left-2 govuk-!-padding-right-2 clickable"
                @click="toggleScore(row.score)"
              >
                <span
                  class="icon-expand govuk-!-margin-left-0"
                  :class="isScoreExpanded(row.score) ? 'open' : 'close'"
                >
                  <img src="@/assets/expand.svg">
                </span>
              </div>
            </TableCell>
          </tr>
        </template>
      </template>
    </Table>
    <Modal ref="changeOutcomeModal">
      <TitleBar>
        Change outcome
      </TitleBar>
      <ChangeOutcome
        class="govuk-!-margin-6"
        :item="selectedItem"
        :task="task"
        @save="changeOutcome"
        @cancel="$refs['changeOutcomeModal'].closeModal()"
      />
    </Modal>
    <Modal ref="exportModal">
      <TitleBar>
        Download merit list for {{ $filters.lookup(type) }}
      </TitleBar>
      <ConfigureExport
        class="govuk-!-margin-6"
        :types="downloadTypes"
        @save="downloadMeritList"
        @cancel="$refs['exportModal'].closeModal()"
      />
    </Modal>
    <Modal ref="findApplicationModal">
      <TitleBar @click="$refs['findApplicationModal'].closeModal()">
        Find an application
      </TitleBar>
      <div style="padding: 0 20px 0 20px; min-height: 300px">
        <PredictiveSearch
          id="find-a-candidate"
          v-model="selectedApplication"
          :hint="searchHint"
          :show-full-list-on-focus="false"
          :data="scoreData"
          :search-fields="searchFields"
          required
          @update:model-value="onApplicationFound"
        />
        <button
          class="govuk-button govuk-button--secondary"
          type="button"
          @click="selectedApplication = null; $refs['findApplicationModal'].closeModal()"
        >
          Cancel
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { deleteField } from '@firebase/firestore';
import PredictiveSearch from '@jac-uk/jac-kit/draftComponents/Form/PredictiveSearch.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import TitleBar from '@/components/Page/TitleBar.vue';
import ChangeOutcome from './ChangeOutcome.vue';
import ConfigureExport from './ConfigureExport.vue';
import { isPass, totalApplications, totalPassed, totalFailed, totalDidNotParticipate, hasParticipation, downloadMeritList, getDownloadTypes } from '@/helpers/meritListHelper';
import { TASK_TYPE } from '@/helpers/exerciseHelper';
import _deepClone from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import _startCase from 'lodash/startCase';

export default {
  components: {
    PredictiveSearch,
    Table,
    TableCell,
    Modal,
    TitleBar,
    ChangeOutcome,
    ConfigureExport,
  },
  props: {
    task: {
      required: true,
      type: Object,
    },
    scores: {
      required: true,
      type: Array,
    },
    scoreData: {
      required: true,
      type: Array,
    },
    scoreType: {
      required: true,
      type: String,
    },
    editable: {
      required: false,
      type: Boolean,
      default: false,
    },
    showDiversity: {
      required: false,
      type: Boolean,
      default: true,
    },
  },
  data() {
    const showPercentileRank = this.task.type === TASK_TYPE.QUALIFYING_TEST;
    const tableColumns = [];
    tableColumns.push({ title: this.titleLookup('rank') });
    tableColumns.push({ title: this.titleLookup('count') });
    tableColumns.push({ title: this.$filters.lookup(this.scoreType) });
    if (showPercentileRank) {
      tableColumns.push({ title: this.titleLookup('percentile') });
    }
    if (this.showDiversity) {
      tableColumns.push({ title: this.titleLookup('female') });
      tableColumns.push({ title: this.titleLookup('ethnicMinority') });
      tableColumns.push({ title: this.titleLookup('solicitor') });
      tableColumns.push({ title: this.titleLookup('disability') });
    }
    tableColumns.push({ title: this.titleLookup('outcome') });
    tableColumns.push({ title: '' });
    return {
      showPercentileRank,
      tableColumns: tableColumns,
      expandedScores: [],
      selectedItem: null,
      selectedApplication: null,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseDiversity() {
      return this.$store.state.exerciseDiversity.record ? this.$store.state.exerciseDiversity.record.applicationsMap : {};
    },
    type() {
      return this.task.type;
    },
    passMark() {
      return this.task && this.task.passMark || null;
    },
    areAllScoresExpanded() {
      if (this.expandedScores.length < this.scores.length) {
        return false;
      } else {
        return true;
      }
    },
    downloadTypes() {
      return getDownloadTypes(this.task);
    },
    totalApplications() {
      return totalApplications(this.task);
    },
    totalPassed() {
      return totalPassed(this.task, this.scoreType, this.scores);
    },
    totalFailed() {
      return totalFailed(this.task, this.scoreType, this.scores);
    },
    totalDidNotParticipate() {
      return totalDidNotParticipate(this.task, this.scoreType, this.scores);
    },
    hasParticipation() {
      return hasParticipation(this.task);
    },
    searchFields() {
      if (this.scoreData[0].fullName) {
        return ['ref', 'fullName'];
      }
      return ['ref'];
    },
    searchHint() {
      if (this.scoreData[0].fullName) {
        return 'Type any part of candidate name or reference number';
      }
      return 'Type any part of reference number';
    },
    takenTestScores() {
      if (this.scoreType === 'zScore') {
        return this.scores;
      } else if (this.scoreType === 'gradeScore') {
        return this.scores.filter(score => !_isEmpty(score.score) );
      } else {
        // The line is made for accommodation of existing QT API behaviour, when creating score sheet, DP will call QT API to fetch scores, both 0 and not taken will have empty response from QT. So, we can't separate them at the moment.
        // We couldn't update QT at that time, and the case would be rare,
        // so we consider 0 score as the same as not taken, and not showing in the merit list.
        return this.scores.filter(score => score.score > 0);
      }
    },
  },
  methods: {
    toggleAll() {
      this.expandedScores = this.areAllScoresExpanded ? [] : this.scores.map(item => item.score);
    },
    toggleScore(score) {
      const pos = this.expandedScores.indexOf(score);
      if (pos >= 0) {
        this.expandedScores.splice(pos, 1);
        this.selectedApplication = null;
      } else {
        this.expandedScores.push(score);
      }
    },
    isScoreExpanded(score) {
      const pos = this.expandedScores.indexOf(score);
      if (pos >= 0) {
        return true;
      } else {
        return false;
      }
    },
    getScoreDataForScore(score) {
      return this.scoreData.filter(item => item[this.scoreType] === score );
    },
    isPass(row) {
      return isPass(this.task, row.id, row);
    },
    openChangeOutcomeModal(item) {
      if (this.editable) {
        this.selectedItem = item;
        this.$refs['changeOutcomeModal'].openModal();
      }
    },
    async changeOutcome(params) {
      this.$refs['changeOutcomeModal'].closeModal();
      if (!this.selectedItem) return false;
      if (!this.passMark) return false;
      const data = {};
      if (params.changeOutcome) {
        data[`overrides.${params.newOutcome}.${this.selectedItem.id}`] = params.reason;
      } else {
        if (this.task.overrides[params.newOutcome][this.selectedItem.id]) {
          data[`overrides.${params.newOutcome}.${this.selectedItem.id}`] = deleteField();
        }
      }
      if (Object.keys(data).length) {
        await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: data } );
      }
    },
    btnFind() {
      // this.selectedApplication = null;
      this.$refs['findApplicationModal'].openModal();
    },
    onApplicationFound() {
      const score = this.scoreData.find(item => item.ref === this.selectedApplication).score;
      if (!this.isScoreExpanded(score)) this.toggleScore(score);
      this.$refs['findApplicationModal'].closeModal();
    },
    btnExport() {
      this.selectedApplication = null;
      this.$refs['exportModal'].openModal();
    },
    async downloadMeritList(saveData) {
      const title = this.$filters.lookup(this.type);
      let fileName = `${this.exercise.referenceNumber}-${this.type}`;

      const task = _deepClone(this.task);
      let didNotTake = [];
      let failed = [];
      let withdrawnBeforeQT = [];
      const idToApplication = {};
      task.applications.forEach(application => {
        idToApplication[application.id] = application;
      });

      switch (this.type) {
      case TASK_TYPE.QUALIFYING_TEST: {
        fileName = `${this.exercise.referenceNumber}-qt-merit-list`;
        task.finalScores = task.finalScores.filter(scoreData => scoreData?.scoreSheet?.qualifyingTest?.CA?.pass && scoreData?.scoreSheet?.qualifyingTest?.SJ?.pass);
        // the applications did not take both of the tests
        didNotTake = this.task.finalScores.filter(scoreData => !scoreData?.scoreSheet?.qualifyingTest?.CA?.score && !scoreData?.scoreSheet?.qualifyingTest?.SJ?.score);
        didNotTake = didNotTake.map(scoreData => {
          const application = idToApplication[scoreData.id] || {};
          return { ...application, ...scoreData };
        });
        const didNotTakeIds = didNotTake.map(scoreData => scoreData.id);
        // the applications failed one of the tests (excluding those that did not take)
        failed = this.task.finalScores.filter(scoreData => !scoreData?.scoreSheet?.qualifyingTest?.CA?.pass || !scoreData?.scoreSheet?.qualifyingTest?.SJ?.pass);
        failed = failed.filter(scoreData => !didNotTakeIds.includes(scoreData.id));
        failed = failed.map(scoreData => {
          const application = idToApplication[scoreData.id] || {};
          return { ...application, ...scoreData };
        });
        break;
      }
      case TASK_TYPE.CRITICAL_ANALYSIS:
      case TASK_TYPE.SITUATIONAL_JUDGEMENT: {
        // prevent duplicating with didNotTake and failed applications
        task.finalScores = task.finalScores.filter(scoreData => scoreData?.score);
        didNotTake = this.task.finalScores.filter(scoreData => !scoreData.score).map(scoreData => {
          const application = idToApplication[scoreData.id] || {};
          return { ...application, ...scoreData };
        });
        break;
      }
      default:
      }
      // the applications withdrawn before the tests
      const withdrawnApplications = await this.$store.dispatch('applications/getApplicationsByStatus', { status: 'withdrawn', exerciseId: this.exercise.id });
      withdrawnBeforeQT = withdrawnApplications.filter(application => !idToApplication[application.id]);
      withdrawnBeforeQT = withdrawnBeforeQT.map(application => ({
        id: application.id,
        ref: application.referenceNumber,
        fullName: application.personalDetails.fullName,
        email: application.personalDetails.email,
      }));
      const scoreGroups = {
        didNotTake, failed, withdrawnBeforeQT,
      };
      downloadMeritList(title, scoreGroups, task, this.exerciseDiversity, saveData.type, fileName);
      this.$refs['exportModal'].closeModal();
    },
    titleLookup(key) {
      const titleMap = {
        rank: 'Rank',
        count: 'Count',
        score: this.$filters.lookup(this.scoreType),
        percentile: 'Percentile',
        female: 'Female',
        ethnicMinority: 'Ethnic Minority',
        solicitor: 'Solicitor',
        disability: 'Disability',
        outcome: 'Outcome',
      };

      return titleMap[key] || _startCase(key);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  height: 1.6rem;
  font-size: 16px;
  border-width: 1px;
}
.merit-list {
  td {
    vertical-align: middle;
  }
  .expand-collapse {
    width: 40px;
  }
}
.extra-row {
  background-color: rgba(243,242,241, .5);
  font-size: 16px;
  // box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
  > td:first-child {
    padding-left: 10px;
  }
}

.clickable {
  cursor: pointer;
  text-decoration: underline dotted;
}

.highlight {
  background-color: rgba(86,148,202,0.2);
}
</style>
