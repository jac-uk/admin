<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    <!-- PANELS -->
    <div v-show="activeTab == 'panels'">
      <button
        v-if="hasPermissions([PERMISSIONS.panels.permissions.canCreatePanels.value])"
        class="govuk-button govuk-!-margin-bottom-0"
        @click="createNewPanel"
      >
        Create new panel
      </button>
      <Table
        v-if="hasPermissions([PERMISSIONS.panels.permissions.canReadPanels.value])"
        data-key="id"
        :data="panelsList"
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
            v-if="hasPermissions([PERMISSIONS.applicationRecords.permissions.canUpdateApplicationRecords.value])"
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
              target="_blank"
            >
              {{ row.application.referenceNumber }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumnsApplications[1].title">
            <RouterLink
              :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
              target="_blank"
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
        :panels="panelsList"
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
import permissionMixin from '@/permissionMixin';
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
  mixins: [permissionMixin],
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
    isSift() {
      return this.type === PANEL_TYPES.SIFT;
    },
    isSelectionDay() {
      return this.type === PANEL_TYPES.SELECTION;
    },
    isScenario() {
      return this.type === PANEL_TYPES.SCENARIO;
    },
    panelsList() {
      return this.$store.state.panels.records;
    },
    applicationsList() {
      let records = [];
      if (this.isSift) {
        records = this.$store.state.stageReview.records;
      }
      if (this.isSelectionDay) {
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
  methods: {
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
      if (this.isSelectionDay) {
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
      const panel = this.panelsList.find(p => p.id === panelId);
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
