<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    <!-- SCORE SHEET -->
    <div v-show="hasScoreSheet && activeTab == 'scoreSheet'">
      <Table
        ref="scoreSheet"
        data-key="id"
        :data="scoreSheetRows"
        :columns="scoreSheetColumns"
        :page-size="500"
        @change="onChangeScoreSheet"
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
              :to="{
                name: 'exercise-tasks-panels-view',
                params: {
                  type: type,
                  panelId: row.panel.id
                }
              }"
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
        :data="applicationsList"
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
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import TitleBar from '@/components/Page/TitleBar';
import SelectPanel from './components/SelectPanel';
import { APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';
import { PANEL_TYPES } from './Constants';

export default {
  components: {
    Table,
    TableCell,
    TabsList,
    Modal,
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
      tabs: [
        {
          ref: 'panels',
          title: 'Panels',
        },
        {
          ref: 'applications',
          title: 'Applications',
        },
      ],
      activeTab: 'panels',
      panelsLoaded: false,
      selectedItems: [],
      tableColumns: [
        { title: 'Name', sort: 'name', direction: 'asc', default: true },
        { title: 'Status' },
      ],
      tableColumnsApplications: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Panel' },
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseId() {
      return this.exercise.id;
    },
    capabilities() {
      return this.$store.getters['exerciseDocument/capabilities'];
    },
    selectionCategories() {
      return this.$store.getters['exerciseDocument/selectionCategories'];
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
      // columns.push({ title: 'Report', class: 'text-center' });
      return columns;
    },
    applicationsList() {
      let records = [];
      if (this.isSift) {
        records = this.$store.state.stageReview.records;
      }
      if (this.isSelection) {
        records = this.$store.state.stageSelected.records;
      }
      if (this.isScenario) {
        records = this.$store.state.stageReview.records;
      }
      return records;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
  },
  created() {
  },
  watch: {
    panels() {
      if (this.panels && !this.panelsLoaded) {
        console.log('panels loaded');
        this.panelsLoaded = true;
        if (this.hasScoreSheet) {
          if (this.$refs['scoreSheet']) {
            this.$refs['scoreSheet'].loaded();
          }
          this.tabs.unshift({
            ref: 'scoreSheet',
            title: 'Score sheet',
          });
          this.activeTab = 'scoreSheet';
        }
      }
    },
  },
  methods: {
    onChangeScoreSheet() {
      console.log('update score sheet view');
      if (this.$refs['scoreSheet']) {
        this.$refs['scoreSheet'].loaded();
      }
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
          'stageReview/bind',
          {
            exerciseId: this.exerciseId,
            ...params,
          }
        );
      }
      if (this.isSelection) {
        this.$store.dispatch(
          'stageSelected/bind',
          {
            exerciseId: this.exerciseId,
            ...params,
          }
        );
      }
      if (this.isScenario) {
        this.$store.dispatch(
          'stageReview/bind',
          {
            exerciseId: this.exerciseId,
            status: APPLICATION_STATUS.PASSED_FIRST_TEST,
            ...params,
          }
        );
      }
    },
    getPanelName(candidate) {
      if (!candidate.panelIds) { return ''; }
      const panelId = candidate.panelIds[this.type];
      if (!panelId) { return ''; }
      const panel = this.panels.find(p => p.id === panelId);
      return panel ? panel.name : '';
    },
    createNewPanel() {
      this.$router.push({ name: 'exercise-tasks-panels-new' });
    },
    async selectPanel(data) {
      if (data && data.panelId) {
        const updates = this.selectedItems.map(applicationId => {
          const update = {};
          update[`panelIds.${this.type}`] = data.panelId;
          return { id: applicationId, data: update };
        });
        await this.$store.dispatch('candidateApplications/update', updates);
        this.selectedItems = [];
      }
      this.$refs['setPanelModal'].closeModal();
    },
  },
};
</script>
