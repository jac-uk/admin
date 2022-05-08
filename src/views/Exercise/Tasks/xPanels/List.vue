<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>

    <div>
      <TabsList
        :tabs="tabs"
        :active-tab.sync="activeTab"
      />
      <!-- OVERVIEW -->
      <div v-show="activeTab == 'overview'">

        <!-- START: INSTRUCTIONS -->
        <div
          v-if="isInitialised"
        >
          <p v-if="hasApplicationsWithoutPanels" class="govuk-body">Please create panels and allocate applications to those panels.</p>
          <p v-else class="govuk-body">Great, all applications have been assigned to their panels. You may now activate this {{ type | lookup }}.</p>
          <div class="govuk-grid-row">
            <div class="govuk-grid-column-one-third">
              <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
                <p class="govuk-body govuk-!-margin-bottom-0">
                  Panels
                  <span class="govuk-caption-m">Total</span>
                </p>
                <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
                  {{ panels.length }}
                </h2>
              </div>
            </div>
            <div
              class="govuk-grid-column-one-third"
            >
              <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
                <p class="govuk-body govuk-!-margin-bottom-0">
                  Applications
                  <span class="govuk-caption-m">Total</span>
                </p>
                <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
                  {{ totalApplications }}
                </h2>
              </div>
            </div>
            <div
              v-if="hasApplicationsWithoutPanels"
              class="govuk-grid-column-one-third"
            >
              <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
                <p class="govuk-body govuk-!-margin-bottom-0">
                  Applications
                  <span class="govuk-caption-m">Not yet assigned to a panel</span>
                </p>
                <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
                  {{ applicationsWithoutPanels.length }}
                </h2>
              </div>
            </div>
            <div
              v-else
              class="govuk-grid-column-one-third"
            >
              <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
                <p class="govuk-body govuk-!-margin-bottom-4">
                  Next step
                </p>
                <button
                  class="govuk-button govuk-!-margin-bottom-1"
                >
                  Activate this {{ type | lookup }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- END: INSTRUCTIONS -->

        <!-- START: STATUS -->
        <div
          v-if="showStatsForStatus"
          class="govuk-grid-row"
        >
          <div
            v-if="stats && stats.statuses"
            class="govuk-grid-column-one-half"
          >
            <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
              <p class="govuk-body govuk-!-margin-bottom-2">
                Status after sift
              </p>
              <Table
                data-key="id"
                :data="Object.entries(stats.statuses)"
                :columns="[{ title: 'Status' }, { title: 'Total' }]"
                local-data
              >
                <template #row="{row}">
                  <TableCell>
                    {{ row[0] | lookup }}
                  </TableCell>
                  <TableCell>
                    {{ row[1] }}
                  </TableCell>
                </template>
              </Table>
            </div>
          </div>
          <div class="govuk-grid-column-one-half">
            <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
              <p class="govuk-body govuk-!-margin-bottom-2">
                Outcome
              </p>
              <button
                class="govuk-button govuk-!-margin-bottom-0"
              >
                Complete sift and update applications
              </button>
            </div>
          </div>
        </div>
        <!-- END: STATUS -->

        <!-- START: PANELS -->
        <div
          v-if="showStatsForPanels"
          class="govuk-grid-row"
        >
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
          v-if="showStatsForGrades"
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
                    :title="panel.name">
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
                      :title="panel.name">
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
          v-if="showStatsForScores"
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
                <template #row="{row}">
                  <TableCell
                    v-for="panel in panels"
                    :key="panel.id"
                    :title="panel.name">
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
      <div v-show="hasScoreSheet && activeTab == 'scoreSheet'">
        <Table
          ref="scoreSheet"
          data-key="id"
          :data="scoreSheetRows"
          :columns="scoreSheetColumns"
          :page-size="500"
          local-data
          class="merit-list"
        >
          <template #header v-if="isSelection">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header table-cell-application"></th>
              <th scope="col" class="govuk-table__header table-cell"></th>
              <th
                v-for="category in selectionCategories"
                :key="category"
                scope="col"
                :colspan="capabilities.length"
                class="govuk-table__header text-center"
              >
                {{ category | lookup }}
              </th>
            </tr>
          </template>
          <template #row="{row}">
            <TableCell class="table-cell-application">
              {{ row.referenceNumber }}
            </TableCell>
            <TableCell class="table-cell">
              <RouterLink
                :to="`${type}/view/${row.panel.id}`"
                class="govuk-link"
              >
                {{ row.panel.name }}
              </RouterLink>
            </TableCell>

            <template v-if="isSift">
              <TableCell
                v-for="(cap, index) in capabilities"
                :key="`sift_${index}`"
                class="text-center table-cell-score"
              >
                {{ row.scoreSheet[cap] }}
              </TableCell>
              <TableCell>
                <Select
                  :id="`status-${row.id}`"
                  class="govuk-!-margin-bottom-0"
                  :value="(row.outcome && row.outcome[row.id]) || ''"
                  @input="updateStatus(row.panel.id, row.id, $event)"
                >
                  <option
                    v-for="status in statuses"
                    :key="status"
                    :value="status"
                  >
                    {{ status | lookup }}
                  </option>
                </Select>

              </TableCell>
            </template>

            <template v-if="isSelection">
              <template
                v-for="category in selectionCategories"
              >
                <TableCell
                  v-for="(cap, index) in capabilities"
                  :key="`${category}_${index}`"
                  class="text-center table-cell-score"
                >
                  <span v-if="row.scoreSheet[category]">
                    {{ row.scoreSheet[category][cap] }}
                  </span>
                </TableCell>
              </template>
            </template>
          </template>
        </Table>
      </div>
      <!-- // END SCORE SHEET -->

      <!-- PANELS -->
      <div v-show="activeTab == 'panels'">
        <button
          class="govuk-button govuk-!-margin-bottom-0"
          @click="createNewPanel"
        >
          Create new panel
        </button>
        <Table
          data-key="id"
          :data="panels"
          :page-size="50"
          :columns="tableColumns"
          @change="getTableData"
        >
          <template #row="{row}">
            <TableCell :title="tableColumns[0].title">
              <RouterLink
                :to="{ name: `exercise-tasks-panels-view`, params: { type: type, panelId: row.id } }"
              >
                {{ row.name }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumns[1].title">
              {{ row.applicationIds ? row.applicationIds.length : 0 }}
            </TableCell>
            <TableCell :title="tableColumns[2].title">
              {{ row.status }}
            </TableCell>
          </template>
        </Table>
      </div>
      <!-- // END PANELS -->

      <!-- APPLICATIONS -->
      <div v-show="activeTab == 'applications'">
        <Table
          data-key="id"
          :data="applicationsWithoutPanels"
          :columns="tableColumnsApplications"
          multi-select
          :selection.sync="selectedItems"
          :page-size="50"
          :search="['candidate.fullName']"
          @change="getTableDataApplications"
        >
          <template #actions>
            <button
              class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
              :disabled="isButtonDisabled"
              @click="$refs['setPanelModal'].openModal()"
            >
              Set Panel
            </button>
          </template>

          <template #row="{row}">
            <TableCell :title="tableColumnsApplications[0].title">
              <RouterLink
                :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
              >
                {{ row.application.referenceNumber }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumnsApplications[1].title">
              <RouterLink
                :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
              >
                {{ row.candidate.fullName }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumnsApplications[2].title">
              {{ getPanelName(row) }}
            </TableCell>
          </template>
        </Table>
      </div>
      <!-- // END APPLICATIONS -->
      <Modal ref="setPanelModal">
        <TitleBar>
          Set panel
        </TitleBar>
        <SelectPanel
          class="govuk-!-margin-6"
          :panels="panels"
          @save="selectPanel"
          @cancel="$refs['setPanelModal'].closeModal()"
        />
      </Modal>
    </div>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import TitleBar from '@/components/Page/TitleBar';
import SelectPanel from './components/SelectPanel';
import { EXERCISE_STAGE, APPLICATION_STATUS, SHORTLISTING } from '@jac-uk/jac-kit/helpers/constants';
import { PANEL_TYPES, PANEL_STATUS } from './Constants';
import { CAPABILITIES, SELECTION_CATEGORIES, GRADES, GRADE_VALUES, TASK_STATUS } from '@/helpers/exerciseHelper';

export default {
  components: {
    Table,
    TableCell,
    TabsList,
    Modal,
    Select,
    TitleBar,
    SelectPanel,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      activeTab: 'overview',
      panelsLoaded: false,
      selectedItems: [],
      tableColumns: [
        { title: 'Name', sort: 'name', direction: 'asc', default: true },
        { title: 'Applications' },
        { title: 'Status' },
      ],
      tableColumnsApplications: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Panel' },
      ],
      // statuses: ['pass', 'reject', 'ineligible', 'moderate', 'withdrawn'],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseId() {
      return this.exercise.id;
    },
    task() {
      if (!this.exercise) return null;
      if (!this.exercise._processingProgress) return null;
      if (!this.exercise._processingProgress[this.type]) return null;
      return this.exercise._processingProgress[this.type];
    },
    taskStatus() {
      return this.task ? this.task.status : '';
    },
    hasBeenInitialised() {
      if (this.taskStatus) {
        return true;
      } else {
        return false;
      }
    },
    hasBeenActivated() {
      if (this.taskStatus && !this.isInitialised) {
        return true;
      } else {
        return false;
      }
    },
    isInitialised() {
      return this.taskStatus === TASK_STATUS.SIFT.INITIALISED;
    },
    isActivated() {
      return this.taskStatus === TASK_STATUS.SIFT.ACTIVATED;
    },
    isFinalised() {
      return this.taskStatus === TASK_STATUS.SIFT.FINALISED;
    },
    isCompleted() {
      return this.taskStatus === TASK_STATUS.SIFT.COMPLETED;
    },
    totalApplications() {
      return this.task ? this.task.applications : 0;
    },
    capabilities() {
      if (!this.exercise) return [];
      return CAPABILITIES.filter(cap => this.exercise.capabilities.indexOf(cap) >= 0);
    },
    selectionCategories() {
      return SELECTION_CATEGORIES;
    },
    grades() {
      return GRADES;
    },
    statuses() {
      return this.$store.getters['stageReview/availableStatuses'](SHORTLISTING.NAME_BLIND_PAPER_SIFT, []);
    },
    tabs() {
      const data = [];
      if (this.hasBeenInitialised) {
        data.push({
          ref: 'overview',
          title: 'Overview',
        });
      }
      if (this.hasBeenActivated && this.hasScoreSheet) {
        data.push({
          ref: 'scoreSheet',
          title: 'Score sheet',
        });
      }
      data.push({
        ref: 'panels',
        title: 'Panels',
      });
      if (this.hasApplicationsWithoutPanels) {
        data.push({
          ref: 'applications',
          title: 'Applications - to be assigned',
        });
      }
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
    panels() {
      return this.$store.state.panels.records;
    },
    hasStats() {
      return this.hasScoreSheet;  // TODO perhaps only show stats when all scores are in?
    },
    stats() {
      const data = {};
      if (this.hasStats) {
        const relevantPanels = this.panels.filter(panel => (panel.status !== PANEL_STATUS.DRAFT && panel.applicationIds));
        data.totalPanels = relevantPanels.length;
        const completedPanels = relevantPanels.filter(panel => panel.status === PANEL_STATUS.SUBMITTED);
        data.completedPanels = completedPanels.length;
        data.totalApplications = 0;
        data.completedApplications = 0;
        data.statuses = {};
        this.statuses.forEach(status => data.statuses[status] = 0);
        if (this.exercise.capabilities && this.exercise.capabilities.indexOf('OVERALL')) {
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
              data.overallGradesByPanel[panel.id][grade] = panel.applicationIds.map(applicationId => panel.scoreSheet[applicationId].OVERALL).filter(item => item === grade).length;
              data.overallGradesByPanel[panel.id].count += data.overallGradesByPanel[panel.id][grade];
              data.overallScoreByPanel[panel.id].count = data.overallGradesByPanel[panel.id].count;
              data.overallScore.count += data.overallScoreByPanel[panel.id].count;
              data.overallGrades[grade] += data.overallGradesByPanel[panel.id][grade];
              data.overallScoreByPanel[panel.id].total += (data.overallGradesByPanel[panel.id][grade] * GRADE_VALUES[grade]);
              data.overallScore.total += data.overallScoreByPanel[panel.id].total;

            });
            data.overallScoreByPanel[panel.id].average = (data.overallScoreByPanel[panel.id].total / data.overallScoreByPanel[panel.id].count);
          }
          if (panel.outcome) {
            Object.values(panel.outcome).forEach(value => data.statuses[value]++);
          }
        });
        if (data.overallScore) {
          data.overallScore.average = data.overallScore.total / data.overallScore.count;
        }
      }
      return data;
    },
    showStatsForStatus() {
      return this.isFinalised;
    },
    showStatsForPanels() {
      return this.isActivated;
    },
    showStatsForGrades() {
      return this.isActivated;
    },
    showStatsForScores() {
      return this.isActivated;
    },
    panelNamesAsColumns() {
      if (!this.panels) return [];
      return this.panels.map(panel => { return { title: panel.name }; });
    },
    hasScoreSheet() {
      if (this.panels && this.panels.length) {
        if (this.panels.find(p => p.scoreSheet)) return true;
      }
      return false;
    },
    scoreSheetRows() {
      const rows = [];
      if (!this.hasScoreSheet) return rows;
      this.panels.forEach(panel => {
        if (!panel.applicationIds) return;
        if (!panel.capabilities) return;
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
    scoreSheetColumns() {
      const columns = [];
      if (!this.hasScoreSheet) return columns;
      columns.push({ title: 'Application', class: 'table-cell-application' });
      columns.push({ title: 'Panel', class: 'table-cell' });
      if (this.isSift) {
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
      }
      if (this.isSelection) {
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
      }
      columns.push({ title: 'Status', class: 'text-center' });
      // columns.push({ title: 'Report', class: 'text-center' });
      return columns;
    },
    applicationsWithoutPanels() {
      return this.$store.state.panels.applicationsWithoutPanels;
    },
    hasApplicationsWithoutPanels() {
      return this.applicationsWithoutPanels.length > 0;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
  },
  watch: {
    panels() {
      if (this.panels && !this.panelsLoaded) {
        this.panelsLoaded = true;
        if (this.hasScoreSheet) {
          this.activeTab = 'scoreSheet';
        }
        if (this.hasStats) {
          this.activeTab = 'overview';
        }
      }
    },
  },
  methods: {
    async initialiseTask() {
      const params = {
        exerciseId: this.exerciseId,
        type: this.type,
      };
      if (this.isSift) {
        params.stage = EXERCISE_STAGE.REVIEW;
      }
      if (this.isSelection) {
        params.stage = EXERCISE_STAGE.SELECTED;
      }
      if (this.isScenario) {
        params.stage = EXERCISE_STAGE.REVIEW;
        params.status = APPLICATION_STATUS.PASSED_FIRST_TEST;
      }
      await functions.httpsCallable('initialiseTask')(params);
    },
    getTableData(params) {
      this.$store.dispatch(
        'panels/bind',
        {
          exerciseId: this.exerciseId,
          type: this.type,
          ...params,
        }
      );
    },
    getTableDataApplications(params) {
      if (this.isSift) {
        this.$store.dispatch(
          'panels/bindApplicationsWithoutPanels',
          {
            exerciseId: this.exerciseId,
            stage: EXERCISE_STAGE.REVIEW,
            type: this.type,
            ...params,
          }
        );
      }
      if (this.isSelection) {
        this.$store.dispatch(
          'panels/bindApplicationsWithoutPanels',
          {
            exerciseId: this.exerciseId,
            stage: EXERCISE_STAGE.SELECTED,
            type: this.type,
            ...params,
          }
        );
      }
      if (this.isScenario) {
        this.$store.dispatch(
          'panels/bindApplicationsWithoutPanels',
          {
            exerciseId: this.exerciseId,
            stage: EXERCISE_STAGE.REVIEW,
            status: APPLICATION_STATUS.PASSED_FIRST_TEST,
            type: this.type,
            ...params,
          }
        );
      }
    },
    getPanelName(application) {
      if (!application[this.type]) { return ''; }
      const panelId = application[this.type].panelId;
      if (!panelId) { return ''; }
      const panel = this.panels.find(p => p.id === panelId);
      return panel ? panel.name : '';
    },
    async updateStatus(panelId, applicationId, status) {
      const saveData = {
        outcome: {},
      };
      saveData.outcome[applicationId] = status;
      await this.$store.dispatch('panel/update', { id: panelId, data: saveData } );
    },
    createNewPanel() {
      this.$router.push({ name: 'exercise-tasks-panels-new' });
    },
    async selectPanel(data) {
      if (data && data.panelId) {
        // update panel with new ids
        await this.$store.dispatch('panel/addApplications', {
          panelId: data.panelId,
          type: this.type,
          applicationIds: this.selectedItems,
        });
        // update applicationRecords
        const updates = this.selectedItems.map(applicationId => {
          const update = {};
          update[`${this.type}.panelId`] = data.panelId;
          return { id: applicationId, data: update };
        });
        await this.$store.dispatch('candidateApplications/update', updates);
        this.selectedItems = [];
      }
      this.$refs['setPanelModal'].closeModal();
      if (this.hasApplicationsWithoutPanels < 1) {
        if (this.hasStats) {
          this.activeTab = 'overview';
        } else {
          this.activeTab = 'panels';
        }
      }
    },
  },
};
</script>
