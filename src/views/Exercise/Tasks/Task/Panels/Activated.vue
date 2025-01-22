<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="text-right govuk-grid-column-one-half">
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />
    <p
      v-if="!hasTaskStarted"
      class="govuk-body govuk-!-margin-bottom-4"
    >
      {{ $filters.lookup(type) }} grading will start on {{ $filters.formatDate(task.startDate) }}
    </p>
    <p
      v-else-if="!hasAllPanelsCompleted"
      class="govuk-body govuk-!-margin-bottom-4"
    >
      {{ $filters.lookup(type) }} grading has started and panels are providing grades.
    </p>
    <p
      v-else-if="isModerationRequired"
      class="govuk-body govuk-!-margin-bottom-4"
    >
      All panels have provided grades. Please select any applications that require moderation before continuing.
    </p>
    <p
      v-else
      class="govuk-body govuk-!-margin-bottom-4"
    >
      All panels have provided grades.
    </p>

    <div
      v-if="hasAllPanelsCompleted"
      class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey"
    >
      <p class="govuk-body govuk-!-margin-bottom-4">
        Next step
      </p>
      <ActionButton
        class="govuk-!-margin-bottom-1"
        type="primary"
        :action="btnFinalise"
      >
        Continue
      </ActionButton>
    </div>

    <div
      class="panel panel-button govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey"
      @click="toggleStats"
    >
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Panels
            <span class="govuk-caption-m">Completed / Total</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ stats.completedPanels }} / {{ stats.totalPanels }}
          </h2>
        </div>

        <div class="govuk-grid-column-one-half">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
            <span class="govuk-caption-m">Completed / Total<span v-if="isModerationRequired"> / Requiring moderation</span></span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ stats.completedApplications }} / {{ stats.totalApplications }}<span v-if="isModerationRequired"> / {{ stats.totalApplicationsForModeration }}</span>
          </h2>
        </div>
      </div>
    </div>

    <!-- OVERVIEW -->
    <div v-show="showStats">
      <!-- START: GRADES -->
      <div
        v-if="task.grades"
        class="govuk-grid-row"
      >
        <div
          v-if="stats && stats.overallGradesByPanel"
          class="govuk-grid-column-full"
        >
          <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
            <p class="govuk-body govuk-!-margin-bottom-4">
              Grades
            </p>
            <span class="govuk-caption-m">Overall grades awarded by each panel</span>
            <Table
              ref="gradesByPanel"
              data-key="id"
              :data="grades"
              :columns="[{ title: 'Grade' }].concat(panelNamesAsColumns)"
              local-data
            >
              <template #row="{row}">
                <TableCell title="grade">
                  {{ row }}
                </TableCell>
                <TableCell
                  v-for="panel in panels"
                  :key="panel.id"
                  :title="panel.name"
                >
                  <span v-if="stats.overallGradesByPanel[panel.id]">
                    {{ stats.overallGradesByPanel[panel.id][row] }}
                  </span>
                  <span v-else>0</span>
                </TableCell>
              </template>
              <template #footer>
                <tr class="govuk-table__row">
                  <TableCell title="total">
                    Total
                  </TableCell>
                  <TableCell
                    v-for="panel in panels"
                    :key="panel.id"
                    :title="panel.name"
                  >
                    <span v-if="stats.overallGradesByPanel[panel.id]">
                      {{ stats.overallGradesByPanel[panel.id].count }}
                    </span>
                    <span v-else>0</span>
                  </TableCell>
                </tr>
              </template>
            </Table>

            <div class="govuk-grid-row">
              <div class="govuk-grid-column-one-half">
                <span class="govuk-caption-m">Final grades across all panels</span>
                <Table
                  ref="finalGrades"
                  data-key="id"
                  :data="grades"
                  :columns="[{ title: 'Grade' }, {title: 'Total'}]"
                  local-data
                >
                  <template #row="{row}">
                    <TableCell title="grade">
                      {{ row }}
                    </TableCell>
                    <TableCell>
                      {{ stats.overallGrades[row] }}
                    </TableCell>
                  </template>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: GRADES -->

      <!-- START: SCORES -->
      <div
        v-if="task.grades"
        class="govuk-grid-row"
      >
        <div
          v-if="stats && stats.overallScoreByPanel"
          class="govuk-grid-column-full"
        >
          <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
            <p class="govuk-body govuk-!-margin-bottom-4">
              Scores
            </p>
            <span class="govuk-caption-m">Average numerical score</span>
            <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-4">
              {{ stats.overallScore.average }}
            </h2>
            <span class="govuk-caption-m">Average numerical score by each panel</span>
            <Table
              data-key="id"
              :data="['average']"
              :columns="panelNamesAsColumns"
              local-data
            >
              <template #row>
                <TableCell
                  v-for="panel in panels"
                  :key="panel.id"
                  :title="panel.name"
                >
                  <span v-if="stats.overallScoreByPanel[panel.id]">
                    {{ stats.overallScoreByPanel[panel.id].average }}
                  </span>
                  <span v-else>0</span>
                </TableCell>
              </template>
            </Table>
          </div>
        </div>
      </div>
      <!-- END: SCORES -->
    </div>
    <!-- // END OVERVIEW -->

    <!-- SCORE SHEET -->
    <ScoreSheet
      ref="scoreSheet"
      data-key="id"
      :marking-scheme="task.markingScheme"
      :data="scoreSheetData"
      :columns-before="[{ title: 'Application', ref:'referenceNumber', class: 'table-cell-application' }, { title: 'Panel', parent: 'panel', ref: 'name', class: 'table-cell' }]"
      :editable="canEditScoreSheet"
      :moderation="isModerationRequired"
      :tools="scoreSheetTools"
      @updated="onScoreSheetUpdated"
    >
      <template #columns-before="{row}">
        <TableCell
          class="table-cell-application nowrap sticky-left"
          :class="{ 'highlight': row.highlight }"
        >
          {{ row.fullName || row.referenceNumber }}
        </TableCell>
        <TableCell
          class="table-cell-value nowrap"
          :class="{ 'highlight': row.highlight }"
        >
          <RouterLink
            :to="{ name: `exercise-task-panel`, params: { type: type, panelId: row.panel.id } }"
            class="govuk-link"
          >
            {{ row.panel.name }}
          </RouterLink>
        </TableCell>
      </template>
    </ScoreSheet>
    <!-- // END SCORE SHEET -->
  </div>
