<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>

    <p
      v-if="!hasTaskStarted"
      class="govuk-body-l"
    >
      {{ type | lookup }} scoring will start on {{ task.startDate | formatDate }}
    </p>
    <p
      v-else-if="!hasAllPanelsCompleted"
      class="govuk-body-l"
    >
      {{ type | lookup }} scoring has started and panels are providing scores.
    </p>
    <p
      v-else-if="isModerationRequired"
      class="govuk-body-l"
    >
      All panels have provided scores. Please select any applications that require moderation before continuing.
    </p>
    <p
      v-else
      class="govuk-body-l"
    >
      All panels have provided scores.
    </p>

    <div
      v-if="hasAllPanelsCompleted"
      class="govuk-grid-row"
    >
      <div class="govuk-grid-column-two-thirds">
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
            <span class="govuk-caption-m"><span v-if="isModerationRequired">Requiring moderation / </span>Total</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            <span v-if="isModerationRequired">{{ stats.totalApplicationsForModeration }} / </span>{{ stats.totalApplications }}
          </h2>
        </div>
      </div>

      <div class="govuk-grid-column-one-third">
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-4">
            Next step
          </p>
          <ActionButton
            class="govuk-!-margin-bottom-1"
            type="primary"
            @click="btnFinalise"
          >
            Continue
          </ActionButton>
        </div>
      </div>
    </div>

    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />

    <!-- OVERVIEW -->
    <div v-show="activeTab == 'overview'">
      <div class="govuk-grid-row">
        <div
          class="govuk-grid-column-full"
        >
          <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">{{ type | lookup }} dates</span>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              {{ task.startDate | formatDate | showAlternative("Unknown") }} to
              {{ task.endDate | formatDate | showAlternative("Unknown") }}
            </h2>
          </div>
        </div>
      </div>

      <!-- START: PANELS -->
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
            <p class="govuk-body govuk-!-margin-bottom-0">
              Panels
              <span class="govuk-caption-m">Completed / Total</span>
            </p>
            <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
              {{ stats.completedPanels }} / {{ stats.totalPanels }}
            </h2>
          </div>
        </div>
        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
            <p class="govuk-body govuk-!-margin-bottom-0">
              Applications
              <span class="govuk-caption-m">Completed / Total</span>
            </p>
            <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
              {{ stats.completedApplications }} / {{ stats.totalApplications }}
            </h2>
          </div>
        </div>
      </div>
      <!-- END: PANELS -->

      <!-- START: GRADES -->
      <div
        v-if="hasAllPanelsCompleted && task.grades"
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
        v-if="hasAllPanelsCompleted && task.grades"
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
    <div v-show="activeTab == 'scoreSheet'">
      <Table
        ref="scoreSheet"
        data-key="id"
        :data="tableData"
        :columns="tableColumns"
        :page-size="500"
        local-data
        class="merit-list"
      >
        <template
          v-if="scoreSheetHeaders.length"
          #header
        >
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header table-cell-application"
            />
            <th
              scope="col"
              class="govuk-table__header table-cell"
            />
            <th
              v-for="header in scoreSheetHeaders"
              :key="header.ref"
              scope="col"
              :colspan="header.colspan"
              class="govuk-table__header text-center"
            >
              {{ header.ref | lookup }}
            </th>
            <th
              v-if="isModerationRequired"
              scope="col"
              class="govuk-table__header table-cell"
            />
          </tr>
        </template>
        <template #row="{row}">
          <TableCell class="table-cell-application">
            {{ row.referenceNumber }}
          </TableCell>
          <TableCell class="table-cell">
            <RouterLink
              :to="{ name: `exercise-task-panel`, params: { type: type, panelId: row.panel.id } }"
              class="govuk-link"
            >
              {{ row.panel.name }}
            </RouterLink>
          </TableCell>

          <template
            v-for="(item, index) in task.markingScheme"
          >
            <template v-if="item.type === 'group'">
              <TableCell
                v-for="(child, childIndex) in item.children"
                :key="`${type}_${index}_${childIndex}`"
                class="text-center table-cell-score"
              >
                {{ row.scoreSheet[item.ref][child.ref] }}
              </TableCell>
            </template>
            <template v-else>
              <TableCell
                :key="`${type}_${index}`"
                class="text-center table-cell-score"
              >
                {{ row.scoreSheet[item.ref] }}
              </TableCell>
            </template>
          </template>

          <TableCell
            v-if="isModerationRequired"
            class="govuk-!-padding-0 v-top"
          >
            <div class="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-left-7">
              <div class="govuk-checkboxes__item">
                <input
                  :id="`moderation-${row.id}`"
                  :checked="row.scoreSheet.flagForModeration"
                  class="govuk-checkboxes__input"
                  type="checkbox"
                  @input="updateModeration(row.panel.id, row.id, $event)"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                  :for="`moderation-${row.id}`"
                />
              </div>
            </div>
          </TableCell>
        </template>
      </Table>
    </div>
    <!-- // END SCORE SHEET -->
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { SHORTLISTING } from '@jac-uk/jac-kit/helpers/constants';
import { PANEL_TYPES, PANEL_STATUS } from './Panel/Constants';
import { CAPABILITIES, GRADE_VALUES, SELECTION_CATEGORIES } from '@/helpers/exerciseHelper';
import { functions } from '@/firebase';

