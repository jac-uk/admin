<template>
  <div>
    <TabsList
      v-model:active-tab="activeTab"
      :tabs="tabs"
    />
    <!-- PANELS -->
    <div v-show="activeTab == 'panels'">
      <button
        v-if="hasPermissions([PERMISSIONS.panels.permissions.canCreatePanels.value])"
        class="govuk-button govuk-!-margin-bottom-0"
        @click="createNewPanel"
      >
        Create New
      </button>
      <Table
        v-if="hasPermissions([PERMISSIONS.panels.permissions.canReadPanels.value]) && panelsList.length"
        data-key="id"
        :data="panelsList"
        :page-size="50"
        :columns="tableColumns"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            <RouterLink
              :to="{ name: `exercise-reports-${row.type}-view`, params: { panelId: row.id } }"
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
    <!-- CANDIDATES -->
    <div v-show="activeTab == 'candidates'">
      <Table
        v-model:selection="selectedItems"
        data-key="id"
        :data="candidatesList"
        :columns="tableColumnsCandidates"
        multi-select
        :page-size="50"
        :search-map="$searchMap.applicationRecords"
        @change="getTableDataCandidates"
      >
        <template #actions>
          <button
            v-if="hasPermissions([PERMISSIONS.applicationRecords.permissions.canUpdateApplicationRecords.value])"
            class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
            :disabled="isButtonDisabled"
            @click="btnClkSelectPanel('modalRefPanel')"
          >
            Set Panel
          </button>
        </template>

        <template #row="{row}">
          <TableCell :title="tableColumnsCandidates[0].title">
            <RouterLink
              :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
              target="_blank"
            >
              {{ row.application.referenceNumber }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumnsCandidates[1].title">
            <RouterLink
              :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
              target="_blank"
            >
              {{ row.candidate.fullName }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumnsCandidates[2].title">
            {{ getPanelName(row) }}
          </TableCell>
        </template>
      </Table>
    </div>
    <!-- // END CANDIDATES -->
    <Modal
      ref="modalRefPanel"
    >
      <component
        :is="`SelectPanel`"
        :panels="panelsList"
        @close="closeModal('modalRefPanel')"
        @selected="selectPanel"
      />
    </Modal>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import SelectPanel from '@/components/ModalViews/SelectPanel.vue';
import { APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';
import permissionMixin from '@/permissionMixin';
import { availableStages } from '../../helpers/exerciseHelper';
import { EXERCISE_STAGE } from '../../helpers/constants';

export default {
  name: 'PanelPacks',
  components: {
    Table,
    TableCell,
    TabsList,
    Modal,
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
      activeTab: 'panels',
      selectedItems: [],
      tableColumns: [
        { title: 'Name', sort: 'name', direction: 'asc', default: true },
        { title: 'Status' },
      ],
      tableColumnsCandidates: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Panel' },
      ],
    };
  },
  computed: {
    tabs(){
      return [
        {
          ref: 'panels',
          title: 'Panels',
        },
        {
          ref: 'candidates',
          title: 'Candidates',
        },
      ];
    },
    exerciseId() {
      return this.$route.params.id;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    siftStage() {
      if (this.exercise) {
        return availableStages(this.exercise)[0];
      }
      return EXERCISE_STAGE.REVIEW;
    },
    panelsList() {
      // eslint-disable-next-line no-console
      // console.log('panelsList', this.$store.state.panels.records);
      return this.$store.state.panels.records;
    },
    candidatesList() {
      return this.$store.state.applicationRecords.records;
    },
    isSift() {
      const routeFullPath = this.$route.fullPath ;
      const route = this.$store.getters['panels/isSift'](routeFullPath);
      return route;
    },
    isSelectionDay() {
      const routeFullPath = this.$route.fullPath ;
      const route = this.$store.getters['panels/isSelectionDay'](routeFullPath);
      return route;
    },
    isScenario() {
      const routeFullPath = this.$route.fullPath ;
      const route = this.$store.getters['panels/isScenario'](routeFullPath);
      return route;
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
    getTableDataCandidates(params) {
      if (this.isSift) {
        this.$store.dispatch(
          'applicationRecords/bind',
          {
            exerciseId: this.exerciseId,
            stage: this.siftStage,
            ...params,
          }
        );
      }
      if (this.isScenario) {
        this.$store.dispatch(
          'applicationRecords/bind',
          {
            exerciseId: this.exerciseId,
            stage: this.siftStage,
            status: APPLICATION_STATUS.PASSED_FIRST_TEST,
            ...params,
          }
        );
      }
      if (this.isSelectionDay) {
        this.$store.dispatch(
          'applicationRecords/bind',
          {
            exerciseId: this.exerciseId,
            stage: this.exercise && this.exercise._processingVersion >= 2 ? EXERCISE_STAGE.SHORTLISTED : EXERCISE_STAGE.SELECTED,
            ...params,
          }
        );
      }
    },
    getPanelName(candidate) {
      if (!candidate.panelIds) {
        return '';
      }
      const panelId = this.isSift ? candidate.panelIds.sift : this.isScenario ? candidate.panelIds.scenario : candidate.panelIds.selection;
      if (!panelId) {
        return '';
      }
      const panel = this.panelsList.find(p => p.id === panelId);
      return panel ? panel.name : '';
    },
    createNewPanel() {
      let routeName = '';
      if (this.type === 'sift') {
        routeName = 'exercise-reports-sift-new';
      } else if (this.type === 'scenario') {
        routeName = 'exercise-reports-scenario-new';
      } else {
        routeName = 'exercise-reports-selection-new';
      }
      this.$router.push({ name: routeName });
    },
    btnClkSelectPanel(modal) {
      this.openModal(modal);
    },
    openModal(modalRef){
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
    },
    async selectPanel(panel) {
      const records = [];
      this.candidatesList.forEach(async (c) => {
        if (this.selectedItems.includes(c.id)) {
          const data = {
            panelIds: c.panelIds ? { ...c.panelIds } : {},
          };
          if (panel.type === 'sift') {
            data.panelIds.sift = panel.id;
          } else if (panel.type === 'scenario') {
            data.panelIds.scenario = panel.id;
          } else {
            data.panelIds.selection = panel.id; // are there other panel types to add?
          }
          records.push({ id: c.id, data: data });
        }
      });
      await this.$store.dispatch('candidateApplications/update', records);
    },
    async candidateSearch(searchTerm) {
      return await this.$store.dispatch('candidates/search', { searchTerm: searchTerm, exerciseId: this.exerciseId });
    },
  },
};
</script>

<style scoped>

</style>