</template>

<script>
import { deleteField } from '@firebase/firestore';
import { httpsCallable } from '@firebase/functions';
import { beforeRouteEnter, btnNext } from '../helper';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { PANEL_TYPES, PANEL_STATUS } from '../Panel/Constants';
import { CAPABILITIES, SELECTION_CATEGORIES, availableStatuses, getTaskSteps } from '@/helpers/exerciseHelper';
import { SCORESHEET_TOOLS, getScoreSheetTotal, GRADE_VALUES, scoreSheetRowsAddRank, scoreSheetRowsAddDiversity, getApplicationData } from '@/helpers/scoreSheetHelper';
import { scoreType, getOverallGrade } from '../Finalised/meritListHelper';
import { functions } from '@/firebase';
import ScoreSheet from '@/components/ScoreSheet/ScoreSheet.vue';

export default {
  components: {
    Table,
    TableCell,
    ActionButton,
    FullScreenButton,
    ProgressBar,
    ScoreSheet,
  },
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      showStats: false,
      scoreSheetTools: [
        SCORESHEET_TOOLS.FIND,
        SCORESHEET_TOOLS.COPY,
        SCORESHEET_TOOLS.PASTE,
        // SCORESHEET_TOOLS.EDIT,
        SCORESHEET_TOOLS.SCORE,
        SCORESHEET_TOOLS.DIVERSITY,
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseDiversity() {
      return this.$store.state.exerciseDiversity.record ? this.$store.state.exerciseDiversity.record.applicationsMap : {};
    },
    isSift() {
      return this.type === PANEL_TYPES.SIFT;
    },
    isSelection() {
      return this.type === PANEL_TYPES.SELECTION;
    },
    isScenario() {
      return this.type === PANEL_TYPES.SCENARIO;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
    hasTaskStarted() {
      if (!this.task) return false;
      if (!this.task.startDate) return false;
      return this.task.startDate < new Date();
    },
    panels() {
      if (!this.task) return [];
      const allPanels = this.$store.state.panels.records || [];
      return allPanels
        .filter(panel => this.task.panelIds.indexOf(panel.id) >= 0)
        .sort((a, b) => {
          if (a.name > b.name) return 1;
          else if (a.name === b.name) return 0;
          else return -1;
        });
    },
    canEditScoreSheet() {
      return true;
    },
    isModerationRequired() {
      return false;
      // if (!this.task) return false;
      // return this.task.panelIds.length > 1;
    },
    hasAllPanelsCompleted() {
      if (!this.stats) return false;
      if (!this.stats.totalPanels) return false;
      return this.stats.completedPanels === this.stats.totalPanels;
    },
    capabilities() {
      if (!this.task) return [];
      if (!this.task.capabilities) return [];
      return CAPABILITIES.filter(cap => this.task.capabilities.indexOf(cap) >= 0);  // Using CAPABILITIES to ensure display order of selected capabilities
    },
    selectionCategories() {
      if (!this.task) return [];
      if (!this.task.selectionCategories) return [];
      return SELECTION_CATEGORIES.filter(cap => this.task.selectionCategories.indexOf(cap) >= 0); // Using SELECTION_CATEGORIES to ensure display order
    },
    grades() {
      return this.task && this.task.grades ? this.task.grades : [];
    },
    statuses() {
      return availableStatuses(this.exercise);
    },
    panelNamesAsColumns() {
      if (!this.panels) return [];
      return this.panels.map(panel => { return { title: panel.name }; });
    },
    scoreType() {
      return scoreType(this.task);
    },
    scoreSheetData() {
      const rows = [];
      this.panels.forEach(panel => {
        if (!panel.applicationIds) return;
        if (!panel.scoreSheet) return;
        panel.applicationIds.forEach(applicationId => {
          const row = {
            panel: {
              id: panel.id,
              name: panel.name,
              type: panel.type,
            },
            id: applicationId,
            referenceNumber: panel.applications[applicationId].referenceNumber,
            fullName: getApplicationData(this.task, applicationId).fullName,
            scoreSheet: panel.scoreSheet[applicationId],
            isCompleted: panel.status === PANEL_STATUS.SUBMITTED,
            report: panel.reports ? panel.reports[applicationId] : null,
            outcome: panel.outcome,
            changes: this.task.changes && this.task.changes[applicationId] ? this.task.changes[applicationId] : {},
          };
          row.score = getScoreSheetTotal(this.task.markingScheme, panel.scoreSheet[applicationId], row.changes);
          if (this.scoreType === 'gradeScore') {
            row.grade = getOverallGrade(this.task, panel.scoreSheet[applicationId]);
          }
          rows.push(row);
        });
      });
      if (this.exerciseDiversity) scoreSheetRowsAddDiversity(rows, this.exerciseDiversity);
      scoreSheetRowsAddRank(this.scoreType, rows);
      // TODO might want to add custom sort here
      return rows;
    },
    stats() {
      const data = {};
      const relevantPanels = this.panels.filter(panel => (panel.status !== PANEL_STATUS.DRAFT && panel.applicationIds));  // TODO ensure this comes from task
      data.totalPanels = relevantPanels.length;
      const completedPanels = relevantPanels.filter(panel => panel.status === PANEL_STATUS.SUBMITTED);
      data.completedPanels = completedPanels.length;
      data.totalApplications = 0;
      data.completedApplications = 0;
      data.totalApplicationsForModeration = 0;
      data.statuses = {};
      this.statuses.forEach(status => data.statuses[status] = 0);
      data.overallGradesByPanel = {};
      data.overallGrades = {};
      this.grades.forEach(grade => data.overallGrades[grade] = 0);
      data.overallScoreByPanel = {};
      data.overallScore = { count: 0, total: 0, average: 0 };
      relevantPanels.forEach(panel => {
        data.totalApplications += panel.applicationIds.length;
        if (panel.status === PANEL_STATUS.SUBMITTED) {
          data.completedApplications += panel.applicationIds.length;
        }
        if (data.overallGradesByPanel) {
          data.overallGradesByPanel[panel.id] = { count: 0 };
          data.overallScoreByPanel[panel.id] = { count: 0, total: 0, average: 0 };
          this.grades.forEach(grade => {
            if (this.isSelection) {
              data.overallGradesByPanel[panel.id][grade] = panel.applicationIds.map(applicationId => panel.scoreSheet[applicationId].overall.OVERALL).filter(item => item === grade).length;
            } else {
              data.overallGradesByPanel[panel.id][grade] = panel.applicationIds.map(applicationId => panel.scoreSheet[applicationId][this.type].OVERALL ).filter(item => item === grade).length;
            }
            data.overallGradesByPanel[panel.id].count += data.overallGradesByPanel[panel.id][grade];
            data.overallGrades[grade] += data.overallGradesByPanel[panel.id][grade];
            data.overallScoreByPanel[panel.id].count = data.overallGradesByPanel[panel.id].count;
            data.overallScoreByPanel[panel.id].total += (data.overallGradesByPanel[panel.id][grade] * GRADE_VALUES[grade]);
          });
          data.overallScore.count += data.overallScoreByPanel[panel.id].count;
          data.overallScore.total += data.overallScoreByPanel[panel.id].total;
          if (data.overallScoreByPanel[panel.id] && data.overallScoreByPanel[panel.id].count) {
            data.overallScoreByPanel[panel.id].average = Number(data.overallScoreByPanel[panel.id].total / data.overallScoreByPanel[panel.id].count).toFixed(2) || 0;
          }
        }
        data.totalApplicationsForModeration += panel.applicationIds.filter(applicationId => panel.scoreSheet[applicationId].moderation === 'Yes').length;
      });
      if (data.overallScore && data.overallScore.count) {
        data.overallScore.average = Number(data.overallScore.total / data.overallScore.count).toFixed(2) || 0;
      }
      return data;
    },
  },
  async created() {
    this.$store.dispatch(
      'panels/bind',
      {
        exerciseId: this.exercise.id,
        type: this.type,
      }
    );
    await this.$store.dispatch('exerciseDiversity/bind', this.exercise.id);
  },
  methods: {
    toggleStats() {
      this.showStats = !this.showStats;
    },
    btnNext,
    async btnFinalise() {
      await httpsCallable(functions, 'updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
    async onScoreSheetUpdated({ id, ref, parent, newValue }) {
      const panel = this.panels.find(item => item.applicationIds.indexOf(id) >= 0);
      const originalValue = parent ? panel.scoreSheet[id][parent][ref] : panel.scoreSheet[id][ref];
      const valueToSave = newValue === originalValue ? deleteField() : newValue;
      const saveData = {};
      if (parent) saveData[`changes.${id}.${parent}.${ref}`] = valueToSave;
      else saveData[`changes.${id}.${ref}`] = valueToSave;
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: saveData });
      return true;
    },

  },
};
</script>

<style>
.panel-button {
  cursor: pointer;
  border: 1px solid transparent;
}
.panel-button:hover {
  border: 1px solid #b1b4b6;
}
</style>