export default {
  components: {
    Table,
    TableCell,
    TabsList,
    ActionButton,
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
      activeTab: 'overview',
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    tabs() {
      const data = [];
      data.push({
        ref: 'overview',
        title: 'Overview',
      });
      data.push({
        ref: 'scoreSheet',
        title: 'Score sheet',
      });
      return data;
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
    isModerationRequired() {
      if (!this.panels) return false;
      return this.panels.length > 1;
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
      return this.$store.getters['stageReview/availableStatuses'](SHORTLISTING.NAME_BLIND_PAPER_SIFT, []);
    },
    panelNamesAsColumns() {
      if (!this.panels) return [];
      return this.panels.map(panel => { return { title: panel.name }; });
    },
    scoreSheetHeaders() {
      const headers = [];
      if (!this.task) return headers;
      if (!this.task.markingScheme) return headers;
      let columns = 0;
      this.task.markingScheme.forEach(item => {
        if (item.type === 'group') {
          if (columns > 0) {
            headers.push({
              ref: '',
              colspan: columns,
            });
            columns = 0;
          }
          headers.push({
            ref: item.ref,
            colspan: item.children.length,
          });
        } else {
          columns += 1;
        }
      });
      return headers;
    },
    scoreSheetColumns() {
      const columns = [];
      if (!this.task) return columns;
      if (!this.task.markingScheme) return columns;
      this.task.markingScheme.forEach(item => {
        if (item.type === 'group') {
          item.children.forEach(child => columns.push(child));
        } else {
          columns.push(item);
        }
      });
      return columns;
    },
    tableColumns() {
      const columns = [];
      columns.push({ title: 'Application', class: 'table-cell-application' });
      columns.push({ title: 'Panel', class: 'table-cell' });
      this.scoreSheetColumns.forEach(column => columns.push({ title: column.ref, class: 'text-center table-cell-score' }));
      if (this.isModerationRequired) {
        columns.push({ title: 'Moderation?', class: 'text-center' });
      }
      // columns.push({ title: 'Report', class: 'text-center' });
      return columns;
    },
    tableData() {
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
            scoreSheet: panel.scoreSheet[applicationId],
            report: panel.reports ? panel.reports[applicationId] : null,
            outcome: panel.outcome,
          };
          rows.push(row);
        });
      });
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
      if (this.capabilities && this.capabilities.indexOf('OVERALL')) {
        data.overallGradesByPanel = {};
        data.overallGrades = {};
        this.grades.forEach(grade => data.overallGrades[grade] = 0);
        data.overallScoreByPanel = {};
        data.overallScore = { count: 0, total: 0, average: 0 };
      }
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
              data.overallGradesByPanel[panel.id][grade] = panel.applicationIds.map(applicationId => panel.scoreSheet[applicationId].OVERALL).filter(item => item === grade).length;
            }
            data.overallGradesByPanel[panel.id].count += data.overallGradesByPanel[panel.id][grade];
            data.overallGrades[grade] += data.overallGradesByPanel[panel.id][grade];
            data.overallScoreByPanel[panel.id].count = data.overallGradesByPanel[panel.id].count;
            data.overallScoreByPanel[panel.id].total += (data.overallGradesByPanel[panel.id][grade] * GRADE_VALUES[grade]);
          });
          data.overallScore.count += data.overallScoreByPanel[panel.id].count;
          data.overallScore.total += data.overallScoreByPanel[panel.id].total;
          data.overallScoreByPanel[panel.id].average = Number(data.overallScoreByPanel[panel.id].total / data.overallScoreByPanel[panel.id].count).toFixed(2) || 0;
        }
        data.totalApplicationsForModeration += panel.applicationIds.filter(applicationId => panel.scoreSheet[applicationId].flagForModeration).length;
      });
      if (data.overallScore) {
        data.overallScore.average = Number(data.overallScore.total / data.overallScore.count).toFixed(2) || 0;
      }
      return data;
    },
  },
  created() {
    this.$store.dispatch(
      'panels/bind',
      {
        exerciseId: this.exercise.id,
        type: this.type,
      }
    );
  },
  methods: {
    btnNext,
    async btnFinalise() {
      await functions.httpsCallable('finaliseTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
    async updateModeration(panelId, applicationId, event) {
      const saveData = {};
      saveData[`scoreSheet.${applicationId}.flagForModeration`] = event.target.checked;
      await this.$store.dispatch('panel/update', { id: panelId, data: saveData } );
    },
  },
};
</script>
